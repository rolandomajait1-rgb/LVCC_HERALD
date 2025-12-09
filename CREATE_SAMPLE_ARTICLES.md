# Create Sample Articles

## Problem
Walang articles sa categories (News, Literary, etc.)

## Solution

### Option 1: Via Admin Dashboard (Recommended)
1. Login as admin
2. Go to Admin Dashboard
3. Click "Create Article"
4. Fill in:
   - Title
   - Content
   - Category (News, Literary, Opinion, etc.)
   - Featured Image
   - Status: Published
5. Repeat for each category

### Option 2: Via Database Seeder

Create file: `backend/database/seeders/ArticleSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;

class ArticleSeeder extends Seeder
{
    public function run()
    {
        $author = Author::first();
        if (!$author) {
            echo "No author found. Create an author first.\n";
            return;
        }

        $categories = [
            'News' => 'Latest news and updates',
            'Literary' => 'Literary works and reviews',
            'Opinion' => 'Opinion pieces and editorials',
            'Art' => 'Art and culture',
            'Features' => 'Feature stories',
            'Sports' => 'Sports news and updates',
            'Specials' => 'Special reports'
        ];

        foreach ($categories as $catName => $description) {
            $category = Category::where('name', $catName)->first();
            
            if ($category) {
                for ($i = 1; $i <= 3; $i++) {
                    $article = Article::create([
                        'title' => "Sample {$catName} Article {$i}",
                        'slug' => strtolower("sample-{$catName}-article-{$i}"),
                        'excerpt' => "This is a sample {$catName} article excerpt.",
                        'content' => "This is the full content of sample {$catName} article {$i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        'author_id' => $author->id,
                        'status' => 'published',
                        'published_at' => now(),
                    ]);

                    $article->categories()->attach($category->id);
                }
            }
        }

        echo "Sample articles created successfully!\n";
    }
}
```

Then run:
```bash
cd backend
php artisan db:seed --class=ArticleSeeder
```

### Option 3: Quick SQL Insert

```sql
-- Get author_id first
SELECT id FROM authors LIMIT 1;

-- Get category IDs
SELECT id, name FROM categories;

-- Insert sample articles (replace AUTHOR_ID and CATEGORY_ID)
INSERT INTO articles (title, slug, excerpt, content, author_id, status, published_at, created_at, updated_at) VALUES
('Breaking News: Sample Article', 'breaking-news-sample', 'This is a sample news article', 'Full content here...', AUTHOR_ID, 'published', NOW(), NOW(), NOW());

-- Link to category
INSERT INTO article_category (article_id, category_id, created_at, updated_at) VALUES
(LAST_INSERT_ID(), CATEGORY_ID, NOW(), NOW());
```

## Quick Fix

Gamitin ang Admin Dashboard:
1. Login as admin
2. Create 2-3 articles per category
3. Set status to "Published"
4. Add featured image
5. Save

Tapos na! 🚀
