<?php

namespace App\Http\Controllers\Api\Items;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemSummaryResource;
use App\Models\Item;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ItemFavoriteController extends Controller
{
    /**
     * GET /api/v1/items/favorites — favoris de l'utilisateur courant.
     * Alimente la future page "Mes favoris".
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->integer('per_page', 30), 60);

        $items = Item::query()
            ->whereHas('favorites', fn ($query) => $query->where('user_id', $request->user()->id))
            ->orderBy('name')
            ->paginate($perPage);

        return response()->json([
            'data' => ItemSummaryResource::collection($items->items()),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    /** POST /api/v1/items/{item:gw2_id}/favorite */
    public function store(Request $request, Item $item): JsonResponse
    {
        $item->favorites()->firstOrCreate(['user_id' => $request->user()->id]);

        return response()->json(['message' => 'Objet ajoute aux favoris.']);
    }

    /** DELETE /api/v1/items/{item:gw2_id}/favorite */
    public function destroy(Request $request, Item $item): JsonResponse
    {
        $item->favorites()->where('user_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Objet retire des favoris.']);
    }
}
