# Issues to Fix - La Verdad Herald

## Priority Issues

### 1. Login - Remember Me Not Working
- **Issue**: Remember me checkbox not saving login state
- **Fix Needed**: Check localStorage persistence in login component

### 2. Registration - Password Validation
- **Issue**: Accepts mismatched passwords, shows generic "registration failed"
- **Fix Needed**: Add frontend validation to show "Passwords don't match" before submitting
- **Fix Needed**: Validate @laverdad.edu email format before submitting

### 3. Forgot Password Not Working
- **Issue**: Forgot password feature not functioning
- **Fix Needed**: Check backend email sending and frontend flow

### 4. Drafts Not Saving
- **Issue**: Draft articles not appearing in Draft Articles page
- **Status**: Backend returns published articles instead of drafts
- **Fix Needed**: Backend filtering by status=draft not working correctly

### 5. Statistics - Views Not Counted
- **Issue**: Article views not being tracked/counted
- **Fix Needed**: Implement view tracking in backend

### 6. Tags Not Saving Articles
- **Issue**: Articles not associated with tags properly
- **Fix Needed**: Check tag sync in ArticleController

### 7. Sports Tag Navigation
- **Issue**: Clicking Sports tag doesn't navigate to Sports category page
- **Fix Needed**: Check tag click handler and routing

## Cloudflare Issue
- **Status**: Under maintenance 4 mins ago
- **Impact**: May be causing some errors temporarily
- **Action**: Wait for Cloudflare to resolve, then retest

## Next Steps
1. Wait for Cloudflare maintenance to complete
2. Fix registration validation (highest priority)
3. Fix remember me functionality
4. Fix draft articles backend filtering
5. Implement view tracking
6. Fix tag associations
7. Fix forgot password flow
