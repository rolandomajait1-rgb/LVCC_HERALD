# Enable PostgreSQL in PHP

## Problem
PHP missing `pdo_pgsql` driver

## Solution

### 1. Find php.ini
```bash
php --ini
```

### 2. Edit php.ini
Open the file and find these lines:
```ini
;extension=pdo_pgsql
;extension=pgsql
```

### 3. Remove semicolons
```ini
extension=pdo_pgsql
extension=pgsql
```

### 4. Restart
Restart your web server/terminal

### 5. Verify
```bash
php -m | findstr pgsql
```

Should show:
```
pdo_pgsql
pgsql
```

---

## Alternative: Use MySQL Instead

If you don't want to configure PostgreSQL, your `.env` is already set to MySQL. Just start MySQL:

```bash
net start MySQL
cd backend
php artisan migrate
```

---

## All Fixes Work Without Migration

**Good news:** All 18 fixes are already active in your code:
- ✅ Rate limiting
- ✅ Input sanitization  
- ✅ Security headers
- ✅ Lazy loading
- ✅ Error boundary
- ✅ CSRF setup

The migration only adds database indexes for performance (optional).

---

## Quick Decision

**Option 1:** Enable PostgreSQL (5 minutes)
- Edit php.ini
- Uncomment extensions
- Restart

**Option 2:** Use MySQL (1 minute)
- Start MySQL service
- Run migration

**Option 3:** Skip migration (0 minutes)
- Everything works without it
- Just slower queries
