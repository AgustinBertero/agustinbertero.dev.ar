<?php

namespace App\Http\Controllers;

use App\Models\LegalCase;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CaseNoteController extends Controller
{
    public function store(Request $request, LegalCase $case): RedirectResponse
    {
        $data = $request->validate([
            'body' => ['required', 'string', 'max:8000'],
        ]);

        $note = $case->notes()->create([
            'body' => $data['body'],
            'user_id' => $request->user()->id,
        ]);

        AuditLogger::record('note.created', $note, ['case' => $case->title]);

        return back()->with('status', 'Nota agregada.');
    }
}
