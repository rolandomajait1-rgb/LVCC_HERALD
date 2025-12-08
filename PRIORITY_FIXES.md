# 🔧 Priority Fixes - Action Plan

## Phase 1: Critical Fixes (Do Immediately) ⚠️

### Fix 1: Remove Duplicate Draft Routes
**File:** `backend/routes/api.php`
**Lines:** 127-133
**Action:** Remove the duplicate draft route definition

### Fix 2: Standardize Author Name Access  
**Files:** 
- `backend/app/Http/Controllers/CategoryController.php` (Line 158)
- `backend/app/Http/Controllers/ArticleController.php` (Already fixed)
- `backend/app/Http/Controllers/TagController.php` (Already fixed)

**Action:** Ensure all controllers use `->with(['author', 'author.user', ...])`

### Fix 3: XSS Protection
**File:** `frontend/src/pages/ArticleDetail.jsx`
**Action:** Install and use DOMPurify for HTML sanitization

### Fix 4: Search for Hardcoded URLs
**Action:** Search entire codebase for `localhost:8000` and replace with axios

---

## Phase 2: High Priority (This Week) 🔥

### Fix 5: Improve Error Handling
**Files:** All API call locations
**Action:** 
- Standardize error response format in backend
- Add proper error handling in frontend
- Show user-friendly error messages

### Fix 6: Add Pagination
**Files:**
- `backend/app/Http/Controllers/CategoryController.php` (articles method)
- `backend/app/Http/Controllers/TagController.php` (getArticlesByTag method)

**Action:** Replace `->take(X)->get()` with `->paginate(X)`

### Fix 7: Fix Like Count Sync
**File:** `frontend/src/pages/ArticleDetail.jsx`
**Action:** Either disable guest likes or sync on login

### Fix 8: Add Loading States
**Files:** All components with data fetching
**Action:** Add skeleton loaders or proper loading indicators

---

## Phase 3: Medium Priority (This Month) 📅

### Fix 9: Remove Unused Code
**Action:**
- Remove `frontend/src/utils/api.js` if not used
- Remove unused imports across all files
- Remove console.logs

### Fix 10: Standardize Date Formatting
**Action:** Create `utils/dateFormatter.js` and use everywhere

### Fix 11: Fix Image URL Handling
**Action:** Backend should always return full URLs for images

### Fix 12: Add CSRF Protection or Remove Check
**Action:** Either implement CSRF properly or remove the check from axios config

---

## Phase 4: Code Quality (Ongoing) 🧹

### Fix 13: Add PropTypes or TypeScript
**Action:** Start with PropTypes for critical components

### Fix 14: Implement Error Boundaries
**Action:** Wrap major sections with ErrorBoundary

### Fix 15: Extract Magic Numbers
**Action:** Create constants file for pagination limits, etc.

### Fix 16: Improve Accessibility
**Action:** Add proper alt text, ARIA labels

---

## Phase 5: Performance (Next Sprint) ⚡

### Fix 17: Implement Caching
**Action:** Add Redis caching for public endpoints

### Fix 18: Image Optimization
**Action:** Resize/compress images on upload

### Fix 19: Code Splitting
**Action:** Implement React.lazy() for routes

### Fix 20: Database Optimization
**Action:** Review and optimize queries, add indexes

---

## Quick Wins (Can Do Anytime) ✅

1. Remove console.logs
2. Fix unused imports
3. Standardize component exports
4. Add missing alt text
5. Fix inline styles
6. Update error messages to be user-friendly

---

## Testing Checklist After Fixes

- [ ] All articles display with correct author names
- [ ] Search works for articles, authors, tags, categories
- [ ] Tag search displays all articles
- [ ] Category pages show all articles (with pagination)
- [ ] Like functionality works for authenticated users
- [ ] Guest users see appropriate messages
- [ ] Error messages are user-friendly
- [ ] No console errors in production
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Accessibility audit passes
- [ ] Performance metrics acceptable

---

## Monitoring After Deployment

1. Check error logs for new issues
2. Monitor API response times
3. Track user feedback
4. Review analytics for drop-off points
5. Test on different browsers/devices
