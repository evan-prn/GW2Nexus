<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation de la requête de ban utilisateur.
 *
 * Centralise les règles de validation et les messages d'erreur,
 * gardant le contrôleur sans logique de validation (SRP).
 */
class BanUserRequest extends FormRequest
{
    /**
     * Seuls les administrateurs peuvent appliquer des bans.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, array<string>>
     */
    public function rules(): array
    {
        return [
            // Type de ban : temporaire ou permanent
            'type'       => ['required', 'in:temporary,permanent'],

            // Motif obligatoire pour la traçabilité
            'reason'     => ['required', 'string', 'min:10', 'max:500'],

            // Date d'expiration — obligatoire pour un ban temporaire
            'expires_at' => [
                'required_if:type,temporary',
                'nullable',
                'date',
                'after:now',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required'          => 'Le type de sanction est obligatoire.',
            'type.in'                => 'Le type doit être "temporary" ou "permanent".',
            'reason.required'        => 'Un motif de sanction est obligatoire.',
            'reason.min'             => 'Le motif doit contenir au moins 10 caractères.',
            'expires_at.required_if' => 'La date d\'expiration est obligatoire pour un ban temporaire.',
            'expires_at.after'       => 'La date d\'expiration doit être dans le futur.',
        ];
    }
}
