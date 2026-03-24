<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Retourne l'utilisateur actuellement authentifié.
 *
 * Utilisé par le frontend au rechargement de page pour restaurer
 * l'état auth sans redemander les credentials.
 *
 * Retourne 401 si aucun token Bearer n'est présent dans la requête,
 * ce qui est le comportement normal pour un visiteur non connecté.
 */
class MeController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        // Aucun token Bearer fourni — visiteur non authentifié
        // On retourne 401 proprement plutôt que de laisser Laravel planter sur null
        if (! $request->bearerToken()) {
            return response()->json([
                'message' => 'Non authentifié.',
            ], 401);
        }

        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }
}