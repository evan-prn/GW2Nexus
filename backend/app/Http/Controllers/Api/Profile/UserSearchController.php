<?php

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserMentionResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Recherche légère d'utilisateurs pour l'autocomplétion `@` de l'éditeur
 * forum. Protégée par auth:sanctum (seuls les utilisateurs connectés
 * rédigent) — ne renvoie jamais l'email (voir UserMentionResource).
 */
class UserSearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->string('q', '')->toString();

        if (mb_strlen($query) < 2) {
            return response()->json(['data' => []]);
        }

        $users = User::query()
            ->where(fn ($q) => $q->where('nom', 'like', "%{$query}%")->orWhere('pseudo_gw2', 'like', "%{$query}%"))
            ->limit(8)
            ->get();

        return response()->json(['data' => UserMentionResource::collection($users)]);
    }
}
