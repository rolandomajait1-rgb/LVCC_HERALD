<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isDraft = $this->input('status') === 'draft';
        
        return [
            'title' => 'required|string|max:255',
            'content' => $isDraft ? 'nullable|string' : 'required|string',
            'category' => 'sometimes|string|max:255',
            'category_id' => 'required_without:category|integer|exists:categories,id',
            'tags' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'author' => 'sometimes|string|min:1|exists:authors,name',
            'author_name' => 'required_without:author|string|min:1',
        ];
    }
}
