<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

/**
 * Gère la demande de réinitialisation de mot de passe.
 *
 * Délègue entièrement à la façade Password de Laravel :
 *   - génération et stockage sécurisé du token (hashé en base)
 *   - envoi du mail via la Notification PasswordReset
 *   - gestion du TTL du token (60 minutes par défaut, configurable dans auth.php)
 */
class ForgotPasswordController extends Controller
{
    /**
     * Envoie le lien de réinitialisation à l'adresse email fournie.
     *
     * Sécurité — protection contre l'énumération d'emails :
     * La réponse HTTP est identique (200) qu'un compte existe ou non.
     * Le message retourné peut varier légèrement selon le statut Laravel,
     * mais ne confirme jamais explicitement l'existence du compte.
     */
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        // Password::sendResetLink() vérifie l'existence de l'email en base,
        // génère un token sécurisé et envoie la notification.
        $statut = Password::sendResetLink(
            $request->only('email')
        );

        // Que le compte existe ou non, on retourne toujours un 200
        // pour éviter l'énumération des adresses email enregistrées.
        return response()->json([
            'message' => $statut === Password::RESET_LINK_SENT
                ? 'Si un compte est associé à cette adresse, un email de réinitialisation vient d\'être envoyé.'
                : 'Si un compte est associé à cette adresse, un email de réinitialisation vient d\'être envoyé.',
        ]);
    }
}