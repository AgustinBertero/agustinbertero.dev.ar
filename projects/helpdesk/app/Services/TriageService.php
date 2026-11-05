<?php

namespace App\Services;

use App\Models\KnowledgeArticle;
use App\Models\Ticket;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class TriageService
{
    public function __construct(private readonly KnowledgeRetriever $retriever) {}

    /**
     * @return array{category:string,priority:string,summary:string,suggested_reply:string,citations:array<int,int>,model:string}
     */
    public function triage(Ticket $ticket): array
    {
        $ticket->loadMissing('messages');
        $thread = $ticket->messages
            ->map(fn ($message) => strtoupper($message->author).': '.$message->body)
            ->implode("\n\n");

        $retrieved = $this->retriever->search($ticket->subject."\n".$thread, 3);
        $articles = KnowledgeArticle::query()
            ->whereIn('id', $retrieved->pluck('id'))
            ->get()
            ->keyBy('id');

        if (blank(config('services.deepseek.key'))) {
            return $this->fallback($ticket, $thread, $retrieved->all());
        }

        try {
            $response = Http::withToken(config('services.deepseek.key'))
                ->acceptJson()
                ->timeout(35)
                ->post(rtrim(config('services.deepseek.base_url'), '/').'/chat/completions', [
                    'model' => config('services.deepseek.model'),
                    'temperature' => 0.2,
                    'max_tokens' => 700,
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $this->systemPrompt(),
                        ],
                        [
                            'role' => 'user',
                            'content' => $this->userPrompt($ticket, $thread, $retrieved->all(), $articles),
                        ],
                    ],
                ]);

            if (! $response->successful()) {
                throw new \RuntimeException('DeepSeek HTTP '.$response->status());
            }

            $content = $response->json('choices.0.message.content');
            $data = is_string($content) ? json_decode($content, true) : null;
            if (! is_array($data)) {
                throw new \RuntimeException('DeepSeek returned non-JSON content');
            }

            return $this->normalise($data, $ticket, $retrieved->all(), $articles, (string) config('services.deepseek.model'));
        } catch (Throwable $exception) {
            Log::warning('Triage LLM failed, using rules', ['ticket' => $ticket->id, 'error' => $exception->getMessage()]);

            return $this->fallback($ticket, $thread, $retrieved->all());
        }
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
You are a support triage assistant for a software company. Read the ticket and the knowledge base excerpts.
Return ONLY a JSON object with these keys:
- category: one of billing, account, technical, shipping, other
- priority: one of low, normal, high, urgent
- summary: at most two sentences, in the language of the ticket
- suggested_reply: a professional reply to the customer, in the language of the ticket, using the knowledge base when relevant
- citations: an array of knowledge article ids that support the reply (may be empty)

Do not invent policies, prices, addresses or timelines that are not in the knowledge base. If the knowledge base does not answer the question, say what information is needed.
PROMPT;
    }

    /**
     * @param  array<int, array{id:int,title:string,excerpt:string,score:float}>  $retrieved
     * @param  Collection<int, KnowledgeArticle>  $articles
     */
    private function userPrompt(Ticket $ticket, string $thread, array $retrieved, $articles): string
    {
        $knowledge = collect($retrieved)
            ->map(function (array $item) use ($articles) {
                $article = $articles->get($item['id']);
                $body = $article ? mb_substr($article->body, 0, 1200) : $item['excerpt'];

                return "ARTICLE {$item['id']} — {$item['title']}\n{$body}";
            })
            ->implode("\n\n");

        return "TICKET: {$ticket->subject}\nCUSTOMER: {$ticket->requester_name}\n\nTHREAD:\n{$thread}\n\nKNOWLEDGE BASE:\n{$knowledge}";
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, array{id:int,title:string,excerpt:string,score:float}>  $retrieved
     * @param  Collection<int, KnowledgeArticle>  $articles
     * @return array{category:string,priority:string,summary:string,suggested_reply:string,citations:array<int,int>,model:string}
     */
    private function normalise(array $data, Ticket $ticket, array $retrieved, $articles, string $model): array
    {
        $categories = ['billing', 'account', 'technical', 'shipping', 'other'];
        $priorities = ['low', 'normal', 'high', 'urgent'];
        $category = in_array($data['category'] ?? null, $categories, true) ? $data['category'] : 'other';
        $priority = in_array($data['priority'] ?? null, $priorities, true) ? $data['priority'] : 'normal';
        $citations = collect($data['citations'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter(fn (int $id) => $articles->has($id))
            ->unique()
            ->values()
            ->all();

        $summary = trim((string) ($data['summary'] ?? ''));
        $reply = trim((string) ($data['suggested_reply'] ?? ''));

        if ($summary === '' || $reply === '') {
            return $this->fallback($ticket, $ticket->messages->pluck('body')->implode("\n"), $retrieved);
        }

        return [
            'category' => $category,
            'priority' => $priority,
            'summary' => mb_substr($summary, 0, 600),
            'suggested_reply' => mb_substr($reply, 0, 3000),
            'citations' => $citations,
            'model' => $model,
        ];
    }

    /**
     * @param  array<int, array{id:int,title:string,excerpt:string,score:float}>  $retrieved
     * @return array{category:string,priority:string,summary:string,suggested_reply:string,citations:array<int,int>,model:string}
     */
    private function fallback(Ticket $ticket, string $thread, array $retrieved): array
    {
        $text = mb_strtolower($ticket->subject.' '.$thread);
        $category = 'other';
        foreach ([
            'billing' => ['factura', 'cobr', 'cargo', 'tarjeta', 'pago', 'precio', 'invoice', 'charge', 'refund'],
            'account' => ['contraseña', 'password', 'acceso', 'login', 'cuenta', 'email'],
            'technical' => ['error', 'falla', 'no funciona', 'bug', 'api', 'servidor', '500'],
            'shipping' => ['envío', 'envio', 'entrega', 'paquete', 'shipping', 'delivery'],
        ] as $candidate => $needles) {
            foreach ($needles as $needle) {
                if (str_contains($text, $needle)) {
                    $category = $candidate;
                    break 2;
                }
            }
        }

        $priority = 'normal';
        if (preg_match('/urgente|urgent|crítico|critico|caído|caido|down|no puedo trabajar/', $text)) {
            $priority = 'urgent';
        } elseif (preg_match('/bloqueado|blocked|error|falla|no funciona/', $text)) {
            $priority = 'high';
        } elseif (preg_match('/consulta|pregunta|cuando puedan|when you can/', $text)) {
            $priority = 'low';
        }

        $summary = mb_substr(trim(preg_replace('/\s+/', ' ', $thread) ?? $ticket->subject), 0, 280);
        $citationIds = collect($retrieved)->pluck('id')->take(1)->all();
        $article = $retrieved[0] ?? null;
        $reference = $article ? "Revisé la guía «{$article['title']}». " : '';

        return [
            'category' => $category,
            'priority' => $priority,
            'summary' => $summary,
            'suggested_reply' => $reference.'Gracias por escribir. Estamos revisando el caso y te vamos a responder con el próximo paso concreto. Si podés, sumá el número de pedido o el mensaje de error exacto para acelerar la revisión.',
            'citations' => $citationIds,
            'model' => 'rules-v1',
        ];
    }
}
