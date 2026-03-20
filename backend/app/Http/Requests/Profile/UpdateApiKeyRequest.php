<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApiKeyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Middleware auth:sanctum gère l'accès
    }

    public function rules(): array
    {
        return [
            // Clé API GW2 : 72 caractères, format UUID-like avec tirets
            'api_key' => ['required', 'string', 'size:72'],
        ];
    }

    public function messages(): array
    {
        return [
            'api_key.required' => 'La clé API GW2 est obligatoire.',
            'api_key.size'     => 'La clé API GW2 doit contenir exactement 72 caractères.',
        ];
    }
}