<?php

namespace App\Http\Controllers;

use App\Models\LegalCase;
use App\Models\Task;
use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request): Response
    {
        $status = (string) $request->query('status', 'pending');

        $tasks = Task::query()
            ->with(['case.client', 'assignee'])
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderByRaw('due_at IS NULL, due_at')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'due_at' => $task->due_at?->toIso8601String(),
                'status' => $task->status,
                'assigned_to' => $task->assigned_to,
                'assignee' => $task->assignee?->name,
                'case_id' => $task->legal_case_id,
                'case_title' => $task->case?->title,
                'notes' => $task->notes,
            ]);

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => ['status' => $status],
            'users' => User::where('active', true)->orderBy('name')->get(['id', 'name']),
            'cases' => LegalCase::with('client')->orderBy('title')->get(['id', 'client_id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['created_by'] = $request->user()->id;
        $task = Task::create($data);

        AuditLogger::record('task.created', $task, ['title' => $task->title]);

        return back()->with('status', 'Tarea creada.');
    }

    public function update(Request $request, Task $task): RedirectResponse
    {
        $data = $this->validated($request);
        $data['completed_at'] = $data['status'] === 'done' ? ($task->completed_at ?? now()) : null;
        $task->update($data);

        AuditLogger::record('task.updated', $task, ['title' => $task->title, 'status' => $task->status]);

        return back()->with('status', 'Tarea actualizada.');
    }

    public function complete(Request $request, Task $task): RedirectResponse
    {
        $task->update([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        AuditLogger::record('task.completed', $task, ['title' => $task->title]);

        return back()->with('status', 'Tarea marcada como hecha.');
    }

    public function destroy(Request $request, Task $task): RedirectResponse
    {
        abort_if($request->user()->role === 'assistant', 403);

        AuditLogger::record('task.deleted', $task, ['title' => $task->title]);
        $task->delete();

        return back()->with('status', 'Tarea eliminada.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'legal_case_id' => ['nullable', 'exists:legal_cases,id'],
            'title' => ['required', 'string', 'max:200'],
            'due_at' => ['nullable', 'date'],
            'status' => ['required', 'in:pending,done'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'notes' => ['nullable', 'string', 'max:4000'],
        ]);
    }
}
