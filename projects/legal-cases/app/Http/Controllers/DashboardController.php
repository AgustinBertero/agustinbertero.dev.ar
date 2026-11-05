<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Deadline;
use App\Models\LegalCase;
use App\Models\Task;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = now();

        return Inertia::render('dashboard', [
            'stats' => [
                'open_cases' => LegalCase::whereIn('status', ['open', 'paused'])->count(),
                'clients' => Client::count(),
                'overdue' => Deadline::where('status', 'pending')->where('due_at', '<', $now)->count(),
                'upcoming' => Deadline::where('status', 'pending')->whereBetween('due_at', [$now, $now->copy()->addDays(14)])->count(),
            ],
            'overdue' => Deadline::query()
                ->with(['case.client', 'assignee'])
                ->where('status', 'pending')
                ->where('due_at', '<', $now)
                ->orderBy('due_at')
                ->limit(6)
                ->get()
                ->map(fn (Deadline $deadline) => $this->deadline($deadline)),
            'upcoming' => Deadline::query()
                ->with(['case.client', 'assignee'])
                ->where('status', 'pending')
                ->whereBetween('due_at', [$now, $now->copy()->addDays(30)])
                ->orderBy('due_at')
                ->limit(8)
                ->get()
                ->map(fn (Deadline $deadline) => $this->deadline($deadline)),
            'tasks' => Task::query()
                ->with('case')
                ->where('status', 'pending')
                ->orderByRaw('due_at IS NULL, due_at')
                ->limit(6)
                ->get()
                ->map(fn (Task $task) => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'due_at' => $task->due_at?->toIso8601String(),
                    'case_id' => $task->legal_case_id,
                    'case_title' => $task->case?->title,
                ]),
            'recentCases' => LegalCase::query()
                ->with('client')
                ->latest('updated_at')
                ->limit(5)
                ->get()
                ->map(fn (LegalCase $case) => [
                    'id' => $case->id,
                    'title' => $case->title,
                    'client' => $case->client?->name,
                    'status' => $case->status,
                    'updated_at' => $case->updated_at?->toIso8601String(),
                ]),
            'activity' => AuditLog::query()
                ->with('user')
                ->latest('created_at')
                ->limit(8)
                ->get()
                ->map(fn (AuditLog $log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user' => $log->user?->name ?? 'Sistema',
                    'created_at' => $log->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function deadline(Deadline $deadline): array
    {
        return [
            'id' => $deadline->id,
            'title' => $deadline->title,
            'due_at' => $deadline->due_at?->toIso8601String(),
            'status' => $deadline->status,
            'case_id' => $deadline->legal_case_id,
            'case_title' => $deadline->case?->title,
            'client' => $deadline->case?->client?->name,
            'assignee' => $deadline->assignee?->name,
        ];
    }
}
