<?php

namespace App\Http\Controllers\Api\Items;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Http\Resources\ItemSummaryResource;
use App\Models\Item;
use App\Services\Gw2ChatCodeService;
use App\Services\Gw2ItemSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Meilisearch\Client;

class ItemController extends Controller
{
    /**
     * GET /api/v1/items — recherche + filtres + pagination + facettes.
     *
     * Filtres exploités (tous optionnels, cumulables) : q, type[], rarity[],
     * level_min, level_max, profession (restrictions), weapon_type[],
     * armor_type[], armor_weight[], stat_set_id[], binding[], game_type[].
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 30), 60);
        $filters = $this->buildFilterExpression($request);

        $builder = Item::search($request->string('q', '')->toString());

        if ($filters !== '') {
            $builder->options(['filter' => $filters]);
        }

        if ($sort = $request->string('sort')->toString()) {
            [$attribute, $direction] = array_pad(explode(':', $sort, 2), 2, 'asc');
            $builder->orderBy($attribute, $direction === 'desc' ? 'desc' : 'asc');
        }

        $paginator = $builder->paginate($perPage);

        return response()->json([
            'data' => ItemSummaryResource::collection(collect($paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'facets' => $this->fetchFacets($request->string('q', '')->toString(), $filters),
        ]);
    }

    /**
     * GET /api/v1/items/autocomplete — suggestions instantanées (barre de
     * recherche ET autocomplétion `#` du forum).
     */
    public function autocomplete(Request $request): JsonResponse
    {
        $query = $request->string('q', '')->toString();

        if ($query === '') {
            return response()->json(['data' => []]);
        }

        $results = Item::search($query)->take(8)->get();

        return response()->json([
            'data' => ItemSummaryResource::collection($results),
        ]);
    }

    /** GET /api/v1/items/{item:gw2_id} */
    public function show(Item $item): JsonResponse
    {
        $item->load('statSet')->loadCount('favorites');

        return response()->json([
            'data' => new ItemResource($item),
        ]);
    }

    /**
     * GET /api/v1/items/resolve-code?code=[&...]
     *
     * Décode un code de chat GW2. Si l'objet n'est pas encore en base
     * (nouveauté depuis le dernier sync), tente une résolution live via
     * l'API GW2 et l'upsert à la volée avant de répondre.
     */
    public function resolveCode(Request $request, Gw2ChatCodeService $decoder, Gw2ItemSyncService $sync): JsonResponse
    {
        $code = $request->string('code', '')->toString();
        $decoded = $decoder->decode($code);

        if ($decoded === null || $decoded['gw2Id'] === null) {
            return response()->json([
                'message' => "Code de chat invalide, illisible, ou correspondant à un type de ressource pas encore pris en charge par l'encyclopédie.",
            ], 422);
        }

        $item = Item::where('gw2_id', $decoded['gw2Id'])->with('statSet')->first()
            ?? $sync->syncSingleItem($decoded['gw2Id']);

        if ($item === null) {
            return response()->json(['message' => 'Objet introuvable.'], 404);
        }

        return response()->json(['data' => new ItemResource($item)]);
    }

    /**
     * POST /api/v1/items/resolve-codes — résolution en lot, utilisée par le
     * rendu enrichi des messages du forum (un seul appel par message affiché).
     */
    public function resolveCodes(Request $request, Gw2ChatCodeService $decoder): JsonResponse
    {
        $codes = $request->input('codes', []);
        $results = [];

        foreach (array_slice((array) $codes, 0, 30) as $code) {
            $decoded = $decoder->decode((string) $code);

            if ($decoded === null || $decoded['type'] !== 'Item' || $decoded['gw2Id'] === null) {
                continue;
            }

            $results[(string) $code] = $decoded['gw2Id'];
        }

        $items = Item::whereIn('gw2_id', array_values($results))->get()->keyBy('gw2_id');

        $data = [];
        foreach ($results as $code => $gw2Id) {
            if ($items->has($gw2Id)) {
                $data[$code] = (new ItemSummaryResource($items->get($gw2Id)))->toArray($request);
            }
        }

        return response()->json(['data' => $data]);
    }

    private function buildFilterExpression(Request $request): string
    {
        $clauses = [];

        $inClause = function (string $field, string $param) use ($request, &$clauses): void {
            $values = $request->query($param);

            if (! is_array($values) || $values === []) {
                return;
            }

            $quoted = collect($values)->map(fn ($v) => '"'.addslashes((string) $v).'"')->implode(', ');
            $clauses[] = "{$field} IN [{$quoted}]";
        };

        $inClause('type', 'type');
        $inClause('rarity', 'rarity');
        $inClause('binding', 'binding');
        $inClause('weapon_type', 'weapon_type');
        $inClause('armor_type', 'armor_type');
        $inClause('armor_weight', 'armor_weight');
        $inClause('stat_set_id', 'stat_set_id');

        if ($request->filled('level_min')) {
            $clauses[] = 'level >= '.(int) $request->integer('level_min');
        }

        if ($request->filled('level_max')) {
            $clauses[] = 'level <= '.(int) $request->integer('level_max');
        }

        if ($request->filled('profession')) {
            $profession = addslashes($request->string('profession')->toString());
            $clauses[] = "restrictions = \"{$profession}\"";
        }

        if ($request->filled('game_type')) {
            $gameType = addslashes($request->string('game_type')->toString());
            $clauses[] = "game_types = \"{$gameType}\"";
        }

        return implode(' AND ', $clauses);
    }

    /**
     * Distribution de facettes (comptage par rareté/type/etc. dans le
     * contexte de recherche courant) — fournie nativement par Meilisearch,
     * pas de table ni d'endpoint séparé.
     *
     * @return array<string, mixed>
     */
    private function fetchFacets(string $query, string $filters): array
    {
        $client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));

        $result = $client->index('items')->search($query, array_filter([
            'filter' => $filters ?: null,
            'facets' => ['type', 'rarity', 'binding', 'weapon_type', 'armor_type', 'armor_weight'],
            'limit' => 0,
        ]));

        return $result->getFacetDistribution() ?? [];
    }
}
