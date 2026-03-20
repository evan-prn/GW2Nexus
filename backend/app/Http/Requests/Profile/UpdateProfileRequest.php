<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom'       => ['sometimes', 'string', 'min:2', 'max:100'],
            'pseudo_gw2'=> ['sometimes', 'nullable', 'string', 'max:100'],
            'avatar'    => ['sometimes', 'nullable', 'url', 'max:500'],
        ];
    }
}