-- Check all categories in database
SELECT id, name, slug FROM categories ORDER BY name;

-- Check articles and their categories
SELECT 
    a.id,
    a.title,
    c.name as category_name,
    c.id as category_id
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
ORDER BY a.created_at DESC
LIMIT 20;

-- Find articles with wrong categories
SELECT 
    a.id,
    a.title,
    GROUP_CONCAT(c.name) as categories
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
GROUP BY a.id, a.title
ORDER BY a.created_at DESC;
