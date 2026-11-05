<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Deadline;
use App\Models\Document;
use App\Models\LegalCase;
use App\Models\Task;
use App\Models\User;
use Database\Seeders\LegalDemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LegalAppTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_owner_can_log_in_and_see_the_dashboard(): void
    {
        $this->seed(LegalDemoSeeder::class);

        $this->post('/login', [
            'email' => 'owner@example.com',
            'password' => 'DemoPassword123!',
        ])->assertRedirect('/');

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard', false)
                ->where('auth.user.email', 'owner@example.com')
                ->has('stats'));
    }

    public function test_inactive_users_cannot_log_in(): void
    {
        $this->seed(LegalDemoSeeder::class);
        User::where('email', 'owner@example.com')->update(['active' => false]);

        $this->post('/login', [
            'email' => 'owner@example.com',
            'password' => 'DemoPassword123!',
        ])->assertSessionHasErrors('email');
    }

    public function test_a_client_and_a_case_can_be_created(): void
    {
        $user = User::factory()->create(['role' => 'lawyer']);
        $this->actingAs($user);

        $this->post('/clients', [
            'type' => 'person',
            'name' => 'Cliente de prueba',
            'tax_id' => '20-12345678-9',
            'email' => 'cliente@example.com',
        ])->assertRedirect();

        $client = Client::firstOrFail();

        $this->post('/cases', [
            'client_id' => $client->id,
            'title' => 'Prueba c/ Prueba s/ daños',
            'matter' => 'civil',
            'status' => 'open',
        ])->assertRedirect();

        $this->assertDatabaseHas('legal_cases', ['title' => 'Prueba c/ Prueba s/ daños']);
        $this->assertDatabaseHas('audit_logs', ['action' => 'case.created']);
    }

    public function test_a_deadline_and_a_task_can_be_completed(): void
    {
        $this->seed(LegalDemoSeeder::class);
        $user = User::where('email', 'owner@example.com')->firstOrFail();
        $this->actingAs($user);

        $case = LegalCase::firstOrFail();
        $deadline = Deadline::firstOrFail();
        $task = Task::firstOrFail();

        $this->post('/deadlines', [
            'legal_case_id' => $case->id,
            'title' => 'Nuevo plazo',
            'type' => 'procedural',
            'due_at' => now()->addDays(2)->toDateTimeString(),
            'status' => 'pending',
        ])->assertRedirect();

        $this->post("/deadlines/{$deadline->id}/complete")->assertRedirect();
        $this->assertSame('done', $deadline->fresh()->status);

        $this->post("/tasks/{$task->id}/complete")->assertRedirect();
        $this->assertSame('done', $task->fresh()->status);
    }

    public function test_documents_are_encrypted_and_downloadable(): void
    {
        Storage::fake('local');
        $this->seed(LegalDemoSeeder::class);
        $this->actingAs(User::where('email', 'owner@example.com')->firstOrFail());

        $case = LegalCase::firstOrFail();
        $file = UploadedFile::fake()->createWithContent('contrato.pdf', '%PDF-1.4 documento de prueba');

        $this->post("/cases/{$case->id}/documents", ['file' => $file])->assertRedirect();

        $document = Document::latest('id')->firstOrFail();
        $this->assertTrue($document->encrypted);
        Storage::disk('local')->assertExists($document->path);
        $this->assertStringNotContainsString('documento de prueba', Storage::disk('local')->get($document->path));

        $this->get("/documents/{$document->id}/download")
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_assistants_cannot_delete_and_lawyers_cannot_manage_users(): void
    {
        $this->seed(LegalDemoSeeder::class);
        $client = Client::firstOrFail();
        $assistant = User::where('role', 'assistant')->firstOrFail();
        $lawyer = User::where('role', 'lawyer')->firstOrFail();

        $this->actingAs($assistant)->delete("/clients/{$client->id}")->assertForbidden();
        $this->actingAs($lawyer)->get('/users')->assertForbidden();
        $this->actingAs($lawyer)->get('/audit')->assertForbidden();
    }

    public function test_owner_can_view_users_and_audit(): void
    {
        $this->seed(LegalDemoSeeder::class);
        $this->actingAs(User::where('email', 'owner@example.com')->firstOrFail());

        $this->get('/users')->assertOk()->assertInertia(fn (Assert $page) => $page->component('users/index', false));
        $this->get('/audit')->assertOk()->assertInertia(fn (Assert $page) => $page->component('audit/index', false));
        $this->assertGreaterThan(0, AuditLog::count());
    }
}
