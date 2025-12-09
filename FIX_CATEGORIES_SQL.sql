-- Fix Articles Without Categories
-- Run this in your database

-- Step 1: Check articles without categories
SELECT a.id, a.title, a.status 
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
WHERE ac.id IS NULL AND a.status = 'published';

-- Step 2: Get category IDs
SELECT id, name FROM categories;

-- Step 3: Assign all published articles to "News" category (change CATEGORY_ID)
INSERT INTO article_category (article_id, category_id, created_at, updated_at)
SELECT a.id, 1, NOW(), NOW()  -- Change 1 to your News category ID
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
WHERE ac.id IS NULL AND a.status = 'published';

-- Step 4: Make sure all articles are published
UPDATE articles 
SET status = 'published', published_at = NOW() 
WHERE status = 'draft' AND published_at IS NULL;

-- Step 5: Verify
SELECT a.id, a.title, c.name as category, a.status
FROM articles a
JOIN article_category ac ON a.id = ac.article_id
JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'published';
