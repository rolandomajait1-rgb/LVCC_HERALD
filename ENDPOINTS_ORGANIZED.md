# 📋 API Endpoints - Organized List

## 🌐 PUBLIC ENDPOINTS (Walang Authentication)

### 🏠 System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ping` | Test if API is running |
| GET | `/api/health` | Health check |

---

### 📰 Articles (Public)
| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/articles/public` | Get published articles | `?category=news&limit=10` |
| GET | `/api/articles/by-slug/{slug}` | Get article by slug | - |
| GET | `/api/articles/id/{id}` | Get article by ID | - |
| GET | `/api/articles/search` | Search articles | `?q=keyword` |
| GET | `/api/latest-articles` | Get latest 6 articles | - |

**Example:**
```javascript
// Get news articles
GET /api/articles/public?category=news&limit=9

// Get specific article
GET /api/articles/by-slug/president-magsaysay-birth-anniversary

// Search
GET /api/articles/search?q=sports
```

---

### 📁 Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/{category}/articles` | Get articles by category |

**Example:**
```javascript
GET /api/categories
GET /api/categories/news/articles
```

---

### 🏷️ Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| GET | `/api/tags/{slug}/articles` | Get articles by tag |

**Example:**
```javascript
GET /api/tags
GET /api/tags/sports/articles
```

---

### ✍️ Authors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors/{authorName}` | Get author info |
| GET | `/api/articles/author-public/{authorId}` | Get author's articles |

**Example:**
```javascript
GET /api/authors/John-Doe
GET /api/articles/author-public/1
```

---

### 👥 Team
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team-members` | Get team members |

---

### 📧 Contact Forms
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/contact/feedback` | Send feedback | `{name, email, message}` |
| POST | `/api/contact/request-coverage` | Request coverage | `{name, email, event, details}` |
| POST | `/api/contact/join-herald` | Join herald | `{name, email, position}` |
| POST | `/api/contact/subscribe` | Subscribe newsletter | `{email}` |

**Example:**
```javascript
POST /api/contact/feedback
{
    "name": "Juan Dela Cruz",
    "email": "juan@example.com",
    "message": "Great website!"
}
```

---

### 🔐 Authentication
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/login` | Login | `{email, password, remember}` |
| POST | `/api/register` | Register | `{name, email, password, password_confirmation}` |
| POST | `/api/forgot-password` | Forgot password | `{email}` |
| POST | `/api/reset-password` | Reset password | `{email, password, token}` |
| GET | `/api/email/verify/{id}/{hash}` | Verify email | - |

**Example:**
```javascript
POST /api/login
{
    "email": "admin@example.com",
    "password": "password123",
    "remember": true
}

// Response:
{
    "token": "xxx",
    "user": {
        "id": 1,
        "name": "Admin",
        "email": "admin@example.com",
        "role": "admin"
    }
}
```

---

## 🔒 PROTECTED ENDPOINTS (Kailangan ng Token)

### 👤 User Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user` | Get current user | ✅ |
| POST | `/api/logout` | Logout | ✅ |
| POST | `/api/change-password` | Change password | ✅ |
| POST | `/api/delete-account` | Delete account | ✅ |
| GET | `/api/user/liked-articles` | Get liked articles | ✅ |
| GET | `/api/user/shared-articles` | Get shared articles | ✅ |

**Example:**
```javascript
// Headers: Authorization: Bearer {token}
GET /api/user

POST /api/change-password
{
    "current_password": "old123",
    "new_password": "new123",
    "new_password_confirmation": "new123"
}
```

---

### 📝 Articles (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/articles` | Create article | ✅ Admin/Mod |
| GET | `/api/articles/{id}` | Get article details | ✅ |
| PUT | `/api/articles/{id}` | Update article | ✅ Admin/Mod |
| DELETE | `/api/articles/{id}` | Delete article | ✅ Admin |
| POST | `/api/articles/{id}/like` | Like article | ✅ |
| GET | `/api/articles/author/{authorId}` | Get author articles | ✅ |

**Example:**
```javascript
POST /api/articles
{
    "title": "New Article",
    "content": "<p>Content here</p>",
    "category_id": 1,
    "tags": "news,sports",
    "status": "published",
    "featured_image": File
}

PUT /api/articles/1
{
    "title": "Updated Title",
    "content": "<p>Updated content</p>"
}

DELETE /api/articles/1
```

---

### 📁 Categories (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/categories` | Create category | ✅ Admin/Mod |
| GET | `/api/categories/{id}` | Get category | ✅ |
| PUT | `/api/categories/{id}` | Update category | ✅ Admin/Mod |
| DELETE | `/api/categories/{id}` | Delete category | ✅ Admin |

---

