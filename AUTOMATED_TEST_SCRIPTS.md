# Automated Test Scripts for La Verdad Herald

## API Test Scripts (Postman/Newman)

### Authentication Tests
```javascript
// Test: User Registration
pm.test("User registration successful", function () {
    pm.response.to.have.status(201);
    pm.expect(pm.response.json()).to.have.property('message');
});

// Test: User Login
pm.test("User login successful", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property('token');
    pm.globals.set("auth_token", pm.response.json().token);
});

// Test: Protected Route Access
pm.test("Protected route requires authentication", function () {
    pm.response.to.have.status(401);
});
```

### Article Management Tests
```javascript
// Test: Create Article
pm.test("Article creation successful", function () {
    pm.response.to.have.status(201);
    pm.expect(pm.response.json()).to.have.property('id');
    pm.globals.set("article_id", pm.response.json().id);
});

// Test: Get Article by Slug
pm.test("Article retrieval by slug", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json()).to.have.property('title');
    pm.expect(pm.response.json()).to.have.property('content');
});

// Test: Update Article
pm.test("Article update successful", function () {
    pm.response.to.have.status(200);
    pm.expect(pm.response.json().title).to.eql("Updated Title");
});
```

---

## Frontend Test Scripts (Cypress)

### Setup
```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-cy=email]').type(email);
  cy.get('[data-cy=password]').type(password);
  cy.get('[data-cy=login-btn]').click();
});

Cypress.Commands.add('createArticle', (title, content) => {
  cy.visit('/admin/create-article');
  cy.get('[data-cy=title]').type(title);
  cy.get('[data-cy=content]').type(content);
  cy.get('[data-cy=publish-btn]').click();
});
```

### Authentication Tests
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  it('should register new user', () => {
    cy.visit('/register');
    cy.get('[data-cy=name]').type('Test User');
    cy.get('[data-cy=email]').type('test@laverdad.edu.ph');
    cy.get('[data-cy=password]').type('Password123!');
    cy.get('[data-cy=password-confirm]').type('Password123!');
    cy.get('[data-cy=register-btn]').click();
    cy.contains('Registration successful').should('be.visible');
  });

  it('should login existing user', () => {
    cy.login('admin@laverdad.edu.ph', 'password');
    cy.url().should('include', '/admin');
  });

  it('should logout user', () => {
    cy.login('admin@laverdad.edu.ph', 'password');
    cy.get('[data-cy=logout-btn]').click();
    cy.url().should('include', '/');
  });
});
```

### Article Management Tests
```javascript
// cypress/e2e/articles.cy.js
describe('Article Management', () => {
  beforeEach(() => {
    cy.login('admin@laverdad.edu.ph', 'password');
  });

  it('should create new article', () => {
    cy.createArticle('Test Article', 'This is test content');
    cy.contains('Article created successfully').should('be.visible');
  });

  it('should edit existing article', () => {
    cy.visit('/admin/articles');
    cy.get('[data-cy=edit-btn]').first().click();
    cy.get('[data-cy=title]').clear().type('Updated Title');
    cy.get('[data-cy=save-btn]').click();
    cy.contains('Article updated successfully').should('be.visible');
  });

  it('should delete article', () => {
    cy.visit('/admin/articles');
    cy.get('[data-cy=delete-btn]').first().click();
    cy.get('[data-cy=confirm-delete]').click();
    cy.contains('Article deleted successfully').should('be.visible');
  });
});
```

---

## Performance Test Scripts (Artillery)

### Load Testing Configuration
```yaml
# artillery-config.yml
config:
  target: 'https://lvcc-herald.onrender.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "API Load Test"
    flow:
      - get:
          url: "/api/articles"
      - get:
          url: "/api/categories"
      - get:
          url: "/api/tags"
      - post:
          url: "/api/login"
          json:
            email: "test@laverdad.edu.ph"
            password: "password"
```

### Database Performance Tests
```sql
-- Query Performance Tests
EXPLAIN ANALYZE SELECT * FROM articles 
WHERE status = 'published' 
ORDER BY published_at DESC 
LIMIT 10;

