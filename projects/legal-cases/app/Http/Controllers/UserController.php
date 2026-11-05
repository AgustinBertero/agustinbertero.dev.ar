<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->isOwner(), 403);

        return Inertia::render('users/index', [
            'users' => User::orderBy('name')->get(['id', 'name', 'email', 'role', 'active', 'last_login_at', 'created_at'])
                ->map(fn (User $user) => [
                    ...$user->only(['id', 'name', 'email', 'role', 'active']),
                    'last_login_at' => $user->last_login_at?->toIso8601String(),
                    'created_at' => $user->created_at?->toIso8601String(),
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'role' => ['required', 'in:owner,lawyer,assistant'],
            'password' => ['required', 'confirmed', Password::min(12)],
        ]);

        $user = User::create([...$data, 'active' => true]);
        AuditLogger::record('user.created', $user, ['email' => $user->email, 'role' => $user->role]);

        return back()->with('status', 'Usuario creado.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160', Rule::unique('users', 'email')->ignore($user)],
            'role' => ['required', 'in:owner,lawyer,assistant'],
            'active' => ['required', 'boolean'],
            'password' => ['nullable', 'confirmed', Password::min(12)],
        ]);

        if ($user->is($request->user()) && ! $data['active']) {
            return back()->withErrors(['active' => 'No podés desactivar tu propia cuenta.']);
        }

        if ($user->is($request->user()) && $data['role'] !== 'owner') {
            return back()->withErrors(['role' => 'No podés quitarte el rol de owner.']);
        }

        if ($data['password'] === null) {
            unset($data['password']);
        }

        $user->update($data);
        AuditLogger::record('user.updated', $user, ['email' => $user->email, 'role' => $user->role, 'active' => $user->active]);

        return back()->with('status', 'Usuario actualizado.');
    }
}
