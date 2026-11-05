<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'requester_name',
        'requester_email',
        'channel',
        'status',
        'priority',
        'category',
        'summary',
        'suggested_reply',
        'citations',
        'triage_status',
        'triage_error',
        'ai_model',
        'triaged_at',
    ];

    protected function casts(): array
    {
        return [
            'citations' => 'array',
            'triaged_at' => 'datetime',
        ];
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }

    public function isTriaged(): bool
    {
        return $this->triage_status === 'done';
    }
}
