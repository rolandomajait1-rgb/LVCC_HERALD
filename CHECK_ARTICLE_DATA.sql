-- Check the specific article data
SELECT 
    id,
    title,
    excerpt,
    LEFT(content, 200) as content_preview,
    author_id,
    status,
    published_at
FROM articles 
WHERE title LIKE '%lvcc laverdad herald%'
OR title LIKE '%the lvcc%';

-- Check author info
SELECT 
    a.id as article_id,
    a.title,
    au.id as author_id,
    au.name as author_name,
    u.name as user_name
FROM articles a
JOIN authors au ON a.author_id = au.id
LEFT JOIN users u ON au.user_id = u.id
WHERE a.title LIKE '%lvcc%';
