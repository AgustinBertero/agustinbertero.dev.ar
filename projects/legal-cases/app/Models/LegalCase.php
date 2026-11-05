<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class LegalCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'legal_cases';

    protected $fillable = [
        'client_id',
        'title',
        'case_number',
        'court',
        'jurisdiction',
        'matter',
        'status',
        'parties',
        'description',
        'started_at',
        'closed_at',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'closed_at' => 'date',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function deadlines(): HasMany
    {
        return $this->hasMany(Deadline::class)->orderBy('due_at');
    }

    public function nextDeadline(): HasOne
    {
        return $this->hasOne(Deadline::class)
            ->where('status', 'pending')
            ->orderBy('due_at');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class)->latest();
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class)->orderBy('due_at');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CaseNote::class)->latest();
    }
}
