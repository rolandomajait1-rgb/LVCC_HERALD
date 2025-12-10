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
            'title' => 'required|string|max:255|regex:/^[a-zA-Z0-9\s\-_.,!?()]+$/',
            'content' => $isDraft ? 'nullable|string|max:50000' : 'required|string|min:10|max:50000',
            'category' => 'sometimes|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'category_id' => 'required_without:category|integer|exists:categories,id',
            'tags' => 'nullable|string|max:500|regex:/^[a-zA-Z0-9\s,\-_]+$/',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'author' => 'sometimes|string|min:1|max:100|exists:authors,name|regex:/^[a-zA-Z\s.]+$/',
            'author_name' => 'required_without:author|string|min:1|max:100|regex:/^[a-zA-Z\s.]+$/',
            'status' => 'sometimes|in:draft,published',
        ];
    }
}
