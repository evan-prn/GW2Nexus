<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Fiche complète — page de détail de l'encyclopédie. */
class ItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'gw2_id' => $this->gw2_id,
            'name' => $this->name,
            'icon_url' => $this->icon_url,
            'description' => $this->description,
            'chat_link' => $this->chat_link,
            'type' => $this->type,
            'rarity' => $this->rarity,
            'level' => $this->level,
            'vendor_value' => $this->vendor_value,
            'binding' => $this->binding,
            'game_types' => $this->game_types,
            'flags' => $this->flags,
            'restrictions' => $this->restrictions,
            'details' => $this->details,
            'stat_set' => $this->whenLoaded('statSet', fn () => $this->statSet ? [
                'id' => $this->statSet->id,
                'name' => $this->statSet->name,
                'attributes' => $this->statSet->attributes,
            ] : null),
            'wiki_obtain' => $this->wiki_obtain,
            'wiki_url' => $this->wiki_url,
            'favorites_count' => $this->whenCounted('favorites'),
            // La fiche objet est publique (pas de middleware auth:sanctum) — le guard
            // par défaut ('web', session) ne résoudrait jamais d'utilisateur ici.
            // On interroge explicitement le guard 'sanctum' pour personnaliser l'état
            // "favori" quand un Bearer token valide est fourni, sans exiger l'auth.
            'is_favorited' => $this->when(
                $request->user('sanctum') !== null,
                fn () => $this->favorites()->where('user_id', $request->user('sanctum')->id)->exists(),
            ),
            'synced_at' => $this->synced_at?->toIso8601String(),
        ];
    }
}
