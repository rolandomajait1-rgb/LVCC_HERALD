<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'News', 'slug' => 'news', 'description' => 'Latest news and updates'],
            ['name' => 'Opinion', 'slug' => 'opinion', 'description' => 'Opinion pieces and editorials'],
            ['name' => 'Sports', 'slug' => 'sports', 'description' => 'Sports news and coverage'],
            ['name' => 'Literary', 'slug' => 'literary', 'description' => 'Literary works and reviews'],
            ['name' => 'Specials', 'slug' => 'specials', 'description' => 'Special features and reports'],
            ['name' => 'Features', 'slug' => 'features', 'description' => 'Feature stories'],
            ['name' => 'Art', 'slug' => 'art', 'description' => 'Art and culture'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