EXPLAIN ANALYZE SELECT a.*, c.name as category_name 
FROM articles a 
JOIN article_category ac ON a.id = ac.article_id 
JOIN categories c ON ac.category_id = c.id 
WHERE c.name = 'News';

EXPLAIN ANALYZE SELECT COUNT(*) FROM article_interactions 
WHERE article_id = 1 AND type = 'like';
```

---

## Security Test Scripts

### SQL Injection Tests
```javascript
// Test malicious inputs
const maliciousInputs = [
  "'; DROP TABLE articles; --",
  "1' OR '1'='1",
  "admin'/*",
  "1; DELETE FROM users WHERE 1=1; --"
];

maliciousInputs.forEach(input => {
  pm.test(`SQL Injection protection for: ${input}`, function () {
    pm.sendRequest({
      url: pm.globals.get("base_url") + "/api/articles/search?q=" + input,
      method: 'GET'
    }, function (err, response) {
      pm.expect(response.code).to.not.equal(500);
    });
  });
});
```

### XSS Prevention Tests
```javascript
// Test XSS payloads
const xssPayloads = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert('XSS')>",
  "javascript:alert('XSS')",
  "<svg onload=alert('XSS')>"
];

xssPayloads.forEach(payload => {
  pm.test(`XSS protection for: ${payload}`, function () {
    // Test in article content
    pm.sendRequest({
      url: pm.globals.get("base_url") + "/api/articles",
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + pm.globals.get("auth_token"),
        'Content-Type': 'application/json'
      },
      body: {
        mode: 'raw',
        raw: JSON.stringify({
          title: "Test Article",
          content: payload,
          category_id: 1
        })
      }
    }, function (err, response) {
      pm.expect(response.json().content).to.not.include('<script>');
    });
  });
});
```

---

## Mobile Testing Scripts (Appium)

### Responsive Design Tests
```javascript
// Test different screen sizes
const screenSizes = [
  { width: 375, height: 667 }, // iPhone SE
  { width: 414, height: 896 }, // iPhone 11
  { width: 768, height: 1024 }, // iPad
  { width: 1920, height: 1080 } // Desktop
];

screenSizes.forEach(size => {
  it(`should display correctly on ${size.width}x${size.height}`, () => {
    cy.viewport(size.width, size.height);
    cy.visit('/');
    cy.get('[data-cy=header]').should('be.visible');
    cy.get('[data-cy=navigation]').should('be.visible');
    cy.get('[data-cy=content]').should('be.visible');
  });
});
```

---

## Continuous Integration Scripts

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: SQA Tests
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run API Tests
        run: |
          npm install -g newman
          newman run postman-collection.json

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Cypress Tests
        run: |
          npm install
          npm run cy:run

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Load Tests
        run: |
          npm install -g artillery
          artillery run artillery-config.yml
```

---

## Test Data Management

### Test Data Setup Script
```javascript
// setup-test-data.js
const testData = {
  users: [
    { email: 'admin@laverdad.edu.ph', role: 'admin' },
    { email: 'moderator@laverdad.edu.ph', role: 'moderator' },
    { email: 'user@laverdad.edu.ph', role: 'user' }
  ],
  articles: [
    { title: 'Test Article 1', category: 'News' },
    { title: 'Test Article 2', category: 'Sports' },
    { title: 'Test Article 3', category: 'Opinion' }
  ],
  categories: ['News', 'Sports', 'Opinion', 'Literary', 'Features']
};

// Function to create test data
async function setupTestData() {
  for (const user of testData.users) {
    await createUser(user);
  }
  
  for (const article of testData.articles) {
    await createArticle(article);
  }
}
```

---

## Execution Commands

### Run All Tests
```bash
# API Tests
newman run postman-collection.json --environment test-env.json

# Frontend Tests  
npm run cy:run

# Performance Tests
artillery run artillery-config.yml

# Security Tests
npm run security-tests

# Mobile Tests
npm run mobile-tests
```

### Generate Reports
```bash
# Test Reports
newman run collection.json --reporters cli,html --reporter-html-export report.html

# Coverage Reports
npm run test:coverage

# Performance Reports
artillery run config.yml --output performance-report.json
```