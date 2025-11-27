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
```
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:rcPmrNjfNRXgbOhH2Gl0YsPn6FL+sGiaVTcaXyVoiwA=
APP_URL=https://lvcc-herald-backend.onrender.com
DATABASE_URL=<paste-internal-database-url>
SESSION_DOMAIN=.onrender.com
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

4. Click "Create Web Service"

---

## FRONTEND (Vercel)

### 1. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import `LVCC_HERALD` repo
3. Settings:
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 2. Add Environment Variable
```
REACT_APP_API_URL=https://lvcc-herald-backend.onrender.com
```

3. Click "Deploy"

---

## FINAL STEPS

### 1. Update Backend URL in Frontend
After backend deploys, copy the URL (e.g., `https://lvcc-herald-backend.onrender.com`)

In Vercel:
1. Go to Project Settings → Environment Variables
2. Update `REACT_APP_API_URL` with actual backend URL
3. Redeploy

### 2. Update Frontend URL in Backend
After frontend deploys, copy the URL (e.g., `https://lvcc-herald-frontend.vercel.app`)

In Render:
1. Update `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` with actual frontend URL
2. Redeploy

### 3. Test
- Visit frontend URL
- Try login/register
- Check if API calls work

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
