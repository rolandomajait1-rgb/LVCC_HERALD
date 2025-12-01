-- Fix is_active column for all users
-- This sets all existing users to active by default

-- For PostgreSQL
UPDATE users SET is_active = true WHERE is_active IS NULL OR is_active = false;

-- Verify all users are now active
SELECT email, is_active FROM users;
