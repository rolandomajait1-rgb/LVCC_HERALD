# Fix: Articles Not Showing in Categories

## Problem
May articles na pero walang lumalabas sa category pages (News, Literary, etc.)

## Possible Causes
1. Articles not assigned to categories
2. Articles status is "draft" instead of "published"
3. Category names don't match

## Quick Fix

### Check via Admin Dashboard
1. Go to Admin Dashboard
2. Click on each article
3. Make sure:
   - ✅ Status = "Published"
   - ✅ Category is selected (News, Literary, etc.)
   - ✅ Published date is set
4. Save

### Check via Database

```sql
-- Check if articles have categories
SELECT a.id, a.title, a.status, c.name as category
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'published';

-- If walang category, assign manually:
-- Get category IDs
SELECT id, name FROM categories;

-- Assign article to category
INSERT INTO article_category (article_id, category_id, created_at, updated_at)
VALUES (ARTICLE_ID, CATEGORY_ID, NOW(), NOW());
```

### Common Issues

**Issue 1: Status is "draft"**
```sql
UPDATE articles SET status = 'published', published_at = NOW() WHERE status = 'draft';
```

**Issue 2: No category assigned**
- Edit article in admin
- Select category
- Save

**Issue 3: Category name mismatch**
Categories should be exactly:
- News
- Literary
- Opinion
- Art
- Features
- Sports
- Specials

## Test
1. Go to `/category/news`
2. Should show articles with "News" category
3. Repeat for other categories

## If Still Not Working
Check browser console for errors and send screenshot.
