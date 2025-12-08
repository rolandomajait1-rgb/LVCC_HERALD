# Remaining Issues to Fix

## COMPLETED ✅
1. Wrong password error handling - Shows "Wrong password" in password field
2. Password paste prevention - Already implemented
3. Signup loading indicator - Shows "Signing Up..."
4. Article seeder - Already created and called
5. Notification positioning - Below header, not floating
6. Notification design - Green/red border, rounded corners
7. Delete modal design - Rounded buttons, proper sizing
8. Article detail padding - Reduced from p-12 to p-4
9. Token expiration - Extended to 7 days
10. Auto-logout on refresh - Fixed by removing strict expiration check

## CRITICAL ISSUES 🔴

### 1. Search Functionality Not Working
- Location: Search page
- Issue: Searching for articles returns no results
- Fix needed: Check SearchController and search query

### 2. Audit Trail Issues
- Timestamps not matching (showing wrong dates)
- Colors: Only "deleted" should be red, others blue
- Deleted article titles not showing (should get from old_values)
- Location: AuditTrail.jsx and LogController.php

### 3. Auto Logout Problem
- Users getting logged out randomly
- Possible causes: Token expiration, axios interceptor, session storage
- Fix needed: Review axiosConfig.js and token handling

### 4. Article Routing
- Copying article link redirects to landing page
- Should use slug-based routing
- Fix needed: Check route configuration

### 5. Like Functionality
- Like button not working
- Fix needed: Connect to backend API endpoint

### 6. Facebook Share Meta Tags
- Sharing shows site link, not article
- Fix needed: Add Open Graph meta tags

### 7. Contact Form
- Request coverage not working
- Fix needed: Check ContactController

### 8. Dashboard Auto-Redirect
- When logged in, should redirect to dashboard
- Fix needed: Add redirect logic in LandingPage

### 9. Change Password Indicator
- No loading state on button
- Fix needed: Add loading state

### 10. Edit Article Tags Format
- Tags not following create article format
- Fix needed: Update EditArticle.jsx to match CreateArticle

### 11. Delete Article Modal
- Not working for admin
- Fix needed: Check permissions and modal logic

### 12. Remove Moderator
- Cannot remove moderators
- Fix needed: Check ManageModerators functionality

### 13. Views Tracking
- Views not being tracked
- Fix needed: Add views column to articles table and tracking logic

### 14. Facebook Footer Link
- Links to wrong page
- Fix needed: Update Footer.jsx with correct link

## MEDIUM PRIORITY 🟡

### 15. Category Not Clickable
- Category badge on article page not redirecting
- Fix needed: Add onClick handler

### 16. Tags Vertical Stack
- Tags should be stacked vertically
- Fix needed: Update CSS to flex-col

### 17. Article Page Border
- Still has border
- Fix needed: Remove or reduce border

### 18. Flash Messages Position
- Messages overlap header
- Fix needed: Adjust positioning

### 19. Edit Success Message
- Shows on edit page then disappears
- Should show on article page after redirect
- Fix needed: Use sessionStorage for notification

## LOW PRIORITY 🟢

### 20. Article Border
- White background has too much border
- Already reduced but may need more adjustment

## NOTES
- Most UI issues have been fixed
- Focus on backend functionality (search, audit trail, views)
- Token/auth issues are critical for user experience
