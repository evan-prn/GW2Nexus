<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle représentant une sanction (ban) appliquée à un utilisateur.
 *
 * @property int              $id
 * @property int              $user_id
 * @property int              $banned_by
 * @property string           $type         'temporary' | 'permanent'
 * @property string           $reason
 * @property \Carbon\Carbon|null $expires_at
 * @property \Carbon\Carbon|null $lifted_at
 * @property int|null         $lifted_by
 * @property \Carbon\Carbon   $created_at
 * @property \Carbon\Carbon   $updated_at
 */
class UserBan extends Model
{
    protected $fillable = [
        'user_id',
        'banned_by',
        'type',
        'reason',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'lifted_at'  => 'datetime',
    ];

    // ─────────────────────────────────────────────
    // Relations
    // ─────────────────────────────────────────────

    /** Utilisateur sanctionné */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /** Administrateur ayant appliqué la sanction */
    public function bannedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'banned_by');
    }

    /** Administrateur ayant levé la sanction */
    public function liftedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lifted_by');
    }

    // ─────────────────────────────────────────────
    // Scopes
    // ─────────────────────────────────────────────

    /**
     * Scope — bans actuellement actifs (non levés, non expirés).
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query
            ->whereNull('lifted_at')
            ->where(function ($q): void {
                $q->where('type', 'permanent')
                    ->orWhere('expires_at', '>', now());
            });
    }

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────

    /** Indique si ce ban est actuellement actif */
    public function isActive(): bool
    {
        if ($this->lifted_at !== null) {
            return false;
        }

        if ($this->type === 'permanent') {
            return true;
        }

        return $this->expires_at !== null && $this->expires_at->isFuture();
    }
}
