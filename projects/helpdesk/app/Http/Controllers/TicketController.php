<?php

namespace App\Http\Controllers;

use App\Jobs\RunTicketTriage;
use App\Models\KnowledgeArticle;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'status' => (string) $request->query('status', ''),
            'priority' => (string) $request->query('priority', ''),
            'triage' => (string) $request->query('triage', ''),
        ];

        $tickets = Ticket::query()
            ->withCount('messages')
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $term = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $filters['q']).'%';
                $query->where(function ($query) use ($term) {
                    $query->where('subject', 'like', $term)
                        ->orWhere('requester_name', 'like', $term)
                        ->orWhere('requester_email', 'like', $term)
                        ->orWhere('summary', 'like', $term);
                });
            })
            ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['priority'] !== '', fn ($query) => $query->where('priority', $filters['priority']))
            ->when($filters['triage'] !== '', fn ($query) => $query->where('triage_status', $filters['triage']))
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'requester_name' => $ticket->requester_name,
                'requester_email' => $ticket->requester_email,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'triage_status' => $ticket->triage_status,
                'messages_count' => $ticket->messages_count,
                'created_at' => $ticket->created_at?->toIso8601String(),
                'updated_at' => $ticket->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'filters' => $filters,
            'stats' => [
                'open' => Ticket::whereIn('status', ['open', 'pending'])->count(),
                'urgent' => Ticket::whereIn('priority', ['high', 'urgent'])->whereIn('status', ['open', 'pending'])->count(),
                'triaged' => Ticket::where('triage_status', 'done')->count(),
                'resolved' => Ticket::where('status', 'resolved')->count(),
            ],
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load('messages');
        $citations = KnowledgeArticle::query()
            ->whereIn('id', $ticket->citations ?? [])
            ->get(['id', 'title', 'body'])
            ->map(fn (KnowledgeArticle $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => mb_substr(trim(preg_replace('/\s+/', ' ', $article->body) ?? ''), 0, 220),
            ]);

        return Inertia::render('tickets/show', [
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'requester_name' => $ticket->requester_name,
                'requester_email' => $ticket->requester_email,
                'channel' => $ticket->channel,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'category' => $ticket->category,
                'summary' => $ticket->summary,
                'suggested_reply' => $ticket->suggested_reply,
                'citations' => $citations,
                'triage_status' => $ticket->triage_status,
                'triage_error' => $ticket->triage_error,
                'ai_model' => $ticket->ai_model,
                'triaged_at' => $ticket->triaged_at?->toIso8601String(),
                'created_at' => $ticket->created_at?->toIso8601String(),
                'messages' => $ticket->messages->map(fn ($message) => [
                    'id' => $message->id,
                    'author' => $message->author,
                    'body' => $message->body,
                    'created_at' => $message->created_at?->toIso8601String(),
                ]),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:160'],
            'requester_name' => ['required', 'string', 'max:80'],
            'requester_email' => ['required', 'email', 'max:120'],
            'message' => ['required', 'string', 'max:4000'],
        ]);

        $ticket = Ticket::create([
            'subject' => $data['subject'],
            'requester_name' => $data['requester_name'],
            'requester_email' => $data['requester_email'],
            'channel' => 'web',
            'status' => 'open',
            'priority' => 'normal',
            'triage_status' => 'pending',
        ]);

        $ticket->messages()->create([
            'author' => 'customer',
            'body' => $data['message'],
        ]);

        RunTicketTriage::dispatch($ticket->id);

        return redirect()
            ->route('tickets.show', $ticket)
            ->with('status', 'Ticket creado. El triage por IA está en cola.');
    }

    public function triage(Ticket $ticket): RedirectResponse
    {
        if ($ticket->triage_status === 'running') {
            return back()->with('status', 'El triage ya está en curso.');
        }

        $ticket->update(['triage_status' => 'pending', 'triage_error' => null]);
        RunTicketTriage::dispatch($ticket->id);

        return back()->with('status', 'Triage encolado.');
    }
}
