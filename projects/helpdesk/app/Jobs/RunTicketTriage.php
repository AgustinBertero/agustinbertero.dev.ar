<?php

namespace App\Jobs;

use App\Models\Ticket;
use App\Services\TriageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class RunTicketTriage implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    public int $backoff = 5;

    public function __construct(public readonly int $ticketId) {}

    public function handle(TriageService $triage): void
    {
        $ticket = Ticket::query()->find($this->ticketId);
        if (! $ticket) {
            return;
        }

        $ticket->update([
            'triage_status' => 'running',
            'triage_error' => null,
        ]);

        try {
            $result = $triage->triage($ticket);

            $ticket->update([
                'category' => $result['category'],
                'priority' => $result['priority'],
                'summary' => $result['summary'],
                'suggested_reply' => $result['suggested_reply'],
                'citations' => $result['citations'],
                'ai_model' => $result['model'],
                'triage_status' => 'done',
                'triaged_at' => now(),
            ]);
        } catch (Throwable $exception) {
            report($exception);
            $ticket->update([
                'triage_status' => 'failed',
                'triage_error' => mb_substr($exception->getMessage(), 0, 500),
            ]);

            throw $exception;
        }
    }
}
