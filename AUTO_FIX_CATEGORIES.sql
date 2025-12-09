-- AUTO-FIX: Assign categories to ALL published articles based on their existing category in admin dashboard

-- First, check what we have
SELECT a.id, a.title, a.status, c.name as current_category
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'published';

-- Get category IDs
SELECT id, name FROM categories;

-- AUTO-ASSIGN: This will assign Literary category (id=4) to articles that have no category
-- Change the category_id based on your needs
INSERT INTO article_category (article_id, category_id)
SELECT a.id, 4  -- 4 = Literary (change this!)
FROM articles a
WHERE a.status = 'published'
AND NOT EXISTS (
    SELECT 1 FROM article_category ac WHERE ac.article_id = a.id
);

-- Verify the fix
SELECT a.id, a.title, c.name as category
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'published';
