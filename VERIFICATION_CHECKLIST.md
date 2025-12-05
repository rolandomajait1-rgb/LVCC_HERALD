# ✅ VERIFICATION CHECKLIST - COMPLETE SYSTEM TEST

## 🎯 DRAFT ARTICLES FUNCTIONALITY

### Test 1: Create Draft
**Steps**:
1. Go to `/admin/create-article` or `/moderator/create-article`
2. Fill in:
   - Title: "Test Draft Article"
   - Author: Your name
   - Category: Select any
   - Tags: Add at least one tag
   - Content: Type some content
3. Click "Save Draft" button

**Expected Result**:
- ✅ Alert: "Draft saved successfully!"
- ✅ Redirects to draft articles page
- ✅ Draft appears in the list

**Backend Check**:
```sql
SELECT id, title, status, created_at FROM articles WHERE status = 'draft' ORDER BY created_at DESC;
```

---

### Test 2: View Drafts
**Steps**:
1. Go to `/admin/draft-articles` or `/moderator/draft-articles`
2. Check the page

**Expected Result**:
- ✅ Shows list of draft articles
- ✅ Each draft shows: title, category, date, author, image
- ✅ Three buttons: Edit, Delete, Publish

**If Empty**:
- Shows: "No drafts found"
- Message: "Create a new article and save it as draft to see it here."

---

### Test 3: Auto-Save Draft
**Steps**:
1. Go to `/admin/create-article`
2. Fill in required fields (title, author, category)
3. Wait 30 seconds without clicking anything
4. Check top-right corner

**Expected Result**:
- ✅ Shows "Auto-saving..." during save
- ✅ Shows "Last saved: [time]" after save
- ✅ Draft created/updated in database

---

### Test 4: Edit Draft
**Steps**:
1. Go to draft articles page
2. Click "Edit" button on any draft
3. Modify the content
4. Click "Save" button

**Expected Result**:
- ✅ Redirects to correct edit page based on role
- ✅ Admin → `/admin/edit-article/{id}`
- ✅ Moderator → `/moderator/edit-article/{id}`
- ✅ Changes saved successfully
- ✅ Returns to previous page

---

### Test 5: Delete Draft
**Steps**:
1. Go to draft articles page
2. Click "Delete" button on any draft
3. Confirm deletion

**Expected Result**:
- ✅ Confirmation dialog appears
- ✅ Alert: "Draft deleted successfully!"
- ✅ Draft removed from list
- ✅ Page refreshes automatically

---

### Test 6: Publish Draft
**Steps**:
1. Go to draft articles page
2. Click "Publish" button on any draft
3. Confirm publication

**Expected Result**:
- ✅ Confirmation dialog appears
- ✅ Alert: "Article published successfully!"
- ✅ Draft removed from draft list
- ✅ Article appears in published articles
- ✅ Article visible on homepage

---

## 🔍 BACKEND API VERIFICATION

### API Endpoint: GET /api/articles?status=draft

**Test with cURL**:
```bash
curl -X GET "http://localhost:8000/api/articles?status=draft" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Expected Response**:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "title": "Test Draft",
      "status": "draft",
      "author_name": "Author Name",
      "categories": [...],
      "tags": [...],
      "created_at": "2024-12-XX...",
      "featured_image": "..."
    }
  ],
  "last_page": 1,
  "per_page": 10,
  "total": 1
}
```

**Check**:
- ✅ `data` is an array
- ✅ Each item has `status: "draft"`
- ✅ Includes author, categories, tags
- ✅ Paginated response structure

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "No drafts found" pero may draft sa database
**Cause**: Frontend not parsing paginated response correctly
**Solution**: ✅ FIXED - Now uses `response.data.data`

**Verify**:
```javascript
// In browser console
const response = await axios.get('/api/articles?status=draft');
console.log('Response:', response.data);
console.log('Articles:', response.data.data);
```

---

