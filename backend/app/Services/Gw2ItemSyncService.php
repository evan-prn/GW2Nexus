<?php

namespace App\Services;

use App\Models\Item;
use App\Models\ItemStatSet;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Synchronise le catalogue GW2 (/v2/items, /v2/itemstats) vers MySQL.
 *
 * L'API GW2 ne permet ni recherche ni filtrage côté serveur — seulement
 * une résolution par liste d'IDs (200 max par appel). Cette synchronisation
 * est donc le préalable technique à la recherche/filtres/pagination de
 * l'encyclopédie (indexation Meilisearch ensuite via `items:sync`).
 */
class Gw2ItemSyncService
{
    private const CHUNK_SIZE = 200; // limite de l'API GW2 pour le paramètre `ids`

    private readonly string $baseUrl;

    private readonly int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.gw2.base_url', 'https://api.guildwars2.com/v2');
        $this->timeout = (int) config('services.gw2.timeout', 10);
    }

    /**
     * Synchronise /v2/itemstats — petite table de référence (~300 lignes),
     * un seul appel. À lancer avant syncItems() pour que la résolution
     * stat_set_id fonctionne dès le premier sync du catalogue.
     */
    public function syncStatSets(): int
    {
        $response = Http::timeout($this->timeout)->get("{$this->baseUrl}/itemstats", ['ids' => 'all']);

        if ($response->failed()) {
            Log::error('Gw2ItemSyncService: echec sync itemstats', ['status' => $response->status()]);

            return 0;
        }

        $now = now();
        $rows = collect($response->json())->map(fn (array $stat) => [
            'id' => $stat['id'],
            'name' => $stat['name'] ?? '',
            'attributes' => json_encode($stat['attributes'] ?? []),
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        if ($rows === []) {
            return 0;
        }

        ItemStatSet::upsert($rows, ['id'], ['name', 'attributes', 'updated_at']);

        return count($rows);
    }

    /**
     * Synchronise le catalogue d'objets par lots de 200 (limite API GW2).
     *
     * @param  list<int>|null  $onlyIds  Restreint la sync à ces IDs (tests / résolution ciblée).
     *                                   Null = récupère et synchronise tout le catalogue.
     * @param  int|null  $limit  Limite le nombre d'objets traités (utile pour valider en dev
     *                           sans attendre un sync complet de plusieurs dizaines de milliers d'objets).
     * @param  (callable(int, int): void)|null  $onProgress  Rappel après chaque lot : (synchronisés, total).
     */
    public function syncItems(?array $onlyIds = null, ?int $limit = null, ?callable $onProgress = null): int
    {
        $ids = $onlyIds ?? $this->fetchAllItemIds();

        if ($limit !== null) {
            $ids = array_slice($ids, 0, $limit);
        }

        $statSetIds = ItemStatSet::pluck('id')->flip();
        $synced = 0;

        foreach (array_chunk($ids, self::CHUNK_SIZE) as $chunk) {
            $response = Http::timeout($this->timeout)->get("{$this->baseUrl}/items", [
                'ids' => implode(',', $chunk),
            ]);

            if ($response->failed()) {
                Log::warning('Gw2ItemSyncService: echec chunk items', [
                    'status' => $response->status(),
                    'count' => count($chunk),
                ]);

                continue;
            }

            $rows = collect($response->json())
                ->map(fn (array $item) => $this->mapApiItem($item, $statSetIds))
                ->all();

            if ($rows !== []) {
                $this->upsertItems($rows);
                $synced += count($rows);
            }

            if ($onProgress !== null) {
                $onProgress($synced, count($ids));
            }
        }

        return $synced;
    }

    /**
     * Récupère et upsert un objet unique à la volée — utilisé quand un code
     * de chat pointe vers un item pas encore présent en base (voir
     * ItemController::resolveCode).
     */
    public function syncSingleItem(int $gw2Id): ?Item
    {
        $response = Http::timeout($this->timeout)->get("{$this->baseUrl}/items/{$gw2Id}");

        if ($response->failed()) {
            return null;
        }

        $statSetIds = ItemStatSet::pluck('id')->flip();
        $this->upsertItems([$this->mapApiItem($response->json(), $statSetIds)]);

        $item = Item::where('gw2_id', $gw2Id)->first();

        // upsert() passe par le query builder brut — les observers Eloquent
        // de Scout ne se déclenchent pas automatiquement. Sans cet appel
        // explicite, l'objet resterait invisible dans la recherche jusqu'au
        // prochain `items:sync` complet, alors qu'il est déjà consultable
        // directement (fiche détail, résolution de code de chat).
        $item?->searchable();

        return $item;
    }

    /**
     * @return list<int>
     */
    private function fetchAllItemIds(): array
    {
        $response = Http::timeout($this->timeout)->get("{$this->baseUrl}/items");

        if ($response->failed()) {
            Log::error('Gw2ItemSyncService: echec recuperation liste des IDs', ['status' => $response->status()]);

            return [];
        }

        return $response->json() ?? [];
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    private function upsertItems(array $rows): void
    {
        Item::upsert($rows, ['gw2_id'], [
            'name', 'icon_url', 'description', 'chat_link', 'type', 'rarity',
            'level', 'vendor_value', 'binding', 'game_types', 'flags',
            'restrictions', 'details', 'stat_set_id', 'synced_at', 'updated_at',
        ]);
    }

    /**
     * @param  array<string, mixed>  $item
     * @param  Collection<int, int>  $statSetIds
     * @return array<string, mixed>
     */
    private function mapApiItem(array $item, Collection $statSetIds): array
    {
        $flags = $item['flags'] ?? [];
        $details = $item['details'] ?? [];
        $statSetId = $details['infix_upgrade']['id'] ?? null;
        $now = now();

        return [
            'gw2_id' => $item['id'],
            'name' => $item['name'] ?? '',
            'icon_url' => $item['icon'] ?? null,
            'description' => $item['description'] ?? null,
            'chat_link' => $item['chat_link'] ?? null,
            'type' => $item['type'] ?? 'Unknown',
            'rarity' => $item['rarity'] ?? 'Basic',
            'level' => $item['level'] ?? 0,
            'vendor_value' => $item['vendor_value'] ?? 0,
            'binding' => $this->resolveBinding($flags),
            'game_types' => json_encode($item['game_types'] ?? []),
            'flags' => json_encode($flags),
            'restrictions' => json_encode($item['restrictions'] ?? []),
            'details' => json_encode($details),
            'stat_set_id' => ($statSetId !== null && $statSetIds->has($statSetId)) ? $statSetId : null,
            'synced_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }

    /**
     * @param  array<int, string>  $flags
     */
    private function resolveBinding(array $flags): string
    {
        if (in_array('SoulbindOnAcquire', $flags, true)) {
            return 'soulbound';
        }

        if (in_array('AccountBindOnUse', $flags, true) || in_array('AccountBound', $flags, true)) {
            return 'account';
        }

        return 'none';
    }
}
