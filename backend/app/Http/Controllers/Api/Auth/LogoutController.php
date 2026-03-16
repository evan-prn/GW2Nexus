<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gère la déconnexion des utilisateurs authentifiés.
 *
 * Deux stratégies de révocation sont proposées :
 *   - destroy()     : révoque uniquement le token de la session courante
 *   - destroyAll()  : révoque tous les tokens de l'utilisateur (déconnexion globale)
 *
 * Cette route est protégée par le middleware auth:sanctum — elle n'est
 * accessible qu'aux utilisateurs porteurs d'un token valide.
 */
class LogoutController extends Controller
{
    /**
     * Révoque le token de la session courante.
     *
     * Cas d'usage : déconnexion standard depuis l'appareil actuel.
     * Les autres appareils connectés (mobile, autre navigateur) restent actifs.
     */
    public function destroy(Request $request): JsonResponse
    {
        // Supprime uniquement le token utilisé pour authentifier cette requête
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Révoque tous les tokens actifs de l'utilisateur.
     *
     * Cas d'usage : l'utilisateur suspecte une compromission de son compte
     * et souhaite invalider toutes ses sessions actives simultanément.
     */
    public function destroyAll(Request $request): JsonResponse
    {
        // Supprime l'ensemble des tokens Sanctum associés à cet utilisateur
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Toutes vos sessions ont été fermées.',
        ]);
    }
}