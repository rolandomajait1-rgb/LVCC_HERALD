# COMPLETE DEPLOYMENT GUIDE

## BACKEND (Render)

### 1. Create PostgreSQL Database
1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Name: `lvcc-herald-db`
4. Region: Oregon (US West)
5. Click "Create Database"
6. Copy the "Internal Database URL"

### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repo: `LVCC_HERALD`
3. Settings:
   - Name: `lvcc-herald-backend`
   - Region: Oregon (US West)
   - Root Directory: `backend`
   - Environment: `Docker` or `Node`
   - Build Command: `bash build.sh`
   - Start Command: `bash start.sh`

### 3. Add Environment Variables
In the web service creation page, scroll to "Environment Variables" section:

1. Click "Add Environment Variable"
2. Add each variable one by one:

**Required Variables:**
```
APP_ENV = production
APP_DEBUG = false
APP_KEY = base64:rcPmrNjfNRXgbOhH2Gl0YsPn6FL+sGiaVTcaXyVoiwA=
APP_URL = https://lvcc-herald-backend.onrender.com
DATABASE_URL = <paste-internal-database-url-from-step-1>
SESSION_DOMAIN = .onrender.com
SANCTUM_STATEFUL_DOMAINS = lvcc-herald-frontend.vercel.app
MAIL_MAILER = smtp
MAIL_HOST = smtp-relay.brevo.com
MAIL_PORT = 587
MAIL_USERNAME = rolandomajait1@gmail.com
MAIL_PASSWORD = xsmtpsib-bfd89c8fa2b60e5d79f647d3817c7e384e186eef735506bf63c60fe4e0ccc32d-bfqzbQ3OEPXZQRDK
MAIL_FROM_ADDRESS = rolandomajait1@gmail.com
MAIL_FROM_NAME = LA_VERDAD_HERALD
FRONTEND_URL = https://lvcc-herald-frontend.vercel.app
```

3. Click "Create Web Service"

### 4. Wait for Deployment
1. Render will start building your app
2. Watch the "Logs" tab for progress
3. Look for "Build successful" message
4. Wait for "Your service is live" message
5. Copy your backend URL (e.g., `https://lvcc-herald-backend.onrender.com`)

### 5. Verify Backend is Running
1. Visit `https://your-backend-url.onrender.com/api/categories`
2. Should see JSON response (empty array or data)
3. If you see 500 error, check logs for database connection issues

---

## FRONTEND (Vercel)

### 1. Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `LVCC_HERALD` repo
4. Configure Project:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2. Add Environment Variable
1. Expand "Environment Variables" section
2. Add variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://lvcc-herald-backend.onrender.com` (use your actual backend URL from Render)
3. Select all environments (Production, Preview, Development)

### 3. Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build to complete
3. Copy your frontend URL (e.g., `https://lvcc-herald-frontend.vercel.app`)

### 4. Verify Frontend is Running
1. Visit your frontend URL
2. Should see the homepage
3. Try clicking around - if API calls fail, continue to Final Steps

---

## FINAL STEPS - CONNECT FRONTEND & BACKEND

### 1. Update Frontend with Real Backend URL
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Find `REACT_APP_API_URL`
4. Click "Edit"
5. Change value to your actual Render backend URL (e.g., `https://lvcc-herald-backend.onrender.com`)
6. Click "Save"
7. Go to "Deployments" tab
8. Click "..." on latest deployment → "Redeploy"
9. Wait for redeployment to complete

### 2. Update Backend with Real Frontend URL
1. Go to Render Dashboard → Your Web Service
2. Click "Environment" tab
3. Find `FRONTEND_URL` variable
4. Click "Edit"
5. Change value to your actual Vercel frontend URL (e.g., `https://lvcc-herald-frontend.vercel.app`)
6. Find `SANCTUM_STATEFUL_DOMAINS` variable
7. Click "Edit"
8. Change value to your actual Vercel frontend URL (without https://)
9. Click "Save Changes"
10. Render will auto-redeploy

### 3. Test Everything
1. Visit your frontend URL
2. Open browser DevTools (F12) → Console tab
3. Try these actions:
   - Click "Login" - should not show CORS error
   - Try registering a new account
   - Check if you receive verification email
   - Try logging in
4. If errors appear in console, check Troubleshooting section below

### 4. Success Checklist
- [ ] Backend URL returns JSON at `/api/categories`
- [ ] Frontend loads without errors
- [ ] No CORS errors in browser console
- [ ] Can register new account
- [ ] Receive verification email
- [ ] Can login after verification
- [ ] Can view articles

---

## TROUBLESHOOTING

### Backend 500 Error
- Check Render logs
- Verify DATABASE_URL is set
- Ensure migrations ran

### CORS Error
- Verify SANCTUM_STATEFUL_DOMAINS matches frontend URL
- Check FRONTEND_URL is correct

### Database Error
- Ensure PostgreSQL database is created
- Verify DATABASE_URL is correct
- Check migrations completed
