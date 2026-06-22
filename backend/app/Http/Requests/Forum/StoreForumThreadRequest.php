<?php

namespace App\Http\Requests\Forum;

use Illuminate\Foundation\Http\FormRequest;

class StoreForumThreadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:150'],
            'content' => ['required', 'string', 'min:10', 'max:20000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du sujet est obligatoire.',
            'title.min' => 'Le titre doit contenir au moins :min caracteres.',
            'title.max' => 'Le titre ne peut pas depasser :max caracteres.',
            'content.required' => 'Le contenu du premier message est obligatoire.',
            'content.min' => 'Le contenu doit contenir au moins :min caracteres.',
            'content.max' => 'Le contenu ne peut pas depasser :max caracteres.',
        ];
    }
}
