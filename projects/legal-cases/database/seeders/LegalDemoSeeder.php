<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\Client;
use App\Models\Deadline;
use App\Models\Document;
use App\Models\LegalCase;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LegalDemoSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::create([
            'name' => 'Agustín Bertero',
            'email' => 'owner@example.com',
            'password' => Hash::make('DemoPassword123!'),
            'role' => 'owner',
            'active' => true,
        ]);
        $lawyer = User::create([
            'name' => 'Lucía Herrera',
            'email' => 'lucia@example.com',
            'password' => Hash::make('DemoPassword123!'),
            'role' => 'lawyer',
            'active' => true,
        ]);
        $assistant = User::create([
            'name' => 'Sofía Luna',
            'email' => 'sofia@example.com',
            'password' => Hash::make('DemoPassword123!'),
            'role' => 'assistant',
            'active' => true,
        ]);

        $maria = Client::create([
            'type' => 'person',
            'name' => 'María González',
            'tax_id' => '27.345.678-9',
            'email' => 'maria.gonzalez@example.com',
            'phone' => '+54 385 555 0101',
            'address' => 'Av. Belgrano 450, Santiago del Estero',
            'created_by' => $owner->id,
        ]);
        $norte = Client::create([
            'type' => 'company',
            'name' => 'Estudio Contable del Norte S.R.L.',
            'tax_id' => '30-71234567-8',
            'email' => 'administracion@norte.example.com',
            'phone' => '+54 385 555 0102',
            'address' => 'San Martín 221, Santiago del Estero',
            'created_by' => $owner->id,
        ]);
        $juan = Client::create([
            'type' => 'person',
            'name' => 'Juan Pérez',
            'tax_id' => '20.123.456-7',
            'email' => 'juan.perez@example.com',
            'phone' => '+54 385 555 0103',
            'address' => 'Rivadavia 120, La Banda',
            'created_by' => $lawyer->id,
        ]);
        $sol = Client::create([
            'type' => 'company',
            'name' => 'Constructora del Sol S.A.',
            'tax_id' => '30-70987654-3',
            'email' => 'legal@constructorasol.example.com',
            'phone' => '+54 385 555 0104',
            'address' => 'Ruta 9 Km 5, Santiago del Estero',
            'created_by' => $owner->id,
        ]);

        $amparo = LegalCase::create([
            'client_id' => $maria->id,
            'title' => 'González c/ Municipalidad de Santiago del Estero s/ amparo',
            'case_number' => 'EXP-2026-0142',
            'court' => 'Juzgado Civil y Comercial N° 3',
            'jurisdiction' => 'Santiago del Estero',
            'matter' => 'administrative',
            'status' => 'open',
            'parties' => 'Actora: María González. Demandada: Municipalidad de Santiago del Estero.',
            'description' => 'Amparo por falta de respuesta a pedido de acceso a información pública.',
            'started_at' => now()->subMonths(2)->toDateString(),
            'created_by' => $owner->id,
        ]);
        $seguro = LegalCase::create([
            'client_id' => $juan->id,
            'title' => 'Pérez c/ Compañía de Seguros s/ cobro de suma asegurada',
            'case_number' => 'EXP-2026-0087',
            'court' => 'Juzgado Civil y Comercial N° 1',
            'jurisdiction' => 'Santiago del Estero',
            'matter' => 'civil',
            'status' => 'open',
            'parties' => 'Actor: Juan Pérez. Demandada: Compañía de Seguros del Norte.',
            'description' => 'Reclamo por rechazo de cobertura de accidente personal.',
            'started_at' => now()->subMonths(4)->toDateString(),
            'created_by' => $lawyer->id,
        ]);
        $concurso = LegalCase::create([
            'client_id' => $sol->id,
            'title' => 'Constructora del Sol S.A. s/ concurso preventivo',
            'case_number' => 'EXP-2025-0311',
            'court' => 'Juzgado Civil y Comercial N° 5',
            'jurisdiction' => 'Santiago del Estero',
            'matter' => 'commercial',
            'status' => 'paused',
            'parties' => 'Concursada: Constructora del Sol S.A.',
            'description' => 'Presentación de concurso preventivo y negociación con acreedores.',
            'started_at' => now()->subMonths(10)->toDateString(),
            'created_by' => $owner->id,
        ]);
        $societario = LegalCase::create([
            'client_id' => $norte->id,
            'title' => 'Asesoría societaria — Estudio Contable del Norte',
            'case_number' => null,
            'court' => null,
            'jurisdiction' => 'Santiago del Estero',
            'matter' => 'commercial',
            'status' => 'open',
            'parties' => 'Estudio Contable del Norte S.R.L.',
            'description' => 'Revisión de contrato social, actas y régimen de administración.',
            'started_at' => now()->subMonth()->toDateString(),
            'created_by' => $owner->id,
        ]);

        $deadlines = [
            [$amparo, 'Contestar traslado', 'filing', now()->subDays(2)->setTime(10, 30), 'pending', $owner, 'Revisar prueba adjunta antes de presentar.'],
            [$amparo, 'Audiencia de vista de causa', 'hearing', now()->addDays(4)->setTime(9, 0), 'pending', $lawyer, 'Sala 2. Llevar originales.'],
            [$seguro, 'Presentar pericia médica', 'filing', now()->addDays(7)->setTime(12, 0), 'pending', $lawyer, null],
            [$concurso, 'Reunión con acreedores', 'meeting', now()->addDays(12)->setTime(15, 30), 'pending', $owner, 'Confirmar asistencia del síndico.'],
            [$societario, 'Revisar acta de directorio', 'other', now()->addDays(20)->setTime(11, 0), 'pending', $assistant, null],
            [$seguro, 'Contestar excepción', 'filing', now()->subDays(10)->setTime(10, 0), 'done', $lawyer, null],
        ];
        foreach ($deadlines as [$case, $title, $type, $due, $status, $user, $notes]) {
            Deadline::create([
                'legal_case_id' => $case->id,
                'title' => $title,
                'type' => $type,
                'due_at' => $due,
                'status' => $status,
                'assigned_to' => $user->id,
                'notes' => $notes,
                'completed_at' => $status === 'done' ? now()->subDays(9) : null,
            ]);
        }

        Task::create(['legal_case_id' => $amparo->id, 'title' => 'Pedir copia del expediente administrativo', 'due_at' => now()->addDays(1)->setTime(9, 0), 'assigned_to' => $assistant->id, 'created_by' => $owner->id]);
        Task::create(['legal_case_id' => $seguro->id, 'title' => 'Coordinar turno con perito médico', 'due_at' => now()->addDays(3), 'assigned_to' => $lawyer->id, 'created_by' => $owner->id]);
        Task::create(['legal_case_id' => null, 'title' => 'Actualizar carpeta de modelos de escritos', 'due_at' => null, 'assigned_to' => $assistant->id, 'created_by' => $owner->id]);
        Task::create(['legal_case_id' => $concurso->id, 'title' => 'Enviar borrador de acuerdo al síndico', 'due_at' => now()->subDay(), 'status' => 'pending', 'assigned_to' => $owner->id, 'created_by' => $owner->id]);

        $amparo->notes()->create(['user_id' => $owner->id, 'body' => 'La Municipalidad contestó fuera de plazo. Pedir que se tenga presente para la audiencia.']);
        $seguro->notes()->create(['user_id' => $lawyer->id, 'body' => 'La aseguradora ofrece mediación. No aceptar sin informe médico.']);
        $concurso->notes()->create(['user_id' => $owner->id, 'body' => 'Los acreedores principales aceptaron la propuesta base. Falta confirmar el fideicomiso.']);

        foreach ([$amparo, $seguro, $societario] as $case) {
            $bytes = "%PDF-1.4\n% Demo document for {$case->title}\n";
            $path = 'documents/'.Str::uuid().'.enc';
            Storage::disk('local')->put($path, Crypt::encryptString($bytes));
            Document::create([
                'legal_case_id' => $case->id,
                'uploaded_by' => $owner->id,
                'original_name' => 'escrito-'.Str::slug($case->case_number ?? 'borrador').'.pdf',
                'mime' => 'application/pdf',
                'size' => strlen($bytes),
                'sha256' => hash('sha256', $bytes),
                'path' => $path,
                'encrypted' => true,
            ]);
        }

        foreach ([['auth.login', $owner], ['client.created', $owner], ['case.created', $owner], ['deadline.created', $owner], ['document.uploaded', $owner]] as [$action, $user]) {
            AuditLog::create([
                'user_id' => $user->id,
                'action' => $action,
                'created_at' => now()->subMinutes(rand(5, 300)),
                'ip' => '127.0.0.1',
                'user_agent' => 'demo-seeder',
            ]);
        }
    }
}
