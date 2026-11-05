<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'name',
        'tax_id',
        'email',
        'phone',
        'address',
        'notes',
        'created_by',
    ];

    public function cases(): HasMany
    {
        return $this->hasMany(LegalCase::class);
    }
}
