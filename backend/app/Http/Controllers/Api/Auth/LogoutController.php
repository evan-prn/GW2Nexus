<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Gère la déconnexion en mode Sanctum SPA cookie.
 *
 * En mode SPA, Sanctum utilise un TransientToken (session) et non un
 * token stocké en base. La déconnexion se fait via Auth::logout()
 * + invalidation + régénération du token CSRF.
 */
class LogoutController extends Controller
{
    /**
     * Déconnexion de la session courante.
     */
    public function destroy(Request $request): JsonResponse
    {
        // Déconnecte l'utilisateur de la session
        auth()->guard('web')->logout();

        // Invalide la session et régénère le token CSRF
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    /**
     * Déconnexion globale — invalide la session courante.
     * En mode SPA cookie, il n'y a qu'une session par navigateur.
     */
    public function destroyAll(Request $request): JsonResponse
    {
        auth()->guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Toutes vos sessions ont été fermées.',
        ]);
    }
}