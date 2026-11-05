<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $clients = Client::query()
            ->withCount('cases')
            ->when($q !== '', function ($query) use ($q) {
                $term = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $q).'%';
                $query->where(fn ($query) => $query
                    ->where('name', 'like', $term)
                    ->orWhere('tax_id', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Client $client) => [
                'id' => $client->id,
                'type' => $client->type,
                'name' => $client->name,
                'tax_id' => $client->tax_id,
                'email' => $client->email,
                'phone' => $client->phone,
                'cases_count' => $client->cases_count,
                'created_at' => $client->created_at?->toIso8601String(),
            ]);

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => ['q' => $q],
        ]);
    }

    public function show(Client $client): Response
    {
        $client->load(['cases' => fn ($query) => $query->with('nextDeadline')->latest('updated_at')]);

        return Inertia::render('clients/show', [
            'client' => [
                'id' => $client->id,
                'type' => $client->type,
                'name' => $client->name,
                'tax_id' => $client->tax_id,
                'email' => $client->email,
                'phone' => $client->phone,
                'address' => $client->address,
                'notes' => $client->notes,
                'created_at' => $client->created_at?->toIso8601String(),
            ],
            'cases' => $client->cases->map(fn ($case) => [
                'id' => $case->id,
                'title' => $case->title,
                'case_number' => $case->case_number,
                'status' => $case->status,
                'matter' => $case->matter,
                'next_deadline' => $case->nextDeadline?->due_at?->toIso8601String(),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['created_by'] = $request->user()->id;
        $client = Client::create($data);

        AuditLogger::record('client.created', $client, ['name' => $client->name]);

        return back()->with('status', 'Cliente creado.');
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $client->update($this->validated($request));
        AuditLogger::record('client.updated', $client, ['name' => $client->name]);

        return back()->with('status', 'Cliente actualizado.');
    }

    public function destroy(Request $request, Client $client): RedirectResponse
    {
        abort_unless($request->user()->isOwner(), 403);

        if ($client->cases()->exists()) {
            return back()->withErrors(['client' => 'No se puede eliminar un cliente con expedientes.']);
        }

        AuditLogger::record('client.deleted', $client, ['name' => $client->name]);
        $client->delete();

        return redirect()->route('clients.index')->with('status', 'Cliente eliminado.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'type' => ['required', 'in:person,company'],
            'name' => ['required', 'string', 'max:160'],
            'tax_id' => ['nullable', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:4000'],
        ]);
    }
}
