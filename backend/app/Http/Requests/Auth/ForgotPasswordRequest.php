<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour la demande de réinitialisation de mot de passe.
 *
 * Seul l'email est requis : Laravel génère le token et envoie le mail
 * via la façade Password, sans exposer si l'adresse existe ou non en base
 * (protection contre l'énumération d'emails).
 */
class ForgotPasswordRequest extends FormRequest
{
    /**
     * Tout visiteur peut demander une réinitialisation.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc'],
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
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email'    => 'L\'adresse email fournie n\'est pas valide.',
        ];
    }
}