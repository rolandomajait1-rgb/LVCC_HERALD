# Render Deployment Guide

## Backend Setup (Render)

### 1. Create Web Service
- Go to Render Dashboard
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select `backend` folder as root directory

### 2. Configure Service
```
Name: lvcc-herald-backend
Environment: Docker (or Native)
Region: Choose closest to you
Branch: main
Root Directory: backend
```

### 3. Build & Start Commands
```
Build Command: bash build.sh
Start Command: bash start.sh
```

### 4. Environment Variables
```
APP_NAME=Laravel
APP_ENV=production
APP_KEY=base64:IF+Rt6jGkdsxWN4y7WXBUVZ08SZByr+E3sYClY7cG+8=
APP_DEBUG=false
APP_URL=https://your-app.onrender.com

DB_CONNECTION=mysql
DB_HOST=your-mysql-host
DB_PORT=3306
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

SESSION_DRIVER=database
SESSION_DOMAIN=.onrender.com
SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app

MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=rolandomajait1@gmail.com
MAIL_PASSWORD=xsmtpsib-bfd89c8fa2b60e5d79f647d3817c7e384e186eef735506bf63c60fe4e0ccc32d-bfqzbQ3OEPXZQRDK
MAIL_FROM_ADDRESS=rolandomajait1@gmail.com
MAIL_FROM_NAME=LA_VERDAD_HERALD

FRONTEND_URL=https://your-frontend.vercel.app
```

### 5. Add MySQL Database
- In Render Dashboard, create new MySQL database
- Copy connection details to environment variables above

## Frontend Setup (Vercel)

### 1. Environment Variable
```
REACT_APP_API_URL=https://your-app.onrender.com
```

### 2. Deploy
```bash
cd frontend
npm run build
vercel --prod
```

## Quick Deploy
1. Push code to GitHub
2. Render will auto-deploy backend
3. Update REACT_APP_API_URL in Vercel
4. Redeploy frontend
