<?php

namespace Tests\Feature;

use App\Jobs\RunTicketTriage;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_ticket_board_renders(): void
    {
        $this->seed();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tickets/index', false)
                ->has('tickets.data')
                ->has('stats'));
    }

    public function test_a_ticket_can_be_created_and_dispatches_triage(): void
    {
        Queue::fake();

        $response = $this->post('/tickets', [
            'subject' => 'No puedo entrar',
            'requester_name' => 'Ana',
            'requester_email' => 'ana@example.com',
            'message' => 'El enlace de acceso vence.',
        ]);

        $ticket = Ticket::query()->firstOrFail();

        $response->assertRedirect(route('tickets.show', $ticket));
        $this->assertDatabaseHas('tickets', ['subject' => 'No puedo entrar']);
        $this->assertDatabaseHas('messages', ['ticket_id' => $ticket->id, 'author' => 'customer']);
        Queue::assertPushed(RunTicketTriage::class, fn (RunTicketTriage $job) => $job->ticketId === $ticket->id);
    }

    public function test_a_ticket_can_be_shown_and_retriaged(): void
    {
        Queue::fake();
        $this->seed();

        $ticket = Ticket::query()->firstOrFail();

        $this->get(route('tickets.show', $ticket))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tickets/show', false)
                ->where('ticket.subject', $ticket->subject)
                ->has('ticket.messages'));

        $this->post(route('tickets.triage', $ticket))
            ->assertRedirect();

        Queue::assertPushed(RunTicketTriage::class);
    }

    public function test_ticket_validation_rejects_missing_fields(): void
    {
        $this->post('/tickets', [])
            ->assertSessionHasErrors(['subject', 'requester_name', 'requester_email', 'message']);
    }

    public function test_redirects_include_the_gateway_prefix(): void
    {
        Queue::fake();

        $response = $this->withHeaders([
            'X-Forwarded-Prefix' => '/helpdesk',
            'X-Forwarded-Proto' => 'https',
            'X-Forwarded-Host' => 'portfolio.bertium.net',
        ])->post('/tickets', [
            'subject' => 'Prueba de prefijo',
            'requester_name' => 'Ana',
            'requester_email' => 'ana@example.com',
            'message' => 'Mensaje de prueba.',
        ]);

        $ticket = Ticket::query()->firstOrFail();
        $response->assertRedirect('https://portfolio.bertium.net/helpdesk/tickets/'.$ticket->id);
    }
}
