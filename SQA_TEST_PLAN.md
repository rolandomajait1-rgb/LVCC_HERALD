# La Verdad Herald - SQA Test Plan (3 Cycles)

## Test Environment
- **Frontend**: https://lvcc-herald.vercel.app
- **Backend**: https://lvcc-herald.onrender.com
- **Database**: PostgreSQL (Production)
- **Test Accounts**: admin@laverdad.edu.ph, moderator@laverdad.edu.ph, user@laverdad.edu.ph

---

## CYCLE 1: CORE FUNCTIONALITY TESTING

### 1.1 Authentication & Authorization
**Priority: Critical**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC001 | Register with valid La Verdad email | Account created, verification email sent | ⏳ |
| TC002 | Login with verified account | Successful login, redirect to dashboard | ⏳ |
| TC003 | Login with invalid credentials | Error message displayed | ⏳ |
| TC004 | Access admin routes as user | 403 Forbidden error | ⏳ |
| TC005 | Password reset functionality | Reset email sent, password updated | ⏳ |

### 1.2 Article Management
**Priority: Critical**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC006 | Create article as admin | Article created successfully | ⏳ |
| TC007 | Edit existing article | Changes saved correctly | ⏳ |
| TC008 | Delete article as admin | Article removed from system | ⏳ |
| TC009 | Publish draft article | Article visible on public site | ⏳ |
| TC010 | Upload article image | Image uploaded to Cloudinary | ⏳ |

### 1.3 Public Article Access
**Priority: High**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC011 | View article by slug | Article content displayed | ⏳ |
| TC012 | Browse articles by category | Filtered articles shown | ⏳ |
| TC013 | Search articles | Relevant results returned | ⏳ |
| TC014 | Like article (authenticated) | Like count incremented | ⏳ |
| TC015 | Share article | Share functionality works | ⏳ |

---

## CYCLE 2: INTEGRATION & WORKFLOW TESTING

### 2.1 User Workflows
**Priority: High**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC016 | Complete registration flow | User can access system end-to-end | ⏳ |
| TC017 | Admin article creation workflow | From creation to publication | ⏳ |
| TC018 | Moderator article editing workflow | Edit permissions work correctly | ⏳ |
| TC019 | User interaction workflow | Like, share, browse articles | ⏳ |
| TC020 | Contact form submission | Email sent to admin | ⏳ |

### 2.2 Data Integrity
**Priority: High**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC021 | Article with categories/tags | Relationships maintained | ⏳ |
| TC022 | Author attribution | Correct author displayed | ⏳ |
| TC023 | Image URL consistency | Images load correctly | ⏳ |
| TC024 | Database transactions | No data corruption | ⏳ |
| TC025 | Audit trail logging | All actions logged | ⏳ |

### 2.3 API Integration
**Priority: Medium**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC026 | Frontend-Backend communication | All API calls successful | ⏳ |
| TC027 | Error handling | Proper error responses | ⏳ |
| TC028 | Rate limiting | Limits enforced correctly | ⏳ |
| TC029 | CORS configuration | Cross-origin requests work | ⏳ |
| TC030 | Authentication tokens | Token validation works | ⏳ |

---

## CYCLE 3: PERFORMANCE & SECURITY TESTING

### 3.1 Performance Testing
**Priority: Medium**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC031 | Page load times | < 3 seconds on 3G | ⏳ |
| TC032 | Image optimization | Images load efficiently | ⏳ |
| TC033 | Database query performance | Queries execute < 500ms | ⏳ |
| TC034 | Concurrent user handling | System stable under load | ⏳ |
| TC035 | Mobile responsiveness | UI works on all devices | ⏳ |

### 3.2 Security Testing
**Priority: Critical**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC036 | SQL injection attempts | Queries properly sanitized | ⏳ |
| TC037 | XSS attack prevention | Content properly escaped | ⏳ |
| TC038 | File upload security | Only valid images accepted | ⏳ |
| TC039 | Session management | Secure token handling | ⏳ |
| TC040 | Input validation | All inputs validated | ⏳ |

### 3.3 Edge Cases & Error Handling
**Priority: Medium**

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| TC041 | Network connectivity loss | Graceful error handling | ⏳ |
| TC042 | Large file uploads | Proper size limits enforced | ⏳ |
| TC043 | Invalid URL access | 404 pages displayed | ⏳ |
| TC044 | Browser compatibility | Works on major browsers | ⏳ |
| TC045 | Accessibility compliance | WCAG guidelines followed | ⏳ |

---

## TEST EXECUTION SCHEDULE

### Week 1: Cycle 1 (Core Functionality)
- **Day 1-2**: Authentication & Authorization (TC001-TC005)
- **Day 3-4**: Article Management (TC006-TC010)
- **Day 5**: Public Article Access (TC011-TC015)

### Week 2: Cycle 2 (Integration & Workflow)
- **Day 1-2**: User Workflows (TC016-TC020)
- **Day 3**: Data Integrity (TC021-TC025)
- **Day 4-5**: API Integration (TC026-TC030)

### Week 3: Cycle 3 (Performance & Security)
- **Day 1-2**: Performance Testing (TC031-TC035)
- **Day 3**: Security Testing (TC036-TC040)
- **Day 4-5**: Edge Cases & Error Handling (TC041-TC045)

---

## DEFECT TRACKING

### Severity Levels
- **Critical**: System unusable, data loss
- **High**: Major functionality broken
- **Medium**: Minor functionality issues
- **Low**: Cosmetic issues

### Bug Report Template
```
Bug ID: BUG-XXX
Title: [Brief description]
Severity: [Critical/High/Medium/Low]
Steps to Reproduce:
1. 
2. 
3. 
Expected Result:
Actual Result:
Environment: [Browser, OS, Device]
Screenshots: [If applicable]
```

---

## ACCEPTANCE CRITERIA

### Cycle 1 Completion
- ✅ All authentication flows working
- ✅ Article CRUD operations functional
- ✅ Public article access working
- ✅ No critical bugs remaining

### Cycle 2 Completion
- ✅ End-to-end workflows tested
- ✅ Data integrity verified
- ✅ API integration stable
- ✅ No high-severity bugs

### Cycle 3 Completion
- ✅ Performance benchmarks met
- ✅ Security vulnerabilities addressed
- ✅ Edge cases handled gracefully
- ✅ System ready for production

---

## TOOLS & RESOURCES

### Testing Tools
- **Manual Testing**: Browser DevTools
- **API Testing**: Postman/Insomnia
- **Performance**: Lighthouse, GTmetrix
- **Security**: OWASP ZAP
- **Mobile**: BrowserStack

### Test Data
- **Articles**: 50+ sample articles
- **Users**: Admin, Moderator, Regular users
- **Categories**: News, Sports, Opinion, etc.
- **Images**: Various sizes and formats

---

## RISK ASSESSMENT

### High Risk Areas
1. **Authentication System** - Critical for security
2. **File Upload** - Potential security vulnerability
3. **Database Operations** - Data integrity concerns
4. **API Endpoints** - Integration points

### Mitigation Strategies
- Thorough testing of high-risk areas
- Security-focused test cases
- Performance monitoring
- Regular backup verification

---

## SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |
| Stakeholder | | | |

**Test Plan Version**: 1.0  
**Created**: December 2024  
**Last Updated**: December 2024