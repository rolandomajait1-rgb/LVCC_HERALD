# Deploy to Railway + Vercel

## Step 1: Deploy Backend to Railway

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select backend folder/repo
4. Add MySQL: Click "New" → "Database" → "Add MySQL"

### Environment Variables:
```
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:rcPmrNjfNRXgbOhH2Gl0YsPn6FL+sGiaVTcaXyVoiwA=
APP_DEBUG=false
APP_URL=https://your-backend.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_DATABASE=${{MYSQLDATABASE}}
DB_USERNAME=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-brevo-smtp-key
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME=LA_VERDAD_HERALD

FRONTEND_URL=https://your-frontend.vercel.app
```

## Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click "Add New" → "Project"
3. Import frontend folder/repo
4. Framework: Vite
5. Build: `npm run build`
6. Output: `dist`

### Environment Variables:
```
VITE_API_BASE_URL=https://your-backend.railway.app/api
VITE_APP_NAME=La Verdad Herald
```

## Step 3: Update CORS

Update Railway `FRONTEND_URL` with actual Vercel URL and redeploy.

## Step 4: Import Database

```bash
mysqldump -u root "final laverdad herald" > database.sql
```

Import via Railway MySQL dashboard or CLI.

## Done!
- Frontend: https://your-frontend.vercel.app
- Backend: https://your-backend.railway.app
