<?php

namespace App\Http\Resources;

use App\Models\UserBan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Sérialisation d'un utilisateur pour le back-office admin.
 *
 * Expose plus de champs que UserResource (côté public),
 * notamment le statut de ban et les métadonnées de modération.
 *
 * @mixin \App\Models\User
 */
class AdminUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var UserBan|null $activeBan */
        $activeBan = $this->whenLoaded('activeBan', fn () => $this->activeBan);

        return [
            'id'           => $this->id,
            'nom'          => $this->nom,
            'email'        => $this->email,
            'pseudo_gw2'   => $this->pseudo_gw2,
            'avatar'       => $this->avatar,
            'role'         => $this->role,
            'has_api_key'  => $this->hasApiKey(),
            'created_at'   => $this->created_at?->toIso8601String(),
            'deleted_at'   => $this->deleted_at?->toIso8601String(),

            // Statut de ban
            'is_banned'    => $activeBan !== null,
            'active_ban'   => $activeBan ? [
                'id'         => $activeBan->id,
                'type'       => $activeBan->type,
                'reason'     => $activeBan->reason,
                'expires_at' => $activeBan->expires_at?->toIso8601String(),
                'banned_at'  => $activeBan->created_at->toIso8601String(),
                'banned_by'  => $activeBan->bannedBy?->nom,
            ] : null,

            // Historique complet — uniquement sur la vue détail
            'ban_history'  => $this->whenLoaded('bans', function () {
                return $this->bans->map(fn (UserBan $ban) => [
                    'id'         => $ban->id,
                    'type'       => $ban->type,
                    'reason'     => $ban->reason,
                    'expires_at' => $ban->expires_at?->toIso8601String(),
                    'lifted_at'  => $ban->lifted_at?->toIso8601String(),
                    'is_active'  => $ban->isActive(),
                    'banned_by'  => $ban->bannedBy?->nom,
                    'lifted_by'  => $ban->liftedBy?->nom,
                    'created_at' => $ban->created_at->toIso8601String(),
                ]);
            }),
        ];
    }
}
