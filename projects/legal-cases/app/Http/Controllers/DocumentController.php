<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\LegalCase;
use App\Services\DocumentCipher;
use App\Support\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function store(Request $request, LegalCase $case, DocumentCipher $cipher): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:15360', 'mimes:pdf,jpg,jpeg,png,doc,docx'],
        ]);

        $file = $request->file('file');
        $stored = $cipher->store($file);

        $document = $case->documents()->create([
            ...$stored,
            'original_name' => $file->getClientOriginalName(),
            'uploaded_by' => $request->user()->id,
            'encrypted' => true,
        ]);

        AuditLogger::record('document.uploaded', $document, [
            'name' => $document->original_name,
            'case' => $case->title,
        ]);

        return back()->with('status', 'Documento cifrado y guardado.');
    }

    public function download(Request $request, Document $document, DocumentCipher $cipher): StreamedResponse
    {
        $bytes = $cipher->read($document);

        AuditLogger::record('document.downloaded', $document, [
            'name' => $document->original_name,
            'case' => $document->case?->title,
        ]);

        return response()->streamDownload(
            fn () => print $bytes,
            $document->original_name,
            [
                'Content-Type' => $document->mime,
                'X-Content-Type-Options' => 'nosniff',
            ],
        );
    }

    public function destroy(Request $request, Document $document, DocumentCipher $cipher): RedirectResponse
    {
        abort_if($request->user()->role === 'assistant', 403);

        AuditLogger::record('document.deleted', $document, ['name' => $document->original_name]);
        $cipher->delete($document);
        $document->delete();

        return back()->with('status', 'Documento eliminado.');
    }
}
