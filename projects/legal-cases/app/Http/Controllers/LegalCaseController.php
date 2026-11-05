<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\LegalCase;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegalCaseController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'status' => (string) $request->query('status', ''),
            'matter' => (string) $request->query('matter', ''),
            'client_id' => (string) $request->query('client_id', ''),
        ];

        $cases = LegalCase::query()
            ->with(['client', 'nextDeadline'])
            ->when($filters['q'] !== '', function ($query) use ($filters) {
                $term = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $filters['q']).'%';
                $query->where(fn ($query) => $query
                    ->where('title', 'like', $term)
                    ->orWhere('case_number', 'like', $term)
                    ->orWhere('court', 'like', $term)
                    ->orWhereHas('client', fn ($client) => $client->where('name', 'like', $term)));
            })
            ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['matter'] !== '', fn ($query) => $query->where('matter', $filters['matter']))
            ->when($filters['client_id'] !== '', fn ($query) => $query->where('client_id', $filters['client_id']))
            ->latest('updated_at')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (LegalCase $case) => [
                'id' => $case->id,
                'title' => $case->title,
                'case_number' => $case->case_number,
                'client' => $case->client?->name,
                'client_id' => $case->client_id,
                'matter' => $case->matter,
                'status' => $case->status,
                'court' => $case->court,
                'next_deadline' => $case->nextDeadline?->due_at?->toIso8601String(),
            ]);

        return Inertia::render('cases/index', [
            'cases' => $cases,
            'filters' => $filters,
            'clients' => Client::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(LegalCase $case): Response
    {
        $case->load([
            'client',
            'deadlines.assignee',
            'documents.uploader',
            'tasks.assignee',
            'notes.user',
        ]);

        return Inertia::render('cases/show', [
            'case' => [
                'id' => $case->id,
                'title' => $case->title,
                'case_number' => $case->case_number,
                'court' => $case->court,
                'jurisdiction' => $case->jurisdiction,
                'matter' => $case->matter,
                'status' => $case->status,
                'parties' => $case->parties,
                'description' => $case->description,
                'started_at' => $case->started_at?->toDateString(),
                'closed_at' => $case->closed_at?->toDateString(),
                'created_at' => $case->created_at?->toIso8601String(),
                'updated_at' => $case->updated_at?->toIso8601String(),
                'client' => [
                    'id' => $case->client->id,
                    'name' => $case->client->name,
                    'tax_id' => $case->client->tax_id,
                    'email' => $case->client->email,
                    'phone' => $case->client->phone,
                ],
            ],
            'deadlines' => $case->deadlines->map(fn ($deadline) => [
                'id' => $deadline->id,
                'title' => $deadline->title,
                'type' => $deadline->type,
                'due_at' => $deadline->due_at?->toIso8601String(),
                'status' => $deadline->status,
                'assignee' => $deadline->assignee?->name,
                'notes' => $deadline->notes,
            ]),
            'documents' => $case->documents->map(fn ($document) => [
                'id' => $document->id,
                'original_name' => $document->original_name,
                'mime' => $document->mime,
                'size' => $document->size,
                'sha256' => $document->sha256,
                'uploaded_by' => $document->uploader?->name,
                'created_at' => $document->created_at?->toIso8601String(),
            ]),
            'tasks' => $case->tasks->map(fn ($task) => [
                'id' => $task->id,
                'title' => $task->title,
                'due_at' => $task->due_at?->toIso8601String(),
                'status' => $task->status,
                'assignee' => $task->assignee?->name,
            ]),
            'notes' => $case->notes->map(fn ($note) => [
                'id' => $note->id,
                'body' => $note->body,
                'user' => $note->user?->name,
                'created_at' => $note->created_at?->toIso8601String(),
            ]),
            'users' => User::where('active', true)->orderBy('name')->get(['id', 'name']),
            'clients' => Client::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['created_by'] = $request->user()->id;
        $case = LegalCase::create($data);

        AuditLogger::record('case.created', $case, ['title' => $case->title]);

        return redirect()->route('cases.show', $case)->with('status', 'Expediente creado.');
    }

    public function update(Request $request, LegalCase $case): RedirectResponse
    {
        $case->update($this->validated($request));
        AuditLogger::record('case.updated', $case, ['title' => $case->title]);

        return back()->with('status', 'Expediente actualizado.');
    }

    public function destroy(Request $request, LegalCase $case): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        AuditLogger::record('case.deleted', $case, ['title' => $case->title]);
        $case->delete();

        return redirect()->route('cases.index')->with('status', 'Expediente eliminado.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'client_id' => ['required', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:200'],
            'case_number' => ['nullable', 'string', 'max:80'],
            'court' => ['nullable', 'string', 'max:160'],
            'jurisdiction' => ['nullable', 'string', 'max:160'],
            'matter' => ['required', 'in:civil,commercial,labor,family,criminal,administrative,other'],
            'status' => ['required', 'in:open,paused,closed,archived'],
            'parties' => ['nullable', 'string', 'max:4000'],
            'description' => ['nullable', 'string', 'max:8000'],
            'started_at' => ['nullable', 'date'],
            'closed_at' => ['nullable', 'date'],
        ]);
    }
}
