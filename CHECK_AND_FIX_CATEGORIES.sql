-- Check current state
SELECT 'Total Articles:' as info, COUNT(*) as count FROM articles WHERE deleted_at IS NULL;
SELECT 'Published Articles:' as info, COUNT(*) as count FROM articles WHERE status = 'published' AND deleted_at IS NULL;
SELECT 'Total Categories:' as info, COUNT(*) as count FROM categories;
SELECT 'Article-Category Links:' as info, COUNT(*) as count FROM article_category;

-- Show articles without categories
SELECT a.id, a.title, a.status 
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
WHERE ac.article_id IS NULL AND a.deleted_at IS NULL;

-- Fix: Assign random category to articles without categories
INSERT INTO article_category (article_id, category_id)
SELECT a.id, (SELECT id FROM categories ORDER BY RANDOM() LIMIT 1)
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
WHERE ac.article_id IS NULL AND a.deleted_at IS NULL;

-- Verify fix
SELECT 'Articles with Categories After Fix:' as info, COUNT(DISTINCT article_id) as count FROM article_category;
