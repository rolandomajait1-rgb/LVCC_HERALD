# Tags Not Showing - Debug

## Problem
Walang tags sa "Explore" section ng TagSearchResults page

## Root Cause
1. `/api/tags` returns empty array
2. Walang tags sa database OR
3. Frontend not handling response correctly

## Solution

### Check Database:
```sql
SELECT * FROM tags;
```

### If empty, create sample tags:
```sql
INSERT INTO tags (name, slug, created_at, updated_at) VALUES
('Breaking News', 'breaking-news', NOW(), NOW()),
('Campus Life', 'campus-life', NOW(), NOW()),
('Sports Update', 'sports-update', NOW(), NOW()),
('Editorial', 'editorial', NOW(), NOW()),
('Student Voice', 'student-voice', NOW(), NOW());
```

### OR via Laravel Tinker:
```bash
php artisan tinker
```
```php
Tag::create(['name' => 'Breaking News', 'slug' => 'breaking-news']);
Tag::create(['name' => 'Campus Life', 'slug' => 'campus-life']);
Tag::create(['name' => 'Sports Update', 'slug' => 'sports-update']);
```

### Test API:
```bash
curl http://localhost:8000/api/tags
```

Should return:
```json
[
  {"id": 1, "name": "Breaking News"},
  {"id": 2, "name": "Campus Life"}
]
```

## Quick Fix
Tags are created automatically when articles are created with tags. 
**Create an article with tags** and they will appear in Explore section.
