<?php

namespace App\Http\Middleware;

use App\Models\Deadline;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'user' => $user?->only(['id', 'name', 'email', 'role']),
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
            ],
            'nav' => function () use ($user) {
                if (! $user) {
                    return ['overdue' => 0, 'tasks' => 0];
                }

                return [
                    'overdue' => Deadline::where('status', 'pending')->where('due_at', '<', now())->count(),
                    'tasks' => Task::where('status', 'pending')->count(),
                ];
            },
        ]);
    }
}
