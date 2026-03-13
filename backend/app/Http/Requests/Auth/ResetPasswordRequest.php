<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour la réinitialisation effective du mot de passe.
 *
 * Le token provient du lien envoyé par email. Laravel valide son
 * authenticité et son expiration (60 min par défaut) en interne via
 * la façade Password::reset().
 */
class ResetPasswordRequest extends FormRequest
{
    /**
     * Tout visiteur porteur d'un token valide peut réinitialiser son mot de passe.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation.
     *
     * - token    : transmis via l'URL du lien de réinitialisation
     * - email    : doit correspondre au compte ciblé
     * - password : minimum 8 caractères, confirmation obligatoire
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'token'    => ['required', 'string'],
            'email'    => ['required', 'string', 'email:rfc'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'token.required'       => 'Le token de réinitialisation est manquant.',
            'email.required'       => 'L\'adresse email est obligatoire.',
            'email.email'          => 'L\'adresse email fournie n\'est pas valide.',
            'password.required'    => 'Le nouveau mot de passe est obligatoire.',
            'password.min'         => 'Le mot de passe doit contenir au moins :min caractères.',
            'password.confirmed'   => 'La confirmation du mot de passe ne correspond pas.',
        ];
    }
}