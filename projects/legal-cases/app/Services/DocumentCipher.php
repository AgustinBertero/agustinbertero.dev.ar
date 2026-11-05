<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentCipher
{
    /**
     * @return array{path:string,sha256:string,mime:string,size:int}
     */
    public function store(UploadedFile $file): array
    {
        $bytes = file_get_contents($file->getRealPath());
        if ($bytes === false) {
            throw new \RuntimeException('No se pudo leer el archivo.');
        }

        $path = 'documents/'.Str::uuid().'.enc';
        Storage::disk('local')->put($path, Crypt::encryptString($bytes));

        return [
            'path' => $path,
            'sha256' => hash('sha256', $bytes),
            'mime' => $file->getMimeType() ?: 'application/octet-stream',
            'size' => $file->getSize(),
        ];
    }

    public function read(Document $document): string
    {
        $payload = Storage::disk('local')->get($document->path);
        if ($payload === null) {
            throw new \RuntimeException('El archivo no está disponible.');
        }

        return Crypt::decryptString($payload);
    }

    public function delete(Document $document): void
    {
        Storage::disk('local')->delete($document->path);
    }
}
