<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->isOwner(), 403);

        $action = (string) $request->query('action', '');
        $logs = AuditLog::query()
            ->with('user')
            ->when($action !== '', fn ($query) => $query->where('action', 'like', '%'.$action.'%'))
            ->latest('created_at')
            ->paginate(50)
            ->withQueryString()
            ->through(fn (AuditLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'user' => $log->user?->name ?? 'Sistema',
                'auditable_type' => $log->auditable_type,
                'auditable_id' => $log->auditable_id,
                'meta' => $log->meta,
                'ip' => $log->ip,
                'created_at' => $log->created_at?->toIso8601String(),
            ]);

        return Inertia::render('audit/index', [
            'logs' => $logs,
            'filters' => ['action' => $action],
        ]);
    }
}
