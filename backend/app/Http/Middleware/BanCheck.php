<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware BanCheck
 *
 * Vérifie à chaque requête authentifiée si l'utilisateur est actuellement banni.
 * En cas de ban actif, retourne une 403 avec les détails de la sanction.
 *
 * Ce middleware doit être appliqué sur le groupe de routes `auth:sanctum`.
 */
class BanCheck
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Aucun utilisateur authentifié — on laisse passer (géré par auth:sanctum)
        if ($user === null) {
            return $next($request);
        }

        // Vérification du ban actif via la relation eager-loadée ou une requête directe
        $activeBan = $user->bans()->active()->latest()->first();

        if ($activeBan !== null) {
            return response()->json([
                'message' => 'Votre compte a été suspendu.',
                'ban'     => [
                    'type'       => $activeBan->type,
                    'reason'     => $activeBan->reason,
                    'expires_at' => $activeBan->expires_at?->toIso8601String(),
                ],
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
