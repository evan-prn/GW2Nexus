<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Champs minimaux pour l'autocomplétion `@` du forum — jamais l'email,
 * contrairement à UserResource qui est réservée au profil de l'utilisateur lui-même.
 */
class UserMentionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nom' => $this->nom,
            'pseudo_gw2' => $this->pseudo_gw2,
            'avatar' => $this->avatar,
        ];
    }
}
