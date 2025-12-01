-- Reactivate account for rolandommajait.majait@student.laverdad.edu.ph
-- For PostgreSQL
UPDATE users 
SET is_active = true 
WHERE email = 'rolandommajait.majait@student.laverdad.edu.ph';

-- Verify the update
SELECT id, name, email, role, is_active, email_verified_at 
FROM users 
WHERE email = 'rolandommajait.majait@student.laverdad.edu.ph';
