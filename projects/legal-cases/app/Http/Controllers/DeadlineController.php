<?php

namespace App\Http\Controllers;

use App\Models\Deadline;
use App\Models\LegalCase;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DeadlineController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'status' => (string) $request->query('status', 'pending'),
            'assigned_to' => (string) $request->query('assigned_to', ''),
        ];

        $deadlines = Deadline::query()
            ->with(['case.client', 'assignee'])
            ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['assigned_to'] !== '', fn ($query) => $query->where('assigned_to', $filters['assigned_to']))
            ->orderBy('due_at')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (Deadline $deadline) => [
                'id' => $deadline->id,
                'title' => $deadline->title,
                'type' => $deadline->type,
                'due_at' => $deadline->due_at?->toIso8601String(),
                'status' => $deadline->status,
                'assigned_to' => $deadline->assigned_to,
                'assignee' => $deadline->assignee?->name,
                'case_id' => $deadline->legal_case_id,
                'case_title' => $deadline->case?->title,
                'client' => $deadline->case?->client?->name,
                'notes' => $deadline->notes,
            ]);

        return Inertia::render('deadlines/index', [
            'deadlines' => $deadlines,
            'filters' => $filters,
            'users' => User::where('active', true)->orderBy('name')->get(['id', 'name']),
            'cases' => LegalCase::with('client')->orderBy('title')->get(['id', 'client_id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $deadline = Deadline::create($data);

        AuditLogger::record('deadline.created', $deadline, ['title' => $deadline->title]);

        return back()->with('status', 'Vencimiento creado.');
    }

    public function update(Request $request, Deadline $deadline): RedirectResponse
    {
        $data = $this->validated($request);
        $data['completed_at'] = $data['status'] === 'done' ? ($deadline->completed_at ?? now()) : null;
        $deadline->update($data);

        AuditLogger::record('deadline.updated', $deadline, ['title' => $deadline->title, 'status' => $deadline->status]);

        return back()->with('status', 'Vencimiento actualizado.');
    }

    public function complete(Request $request, Deadline $deadline): RedirectResponse
    {
        $deadline->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        AuditLogger::record('deadline.completed', $deadline, ['title' => $deadline->title]);

        return back()->with('status', 'Vencimiento marcado como cumplido.');
    }

    public function destroy(Request $request, Deadline $deadline): RedirectResponse
    {
        abort_if($request->user()->role === 'assistant', 403);

        AuditLogger::record('deadline.deleted', $deadline, ['title' => $deadline->title]);
        $deadline->delete();

        return back()->with('status', 'Vencimiento eliminado.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'legal_case_id' => ['required', 'exists:legal_cases,id'],
            'title' => ['required', 'string', 'max:200'],
            'type' => ['required', 'in:procedural,hearing,filing,meeting,other'],
            'due_at' => ['required', 'date'],
            'status' => ['required', 'in:pending,done,missed'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:4000'],
        ]);
    }
}
