# Fix: Add is_active Column to Database

## The Problem
The `is_active` column doesn't exist in your database yet, so you can't login.

## Solution: Run the Migration

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Run the migration
```bash
php artisan migrate
```

This will add the `is_active` column to the users table with default value `true`.

### Step 3: Try logging in again
After running the migration, all users will have `is_active = true` by default, and you'll be able to login.

## Alternative: Add the column manually in PostgreSQL

If you can't run migrations, execute this SQL:

```sql
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;
```

Then try logging in again!
