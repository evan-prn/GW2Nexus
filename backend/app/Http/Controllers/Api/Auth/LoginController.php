<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Gère l'authentification des utilisateurs existants.
 *
 * Responsabilité unique : vérifier les credentials, appliquer le rate limiting
 * et retourner un token Sanctum valide en cas de succès.
 */
class LoginController extends Controller
{
    /**
     * Authentifie un utilisateur et retourne son token d'accès.
     *
     * Séquence :
     *   1. Vérification du rate limiter (max 5 tentatives/min)
     *   2. Tentative d'authentification via Auth::attempt()
     *   3. En cas d'échec : incrémentation du compteur + réponse 401
     *   4. Vérification du ban actif — refus avec 403 si banni
     *   5. En cas de succès : remise à zéro du compteur + émission du token
     */
    public function store(LoginRequest $request): JsonResponse
    {
        // Étape 1 — Blocage si trop de tentatives récentes
        $request->ensureIsNotRateLimited();

        // Étape 2 — Vérification des credentials en base
        $authenticated = Auth::attempt(
            credentials: $request->only('email', 'password'),
            remember: false
        );

        if (! $authenticated) {
            // Étape 3 — Échec : on incrémente le compteur avant de répondre
            $request->incrementRateLimiter();

            return response()->json([
                'message' => 'Identifiants incorrects.',
                // Message volontairement vague : on ne précise pas si c'est l'email
                // ou le mot de passe qui est erroné (protection contre l'énumération)
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Étape 4 — Vérification du ban actif
        // On vérifie AVANT d'émettre le token pour ne jamais créer de session
        // pour un compte banni. On ne remet pas à zéro le rate limiter ici —
        // une tentative de connexion depuis un compte banni reste comptabilisée.
        $activeBan = $user->bans()->active()->latest()->first();

        if ($activeBan !== null) {
            // On déconnecte la session Laravel créée par Auth::attempt()
            Auth::logout();

            return response()->json([
                'message' => 'Votre compte a été suspendu.',
                'ban'     => [
                    'type'       => $activeBan->type,
                    'reason'     => $activeBan->reason,
                    'expires_at' => $activeBan->expires_at?->toIso8601String(),
                ],
            ], 403);
        }

        // Étape 5 — Succès : remise à zéro + émission du token
        $request->clearRateLimiter();

        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user'    => new UserResource($user),
            'token'   => $token,
        ]);
    }
}