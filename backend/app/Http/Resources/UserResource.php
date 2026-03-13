<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Ressource API pour la sérialisation d'un utilisateur.
 *
 * Définit explicitement les champs exposés dans les réponses JSON,
 * garantissant qu'aucun attribut sensible (password, api_key, remember_token,
 * deleted_at) ne soit jamais transmis au client par accident.
 *
 * @mixin \App\Models\User
 */
class UserResource extends JsonResource
{
    /**
     * Transforme l'instance User en tableau JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'nom'              => $this->nom,
            'email'            => $this->email,
            'role'             => $this->role,
            'pseudo_gw2'       => $this->pseudo_gw2,
            'avatar'           => $this->avatar,

            // Indique si une clé API GW2 est configurée, sans exposer la clé elle-même
            'has_api_key'      => $this->hasApiKey(),

            // Indique si l'email a été vérifié
            'email_verified'   => $this->email_verified_at !== null,

            'created_at'       => $this->created_at?->toIso8601String(),
        ];
    }
}