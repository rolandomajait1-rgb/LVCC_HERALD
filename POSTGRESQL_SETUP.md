# PostgreSQL Setup Guide

## Issue
Your PHP installation doesn't have the PostgreSQL PDO driver (`pdo_pgsql`).

## Solution Options

### Option 1: Install PostgreSQL PDO Driver (Recommended if using PostgreSQL)

1. **Check your PHP version:**
```bash
php -v
```

2. **Edit `php.ini`:**
Find your `php.ini` file (usually in `C:\xampp\php\php.ini` or similar)

3. **Enable PostgreSQL extensions:**
Uncomment these lines (remove the `;`):
```ini
extension=pdo_pgsql
extension=pgsql
```

4. **Restart your web server**

5. **Update `.env` for PostgreSQL:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=laverdad_herald
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

6. **Run migration:**
```bash
cd backend
php artisan migrate
```

---

### Option 2: Continue Using MySQL (Current Setup)

Your `.env` is already configured for MySQL. Just run:

```bash
cd backend
php artisan migrate
```

Make sure MySQL is running first.

---

## Current Status

✅ All frontend fixes are **already active** (no database needed):
- Rate limiting
- Input sanitization
- Security headers
- HTTPS enforcement

⏳ Database indexes require migration:
```bash
cd backend
php artisan migrate
```

---

## Quick Test (No Database Required)

The security fixes work immediately:
1. Open your app
2. Try wrong password 3 times
3. See rate limiting message ✅
4. Input sanitization is active ✅

Database indexes only improve performance, not functionality.
