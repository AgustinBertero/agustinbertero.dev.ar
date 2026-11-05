<?php

namespace App\Services;

use App\Models\KnowledgeArticle;
use Illuminate\Support\Collection;

class KnowledgeRetriever
{
    private const STOPWORDS = [
        'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'are',
        'was', 'were', 'you', 'your', 'our', 'not', 'but', 'can', 'could', 'would',
        'please', 'hello', 'hola', 'gracias', 'por', 'para', 'con', 'una', 'uno',
        'los', 'las', 'del', 'que', 'como', 'más', 'mas', 'pero', 'sin', 'sobre',
        'está', 'esta', 'estoy', 'tengo', 'hay', 'fue', 'son', 'ser', 'mi', 'mis',
    ];

    /**
     * @return Collection<int, array{id:int,title:string,excerpt:string,score:float}>
     */
    public function search(string $query, int $limit = 3): Collection
    {
        $terms = $this->terms($query);
        if ($terms === []) {
            return collect();
        }

        return KnowledgeArticle::query()
            ->get()
            ->map(function (KnowledgeArticle $article) use ($terms) {
                $title = mb_strtolower($article->title);
                $body = mb_strtolower($article->body);
                $tags = mb_strtolower(implode(' ', $article->tags ?? []));
                $score = 0.0;

                foreach ($terms as $term) {
                    if (str_contains($title, $term)) {
                        $score += 3;
                    }
                    if (str_contains($tags, $term)) {
                        $score += 2;
                    }
                    $score += min(3, substr_count($body, $term)) * 0.5;
                }

                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'excerpt' => $this->excerpt($article->body),
                    'score' => round($score, 2),
                ];
            })
            ->filter(fn (array $item) => $item['score'] > 0)
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    /**
     * @return array<int, string>
     */
    private function terms(string $query): array
    {
        $query = mb_strtolower($query);
        $parts = preg_split('/[^\p{L}\p{N}]+/u', $query, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return collect($parts)
            ->filter(fn (string $term) => mb_strlen($term) >= 3 && ! in_array($term, self::STOPWORDS, true))
            ->unique()
            ->take(24)
            ->values()
            ->all();
    }

    private function excerpt(string $body): string
    {
        $plain = trim(preg_replace('/\s+/', ' ', $body) ?? '');

        return mb_strlen($plain) > 220 ? mb_substr($plain, 0, 217).'...' : $plain;
    }
}
