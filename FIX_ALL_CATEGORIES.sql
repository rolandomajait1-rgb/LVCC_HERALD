-- Step 1: Delete all invalid categories (keep only the 7 valid ones)
DELETE FROM categories 
WHERE name NOT IN ('News', 'Opinion', 'Sports', 'Literary', 'Specials', 'Features', 'Art');

-- Step 2: Ensure all 7 valid categories exist
INSERT INTO categories (name, slug, description, created_at, updated_at)
VALUES 
    ('News', 'news', 'Latest news and updates', NOW(), NOW()),
    ('Opinion', 'opinion', 'Opinion pieces and editorials', NOW(), NOW()),
    ('Sports', 'sports', 'Sports news and coverage', NOW(), NOW()),
    ('Literary', 'literary', 'Literary works and reviews', NOW(), NOW()),
    ('Specials', 'specials', 'Special features and reports', NOW(), NOW()),
    ('Features', 'features', 'Feature stories', NOW(), NOW()),
    ('Art', 'art', 'Art and culture', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Step 3: Remove orphaned article-category relationships
DELETE FROM article_category 
WHERE category_id NOT IN (SELECT id FROM categories);

-- Step 4: Verify the fix
SELECT 'Categories:' as info;
SELECT id, name, slug FROM categories ORDER BY name;

SELECT 'Articles without categories:' as info;
SELECT a.id, a.title 
FROM articles a 
LEFT JOIN article_category ac ON a.id = ac.article_id 
WHERE ac.article_id IS NULL;

SELECT 'Article-Category mapping:' as info;
SELECT 
    a.id,
    a.title,
    c.name as category
FROM articles a
JOIN article_category ac ON a.id = ac.article_id
JOIN categories c ON ac.category_id = c.id
ORDER BY a.created_at DESC
LIMIT 10;
