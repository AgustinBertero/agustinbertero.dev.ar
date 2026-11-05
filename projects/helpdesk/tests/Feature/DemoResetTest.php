<?php

namespace Tests\Feature;

use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_reset_restores_the_seed(): void
    {
        $this->seed();
        $original = Ticket::query()->count();
        Ticket::query()->create([
            'subject' => 'Temporal',
            'requester_name' => 'Test',
            'requester_email' => 'test@example.com',
        ]);

        $this->artisan('demo:reset', ['--force' => true])->assertSuccessful();

        $this->assertSame($original, Ticket::query()->count());
        $this->assertDatabaseMissing('tickets', ['subject' => 'Temporal']);
    }
}
