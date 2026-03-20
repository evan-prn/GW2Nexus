<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfilGw2 extends Model
{
    protected $table = 'profils_gw2';

    protected $fillable = [
        'user_id',
        'nom_compte',
        'monde',
        'personnages',
        'derniere_synchro',
        'valide',
    ];

    protected $casts = [
        'personnages'      => 'array',
        'derniere_synchro' => 'datetime',
        'valide'           => 'boolean',
    ];

    // ─── Relations ────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}