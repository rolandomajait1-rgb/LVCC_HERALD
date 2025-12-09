<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run()
    {
        $tags = [
            'Breaking News',
            'Campus Life',
            'Sports Update',
            'Editorial',
            'Student Voice',
            'Events',
            'Culture',
            'Technology',
            'Health',
            'Environment'
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(
                ['name' => $tagName],
                ['slug' => Str::slug($tagName)]
            );
        }
    }
}