### 🏷️ Tags (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tags` | List tags | ✅ |
| POST | `/api/tags` | Create tag | ✅ Admin/Mod |
| GET | `/api/tags/{id}` | Get tag | ✅ |
| PUT | `/api/tags/{id}` | Update tag | ✅ Admin/Mod |
| DELETE | `/api/tags/{id}` | Delete tag | ✅ Admin |

---

### 📊 Admin Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard-stats` | Dashboard statistics | ✅ Admin/Mod |
| GET | `/api/admin/recent-activity` | Recent activity | ✅ Admin/Mod |
| GET | `/api/admin/audit-logs` | Audit logs | ✅ Admin/Mod |
| GET | `/api/admin/check-access` | Check admin access | ✅ Admin |

**Example:**
```javascript
GET /api/admin/dashboard-stats

// Response:
{
    "total_articles": 150,
    "total_users": 50,
    "total_views": 10000,
    "articles_this_month": 25
}
```

---

### 👥 User Management (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List users | ✅ Admin |
| GET | `/api/admin/users/{id}` | Get user | ✅ Admin |
| PUT | `/api/admin/users/{id}` | Update user | ✅ Admin |
| DELETE | `/api/admin/users/{id}` | Delete user | ✅ Admin |
| POST | `/api/admin/users/{id}/revoke` | Revoke access | ✅ Admin |

---

### 👮 Moderator Management (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/moderators` | List moderators | ✅ Admin |
| POST | `/api/admin/moderators` | Add moderator | ✅ Admin |
| DELETE | `/api/admin/moderators/{id}` | Remove moderator | ✅ Admin |

**Example:**
```javascript
POST /api/admin/moderators
{
    "user_id": 5
}

DELETE /api/admin/moderators/5
```

---

### 📄 Drafts (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/drafts` | List drafts | ✅ Admin/Mod |
| POST | `/api/drafts` | Create draft | ✅ Admin/Mod |
| GET | `/api/drafts/{id}` | Get draft | ✅ Admin/Mod |
| PUT | `/api/drafts/{id}` | Update draft | ✅ Admin/Mod |
| DELETE | `/api/drafts/{id}` | Delete draft | ✅ Admin/Mod |

---

### 📧 Subscribers (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/subscribers` | List subscribers | ✅ Admin/Mod |
| GET | `/api/subscribers/{id}` | Get subscriber | ✅ Admin/Mod |
| DELETE | `/api/subscribers/{id}` | Delete subscriber | ✅ Admin |

---

### 📝 Logs (Admin/Moderator)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/logs` | List logs | ✅ Admin/Mod |
| GET | `/api/logs/{id}` | Get log | ✅ Admin/Mod |

---

### 👥 Staff (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/staff` | List staff | ✅ Admin |
| POST | `/api/staff` | Create staff | ✅ Admin |
| GET | `/api/staff/{id}` | Get staff | ✅ Admin |
| PUT | `/api/staff/{id}` | Update staff | ✅ Admin |
| DELETE | `/api/staff/{id}` | Delete staff | ✅ Admin |

---

### ✍️ Authors (Admin Only)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/authors` | List authors | ✅ Admin |
| POST | `/api/authors` | Create author | ✅ Admin |
| GET | `/api/authors/{id}` | Get author | ✅ Admin |
| PUT | `/api/authors/{id}` | Update author | ✅ Admin |
| DELETE | `/api/authors/{id}` | Delete author | ✅ Admin |

---

### 👥 Team Members (Admin)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/team-members/update` | Update team member | ✅ Admin |

---

## 🔑 Authentication Levels

| Role | Access Level |
|------|--------------|
| **Guest** | Public endpoints only |
| **User** | Public + User profile endpoints |
| **Moderator** | User + Create/Edit articles, View dashboard |
| **Admin** | Full access to all endpoints |

---

## 📊 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/login` | 5 requests per minute |
| `/api/register` | 3 requests per minute |
| `/api/forgot-password` | 3 requests per minute |
| `/api/reset-password` | 3 requests per minute |
| `/api/articles/search` | 30 requests per minute |
| `/api/contact/*` | 5 requests per minute |

---

## 🎯 Quick Reference

### Get Homepage Articles
```javascript
GET /api/articles/public?category=news&limit=9
GET /api/articles/public?category=literary&limit=9
GET /api/articles/public?category=sports&limit=9
```

### Create Article (Admin)
```javascript
POST /api/articles
Headers: Authorization: Bearer {token}
Body: FormData with title, content, category_id, featured_image
```

### Search Articles
```javascript
GET /api/articles/search?q=basketball
```

### Like Article
```javascript
POST /api/articles/1/like
Headers: Authorization: Bearer {token}
```

### Get User Info
```javascript
GET /api/user
Headers: Authorization: Bearer {token}
```
