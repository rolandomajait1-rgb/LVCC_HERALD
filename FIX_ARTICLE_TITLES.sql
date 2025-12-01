-- Fix article titles that contain "(edited by moderator)"
UPDATE articles 
SET title = REPLACE(title, ' (edited by moderator)', '')
WHERE title LIKE '%(edited by moderator)%';

-- Fix articles with "Uncategorized" category
-- First, get the Literary category ID
DO $$
DECLARE
    literary_id INTEGER;
BEGIN
    SELECT id INTO literary_id FROM categories WHERE name = 'Literary' LIMIT 1;
    
    -- Update articles that have no category or wrong category
    -- Remove existing category associations for articles without proper categories
    DELETE FROM article_category 
    WHERE article_id IN (
        SELECT a.id FROM articles a
        LEFT JOIN article_category ac ON a.id = ac.article_id
        LEFT JOIN categories c ON ac.category_id = c.id
        WHERE c.name IS NULL OR c.name NOT IN ('News', 'Opinion', 'Sports', 'Literary', 'Specials', 'Features', 'Art')
    );
    
    -- Add Literary category to articles without categories
    INSERT INTO article_category (article_id, category_id)
    SELECT a.id, literary_id
    FROM articles a
    LEFT JOIN article_category ac ON a.id = ac.article_id
    WHERE ac.article_id IS NULL;
END $$;

-- Verify the fixes
SELECT 
    a.id,
    a.title,
    c.name as category
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
ORDER BY a.created_at DESC
LIMIT 10;
