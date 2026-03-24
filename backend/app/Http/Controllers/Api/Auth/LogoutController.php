<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gère la déconnexion en mode Sanctum Bearer Token.
 *
 * En mode Bearer, Sanctum émet un token opaque stocké en base (personal_access_tokens).
 * La déconnexion consiste à révoquer ce token — pas de session à invalider.
 */
class LogoutController extends Controller
{
    /**
     * Révoque le token Bearer courant (déconnexion de l'appareil actuel).
     *
     * DELETE /api/v1/auth/logout
     */
    public function destroy(Request $request): JsonResponse
    {
        // Révoque uniquement le token utilisé pour cette requête
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Révoque tous les tokens Bearer de l'utilisateur (déconnexion globale).
     * Utile pour "déconnecter tous les appareils" ou après un changement de mot de passe.
     *
     * DELETE /api/v1/auth/logout/all
     */
    public function destroyAll(Request $request): JsonResponse
    {
        // Révoque tous les tokens actifs de l'utilisateur en base
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Toutes vos sessions ont été fermées.',
        ]);
    }
}