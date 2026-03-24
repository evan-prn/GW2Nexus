<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

/**
 * Gère la réinitialisation effective du mot de passe.
 *
 * Reçoit le token du lien email, valide sa cohérence avec l'adresse fournie,
 * puis met à jour le mot de passe si tout est valide.
 *
 * Laravel gère en interne via Password::reset() :
 *   - La vérification du token (comparaison hash sécurisée)
 *   - L'expiration du token (60 minutes par défaut, configurable dans auth.php)
 *   - La suppression du token après utilisation (usage unique)
 */
class ResetPasswordController extends Controller
{
    /**
     * Réinitialise le mot de passe à partir du token reçu par email.
     *
     * Séquence interne de Password::reset() :
     *   1. Vérifie que l'email existe en base
     *   2. Vérifie que le token est valide et non expiré
     *   3. Exécute le callback (mise à jour du mot de passe)
     *   4. Supprime le token de la table password_reset_tokens
     *   5. Déclenche l'event PasswordReset
     *
     * Sécurité Bearer — correction Sprint 2 :
     *   Tous les tokens Sanctum actifs sont révoqués après le reset.
     *   Un token volé avant le reset ne peut plus être utilisé ensuite.
     *
     * POST /api/v1/auth/reset-password
     */
    public function store(ResetPasswordRequest $request): JsonResponse
    {
        $statut = Password::reset(
            credentials: $request->only('token', 'email', 'password'),
            callback: function (User $user, string $password): void {

                // Mise à jour du mot de passe
                // Le hash bcrypt est appliqué automatiquement via le cast 'hashed' du modèle
                $user->password = $password;

                // Régénération du remember_token pour invalider les sessions "se souvenir de moi"
                $user->setRememberToken(Str::random(60));

                // saveQuietly() évite de déclencher les observers Eloquent
                // (pas d'event updated, pas d'audit trail parasite)
                $user->saveQuietly();

                // Révocation de tous les tokens Bearer actifs — sécurité post-reset
                // Un token potentiellement volé avant le reset devient immédiatement inutilisable
                $user->tokens()->delete();

                // Déclenche l'event PasswordReset (utile pour les listeners futurs : logs, audit, etc.)
                event(new PasswordReset($user));
            }
        );

        // Token invalide, expiré ou email introuvable en base
        if ($statut !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Le lien de réinitialisation est invalide ou a expiré.',
                'errors'  => ['token' => [__($statut)]],
            ], 422);
        }

        return response()->json([
            'message' => 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        ]);
    }
}