### Issue 2: Draft saves pero duplicate entries
**Cause**: Auto-save creating new draft instead of updating
**Solution**: ✅ FIXED - Now tracks `draftId` and updates existing

**Verify**:
```javascript
// Check localStorage
console.log('Draft ID:', localStorage.getItem('create-article-draftId'));
```

---

### Issue 3: Auto-save not working
**Cause**: Missing required fields (title, category, author)
**Solution**: Fill all required fields before auto-save triggers

**Verify**:
- Fill title, category, author
- Wait 30 seconds
- Check "Last saved" timestamp

---

### Issue 4: Role-based routing not working
**Cause**: Hardcoded `/admin/` paths
**Solution**: ✅ FIXED - Now uses `getUserRole()` for dynamic routing

**Verify**:
```javascript
// In browser console
import { getUserRole } from './utils/auth';
console.log('User role:', getUserRole());
```

---

## 📊 DATABASE VERIFICATION

### Check Draft Articles
```sql
-- Count drafts
SELECT COUNT(*) as draft_count FROM articles WHERE status = 'draft';

-- List all drafts
SELECT 
  id, 
  title, 
  status, 
  author_id,
  created_at,
  updated_at
FROM articles 
WHERE status = 'draft' 
ORDER BY created_at DESC;

-- Check with author info
SELECT 
  a.id,
  a.title,
  a.status,
  au.name as author_name,
  a.created_at
FROM articles a
LEFT JOIN authors au ON a.author_id = au.id
WHERE a.status = 'draft'
ORDER BY a.created_at DESC;
```

### Check Categories Relationship
```sql
SELECT 
  a.id,
  a.title,
  c.name as category_name
FROM articles a
LEFT JOIN article_category ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
WHERE a.status = 'draft';
```

---

## ✅ FINAL VERIFICATION STEPS

### Step 1: Clean Test
1. Delete all existing drafts from database
2. Create new draft via UI
3. Check if it appears in draft list
4. Verify in database

### Step 2: Auto-Save Test
1. Start creating new article
2. Fill required fields
3. Wait 30 seconds
4. Check database for new draft
5. Modify content
6. Wait 30 seconds
7. Check database - should UPDATE not INSERT

### Step 3: Full Workflow Test
1. Create draft → Save
2. View in draft list → Verify
3. Edit draft → Save changes
4. Publish draft → Verify published
5. Check homepage → Article visible

---

## 🎯 SUCCESS CRITERIA

All these must be TRUE:
- ✅ Can create draft
- ✅ Draft appears in list
- ✅ Auto-save works (updates existing)
- ✅ Can edit draft
- ✅ Can delete draft
- ✅ Can publish draft
- ✅ Role-based routing works
- ✅ No duplicate drafts created
- ✅ Backend returns correct data
- ✅ Frontend parses correctly

---

## 🚨 IF STILL NOT WORKING

### Debug Steps:

1. **Check Browser Console**:
```javascript
// Open DevTools → Console
// Look for errors or warnings
```

2. **Check Network Tab**:
- Open DevTools → Network
- Filter: XHR
- Look for `/api/articles?status=draft`
- Check Response

3. **Check Backend Logs**:
```bash
# Laravel logs
tail -f storage/logs/laravel.log
```

4. **Test API Directly**:
```bash
# Using curl or Postman
GET http://localhost:8000/api/articles?status=draft
```

5. **Check Authentication**:
```javascript
// In browser console
console.log('Token:', localStorage.getItem('auth_token'));
console.log('Role:', localStorage.getItem('user_role'));
```

---

## 📝 NOTES

- Backend returns **paginated** response: `{ data: [...], current_page, last_page }`
- Frontend must access: `response.data.data` (not just `response.data`)
- Auto-save only works when title, category, and author are filled
- Draft ID is tracked to prevent duplicates
- Role-based routing uses `getUserRole()` helper

---

**Last Updated**: December 2024  
**Status**: ✅ ALL FIXES APPLIED  
**Confidence**: 99% - Should work correctly now
