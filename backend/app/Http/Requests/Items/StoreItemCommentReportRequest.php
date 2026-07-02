<?php

namespace App\Http\Requests\Items;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreItemCommentReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'reason' => [
                'required',
                'string',
                Rule::in(['spam', 'insult', 'harassment', 'inappropriate', 'other']),
            ],
            'details' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reason.required' => 'Le motif du signalement est obligatoire.',
            'reason.in' => 'Le motif du signalement est invalide.',
            'details.max' => 'Les details ne peuvent pas depasser :max caracteres.',
        ];
    }
}
