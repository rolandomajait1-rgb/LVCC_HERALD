# 🔍 DEBUG: Draft Articles Not Showing

## IMMEDIATE CHECKS

### 1. Check Browser Console (F12)
Open browser console and look for these logs:
```
🔍 Fetching drafts from API...
📦 API Response: {...}
📄 Articles array length: X
✅ Found X draft(s)
```

**If you see errors**, copy them here.

### 2. Check Database Directly
```sql
-- Run this in your database
SELECT id, title, status, created_at, author_id 
FROM articles 
WHERE status = 'draft' 
ORDER BY created_at DESC;
```

**How many rows?** _______

### 3. Test API Directly

**Option A: Browser**
1. Open: `http://localhost:8000/api/articles?status=draft`
2. What do you see?

**Option B: Check Network Tab**
1. Open DevTools → Network tab
2. Go to draft articles page
3. Look for request to `/api/articles?status=draft`
4. Click on it
5. Check Response tab
6. What does it show?

---

## POSSIBLE CAUSES

### Cause 1: No Drafts in Database
**Symptom**: Database query returns 0 rows
**Solution**: Create a draft first
1. Go to Create Article
2. Fill required fields (title, author, category)
3. Click "Save Draft"
4. Check database again

### Cause 2: Authentication Issue
**Symptom**: API returns 401 Unauthorized
**Check**:
```javascript
// In browser console
console.log('Token:', localStorage.getItem('auth_token'));
console.log('Role:', localStorage.getItem('user_role'));
```

**If null**: Login again

### Cause 3: Backend Not Filtering
**Symptom**: API returns published articles instead of drafts
**Check Response**: Look at `status` field in each article

### Cause 4: Frontend Not Parsing
**Symptom**: Console shows articles but UI shows "No drafts"
**Check**: Look for JavaScript errors in console

---

## QUICK FIX STEPS

### Step 1: Clear Everything
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Step 2: Login Fresh
1. Login as admin/moderator
2. Go to create article
3. Fill form
4. Save as draft

### Step 3: Check Draft Page
1. Go to draft articles
2. Open console (F12)
3. Look for logs
4. Take screenshot if error

---

## SEND ME THIS INFO

Please provide:

1. **Browser Console Output**:
```
[Paste console logs here]
```

2. **Database Count**:
```sql
SELECT COUNT(*) FROM articles WHERE status = 'draft';
-- Result: ___
```

3. **API Response** (from Network tab):
```json
{
  "paste": "response here"
}
```

4. **Screenshots**:
- Console errors (if any)
- Network tab showing API request
- Database query result

---

## EMERGENCY BACKEND CHECK

Run this in your Laravel project:

```bash
# Check if articles exist
php artisan tinker

# Then run:
\App\Models\Article::where('status', 'draft')->count();
\App\Models\Article::where('status', 'draft')->get(['id', 'title', 'status']);
```

What's the output?

---

## IF STILL NOT WORKING

I need to see:
1. Exact error message from console
2. API response from Network tab
3. Database query result
4. Your user role (admin or moderator)

Then I can give you the exact fix!
