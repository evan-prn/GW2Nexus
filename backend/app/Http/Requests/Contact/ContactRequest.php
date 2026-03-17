<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Toute personne peut envoyer un message de contact (route publique).
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation du formulaire de contact.
     */
    public function rules(): array
    {
        return [
            'name'    => ['required', 'string', 'min:2', 'max:100'],
            'email'   => ['required', 'email:rfc,dns', 'max:255'],
            'subject' => ['nullable', 'string', 'in:bug,feature,account,api,partnership,other'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * Messages d'erreur en français.
     */
    public function messages(): array
    {
        return [
            'name.required'    => 'Votre nom ou pseudo est requis.',
            'name.min'         => 'Le nom doit contenir au moins 2 caractères.',
            'name.max'         => 'Le nom ne peut pas dépasser 100 caractères.',
            'email.required'   => 'Votre adresse email est requise.',
            'email.email'      => 'L\'adresse email n\'est pas valide.',
            'email.max'        => 'L\'adresse email ne peut pas dépasser 255 caractères.',
            'subject.in'       => 'Le sujet sélectionné n\'est pas valide.',
            'message.required' => 'Le message est requis.',
            'message.min'      => 'Le message doit contenir au moins 10 caractères.',
            'message.max'      => 'Le message ne peut pas dépasser 2000 caractères.',
        ];
    }

    /**
     * Noms lisibles des champs pour les messages d'erreur génériques.
     */
    public function attributes(): array
    {
        return [
            'name'    => 'nom',
            'email'   => 'adresse email',
            'subject' => 'sujet',
            'message' => 'message',
        ];
    }
}