-- FIRST: Add the is_active column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- THEN: Set all existing users to active
UPDATE users SET is_active = true WHERE is_active IS NULL OR is_active = false;

-- Verify all users are now active
SELECT email, is_active FROM users;
