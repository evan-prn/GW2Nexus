<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Champs minimaux — cartes de la grille et autocomplétion (recherche + forum). */
class ItemSummaryResource extends JsonResource
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
            'type' => $this->type,
            'rarity' => $this->rarity,
            'level' => $this->level,
            // Fourni directement par l'API GW2 — jamais recalculé côté client
            // (voir Gw2ChatCodeService : une seule implémentation du format).
            'chat_link' => $this->chat_link,
        ];
    }
}
