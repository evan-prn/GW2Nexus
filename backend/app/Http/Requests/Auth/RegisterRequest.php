<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Requête de validation pour l'inscription d'un nouvel utilisateur.
 *
 * Centralise toutes les règles de validation et les messages d'erreur
 * associés à la création de compte, conformément au principe SRP.
 */
class RegisterRequest extends FormRequest
{
    /**
     * Tout visiteur peut tenter de s'inscrire — pas de pré-autorisation.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation appliquées aux données d'inscription.
     *
     * - nom       : affiché publiquement, entre 3 et 100 caractères
     * - email     : unique en base, normalisé en minuscules par Laravel
     * - password  : minimum 8 caractères, confirmation obligatoire
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'nom'      => ['required', 'string', 'min:3', 'max:100'],
            'email'    => ['required', 'string', 'email:rfc', 'max:255', 'unique:users,email'],
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
            'nom.required'            => 'Le nom d\'affichage est obligatoire.',
            'nom.min'                 => 'Le nom doit contenir au moins :min caractères.',
            'nom.max'                 => 'Le nom ne peut pas dépasser :max caractères.',
            'email.required'          => 'L\'adresse email est obligatoire.',
            'email.email'             => 'L\'adresse email fournie n\'est pas valide.',
            'email.unique'            => 'Cette adresse email est déjà associée à un compte.',
            'password.required'       => 'Le mot de passe est obligatoire.',
            'password.min'            => 'Le mot de passe doit contenir au moins :min caractères.',
            'password.confirmed'      => 'La confirmation du mot de passe ne correspond pas.',
        ];
    }
}