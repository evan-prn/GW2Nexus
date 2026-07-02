<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

/**
 * Objet du catalogue GW2, synchronisé depuis /v2/items.
 *
 * Indexé dans Meilisearch (trait Searchable) pour la recherche
 * instantanée, la tolérance aux fautes et les facettes de filtres.
 */
class Item extends Model
{
    use Searchable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'gw2_id',
        'name',
        'icon_url',
        'description',
        'chat_link',
        'type',
        'rarity',
        'level',
        'vendor_value',
        'binding',
        'game_types',
        'flags',
        'restrictions',
        'details',
        'stat_set_id',
        'wiki_obtain',
        'wiki_url',
        'synced_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'game_types' => 'array',
            'flags' => 'array',
            'restrictions' => 'array',
            'details' => 'array',
            'synced_at' => 'datetime',
        ];
    }

    public function statSet(): BelongsTo
    {
        return $this->belongsTo(ItemStatSet::class, 'stat_set_id');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(ItemFavorite::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ItemComment::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'item_favorites');
    }

    // -------------------------------------------------------------------
    // Scout / Meilisearch
    // -------------------------------------------------------------------

    public function searchableAs(): string
    {
        return 'items';
    }

    /**
     * Champs exposés à Meilisearch — recherche texte (name/description)
     * et attributs filtrables/facettables (voir items:configure-search-index
     * pour la configuration des filterableAttributes correspondants).
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        $details = $this->details ?? [];

        return [
            'id' => $this->id,
            'gw2_id' => $this->gw2_id,
            'name' => $this->name,
            'description' => strip_tags((string) $this->description),
            'type' => $this->type,
            // `details.type` porte des sens différents selon la catégorie
            // (type d'arme pour Weapon, emplacement pour Armor) — il faut
            // le ventiler par catégorie pour ne pas mélanger les facettes.
            'weapon_type' => $this->type === 'Weapon' ? ($details['type'] ?? null) : null,
            'armor_type' => $this->type === 'Armor' ? ($details['type'] ?? null) : null,
            'armor_weight' => $this->type === 'Armor' ? ($details['weight_class'] ?? null) : null,
            'rarity' => $this->rarity,
            'level' => $this->level,
            'binding' => $this->binding,
            'stat_set_id' => $this->stat_set_id,
            'stat_set_name' => $this->statSet?->name,
            'restrictions' => $this->restrictions ?? [],
            'game_types' => $this->game_types ?? [],
            'flags' => $this->flags ?? [],
        ];
    }
}
