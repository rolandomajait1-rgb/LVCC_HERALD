-- Fix article excerpts by regenerating them from content
-- This removes HTML tags and limits to 150 characters

UPDATE articles 
SET excerpt = LEFT(
    REGEXP_REPLACE(
        REGEXP_REPLACE(content, '<[^>]+>', '', 'g'),  -- Remove HTML tags
        '\s+', ' ', 'g'  -- Replace multiple spaces with single space
    ),
    150
)
WHERE excerpt IS NULL 
   OR excerpt = '' 
   OR LENGTH(excerpt) > 200
   OR excerpt LIKE '%<%>%';  -- Contains HTML tags

-- Verify the changes
SELECT 
    id,
    title,
    excerpt,
    LENGTH(excerpt) as excerpt_length
FROM articles
ORDER BY updated_at DESC
LIMIT 10;
