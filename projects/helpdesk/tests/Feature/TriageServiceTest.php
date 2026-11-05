<?php

namespace Tests\Feature;

use App\Models\KnowledgeArticle;
use App\Models\Ticket;
use App\Services\KnowledgeRetriever;
use App\Services\TriageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TriageServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_retriever_finds_the_relevant_article(): void
    {
        $article = KnowledgeArticle::create([
            'title' => 'Restablecer contraseña',
            'body' => 'El enlace de recuperación vence a los 30 minutos.',
            'tags' => ['cuenta', 'password'],
        ]);

        $results = app(KnowledgeRetriever::class)->search('No puedo recuperar mi contraseña');

        $this->assertSame($article->id, $results->first()['id']);
    }

    public function test_triage_uses_the_llm_and_returns_a_suggestion(): void
    {
        config(['services.deepseek.key' => 'test-key']);
        Http::fake([
            'api.deepseek.com/*' => Http::response([
                'choices' => [[
                    'message' => [
                        'content' => json_encode([
                            'category' => 'account',
                            'priority' => 'high',
                            'summary' => 'La persona no puede recuperar el acceso.',
                            'suggested_reply' => 'Probá pedir un enlace nuevo y revisá spam.',
                            'citations' => [1],
                        ]),
                    ],
                ]],
            ]),
        ]);

        KnowledgeArticle::create([
            'title' => 'Restablecer contraseña',
            'body' => 'El enlace vence a los 30 minutos.',
            'tags' => ['cuenta'],
        ]);

        $ticket = Ticket::create([
            'subject' => 'No puedo entrar',
            'requester_name' => 'Ana',
            'requester_email' => 'ana@example.com',
            'triage_status' => 'pending',
        ]);
        $ticket->messages()->create(['author' => 'customer', 'body' => 'El enlace vence.']);

        $result = app(TriageService::class)->triage($ticket);

        $this->assertSame('account', $result['category']);
        $this->assertSame('high', $result['priority']);
        $this->assertSame('deepseek-chat', $result['model']);
        $this->assertSame([1], $result['citations']);
        Http::assertSent(fn ($request) => str_contains($request->url(), 'chat/completions'));
    }

    public function test_triage_falls_back_to_rules_without_a_key(): void
    {
        config(['services.deepseek.key' => null]);
        KnowledgeArticle::create([
            'title' => 'Cobros duplicados',
            'body' => 'Revisá si el cobro está pendiente o capturado.',
            'tags' => ['facturación'],
        ]);

        $ticket = Ticket::create([
            'subject' => 'Me cobraron dos veces',
            'requester_name' => 'Ana',
            'requester_email' => 'ana@example.com',
            'triage_status' => 'pending',
        ]);
        $ticket->messages()->create(['author' => 'customer', 'body' => 'Es urgente, no puedo trabajar.']);

        $result = app(TriageService::class)->triage($ticket);

        $this->assertSame('billing', $result['category']);
        $this->assertSame('urgent', $result['priority']);
        $this->assertSame('rules-v1', $result['model']);
    }
}
