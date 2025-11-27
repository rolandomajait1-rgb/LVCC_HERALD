# Laravel Deployment Fix Guide

## Issues Fixed

### 1. Forgot Password Functionality
- Added `forgotPassword()` and `resetPassword()` methods to AuthController
- Added routes `/api/forgot-password` and `/api/reset-password`
- Added proper password reset imports

### 2. CORS Configuration
- Created HandleCors middleware
- Removed hardcoded CORS headers from AuthController
- CORS now handled centrally via config/cors.php

### 3. Deployment Configuration
- Fixed nixpacks.toml build process
- Updated Procfile with proper startup commands
- Fixed Railway configuration
- Updated .env.production with all required variables

### 4. Frontend Configuration
- Created .env file for local development
- Created .env.production for production deployment
- Fixed API URL configuration in ForgotPasswordPage

## Deployment Steps

### Backend (Railway)

1. **Environment Variables** - Set in Railway dashboard:
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=base64:IF+Rt6jGkdsxWN4y7WXBUVZ08SZByr+E3sYClY7cG+8=
   APP_URL=https://lvccherald-production.up.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MYSQLHOST}}
   DB_PORT=${{MYSQLPORT}}
   DB_DATABASE=${{MYSQLDATABASE}}
   DB_USERNAME=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   
   SESSION_DOMAIN=.railway.app
   SANCTUM_STATEFUL_DOMAINS=lvcc-herald-frontend.vercel.app
   
   MAIL_MAILER=smtp
   MAIL_HOST=smtp-relay.brevo.com
   MAIL_PORT=587
   MAIL_USERNAME=rolandomajait1@gmail.com
   MAIL_PASSWORD=xsmtpsib-bfd89c8fa2b60e5d79f647d3817c7e384e186eef735506bf63c60fe4e0ccc32d-bfqzbQ3OEPXZQRDK
   MAIL_FROM_ADDRESS=rolandomajait1@gmail.com
   MAIL_FROM_NAME=LA_VERDAD_HERALD
   
   FRONTEND_URL=https://lvcc-herald-frontend.vercel.app
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   git add .
   git commit -m "Fix deployment configuration"
   git push
   ```

### Frontend (Vercel)

1. **Environment Variables** - Set in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://lvccherald-production.up.railway.app
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   npm run build
   # Deploy via Vercel CLI or push to GitHub
   ```

## Testing

1. Test forgot password: POST to `/api/forgot-password` with `{"email": "test@example.com"}`
2. Check email for reset link
3. Test reset password: POST to `/api/reset-password` with token, email, and new password
4. Test login with new password

## Common Issues

### CORS Errors
- Ensure FRONTEND_URL is set correctly in backend .env
- Check SANCTUM_STATEFUL_DOMAINS includes your frontend domain
- Verify config/cors.php has correct allowed origins

### Database Connection
- Verify Railway MySQL service is linked
- Check DB_* environment variables are set
- Run migrations: `php artisan migrate --force`

### Email Not Sending
- Verify MAIL_* credentials are correct
- Check Brevo/Sendinblue account is active
- Test with: `php artisan tinker` then `Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });`

### Session Issues
- Ensure SESSION_DOMAIN matches your deployment domain
- Clear config cache: `php artisan config:clear`
- Regenerate app key if needed: `php artisan key:generate`
