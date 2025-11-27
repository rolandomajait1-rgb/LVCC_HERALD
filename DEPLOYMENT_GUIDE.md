# Deployment Guide - La Verdad Herald

## Prerequisites
- GitHub account
- Render account (backend + database)
- Vercel account (frontend)
- Brevo account (email)

---

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Render

### A. Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Settings:
   - Name: `laverdad-herald-db`
   - Database: `laverdad_herald_db`
   - User: `laverdad_herald_user`
   - Region: `Oregon (US West)`
   - Plan: **Free**
4. Click **Create Database**
5. **Copy** Internal Database URL (starts with `postgres://`)

### B. Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - Name: `laverdad-herald-backend`
   - Region: `Oregon (US West)`
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `PHP`
   - Build Command: `composer install --no-dev --optimize-autoloader`
   - Start Command: `php artisan serve --host=0.0.0.0 --port=$PORT`
   - Plan: **Free**

### C. Add Environment Variables
Click **Environment** → **Add Environment Variable**:

```
APP_NAME=LaVerdadHerald
APP_ENV=production
APP_KEY=base64:rcPmrNjfNRXgbOhH2Gl0YsPn6FL+sGiaVTcaXyVoiwA=
APP_DEBUG=false
APP_URL=https://laverdad-herald-backend.onrender.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=<from-database-internal-url>
DB_PORT=5432
DB_DATABASE=laverdad_herald_db
DB_USERNAME=laverdad_herald_user
DB_PASSWORD=<from-database-internal-url>

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-brevo-smtp-key
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME=LaVerdadHerald

FRONTEND_URL=https://laverdad-herald-frontend.vercel.app
```

**IMPORTANT:** Replace:
- `<from-database-internal-url>` - Get from database page
- `your-email@gmail.com` - Your email
- `your-brevo-smtp-key` - Get from Brevo dashboard

### D. Deploy
1. Click **Create Web Service**
2. Wait for build to complete (~5 minutes)
3. **Copy** the backend URL: `https://laverdad-herald-backend.onrender.com`

### E. Run Migrations
1. Go to **Shell** tab
2. Run:
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## Step 3: Deploy Frontend to Vercel

### A. Import Project
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### B. Add Environment Variable
Click **Environment Variables**:
```
VITE_API_URL=https://laverdad-herald-backend.onrender.com
```

### C. Deploy
1. Click **Deploy**
2. Wait for deployment (~2 minutes)
3. **Copy** the frontend URL: `https://laverdad-herald-frontend.vercel.app`

---

## Step 4: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your actual Vercel URL:
```
FRONTEND_URL=https://laverdad-herald-frontend.vercel.app
```
5. Click **Save Changes** (will auto-redeploy)

---

## Step 5: Test Deployment

### Test Backend
```bash
curl https://laverdad-herald-backend.onrender.com/api/articles
```
Should return JSON response.

### Test Frontend
1. Open: `https://laverdad-herald-frontend.vercel.app`
2. Try to register a new account
3. Check if articles load
4. Test login

---

## Troubleshooting

### CORS Errors
See `CORS_TROUBLESHOOTING.md`

### Database Connection Failed
- Check DB credentials in Render environment variables
- Verify database is running (green status)

### 500 Server Error
- Check Render logs: Dashboard → Logs
- Verify APP_KEY is set
- Run migrations again

### Frontend Can't Connect
- Verify `VITE_API_URL` in Vercel
- Check backend is running (green status)
- Test backend URL directly in browser

---

## Post-Deployment

### Update on Code Changes

**Backend:**
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render auto-deploys from GitHub.

**Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel auto-deploys from GitHub.

### Monitor
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- Check logs regularly for errors

---

## Default Admin Account
After seeding:
- Email: `admin@laverdadherald.com`
- Password: `password123`

**CHANGE THIS IMMEDIATELY IN PRODUCTION!**
