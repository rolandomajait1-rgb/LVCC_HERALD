# Render Blueprint Deployment

## Deploy Everything at Once

### 1. Push render.yaml
```bash
git add render.yaml
git commit -m "Add Render blueprint"
git push
```

### 2. Deploy on Render
1. Go to https://dashboard.render.com/select-repo
2. Select your `LVCC_HERALD` repository
3. Render will detect `render.yaml` and create:
   - Backend web service
   - MySQL database
   - Auto-link them

### 3. Add Secret Environment Variables
After deployment, add in Render dashboard:
```
MAIL_PASSWORD=xsmtpsib-bfd89c8fa2b60e5d79f647d3817c7e384e186eef735506bf63c60fe4e0ccc32d-bfqzbQ3OEPXZQRDK
APP_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
SESSION_DOMAIN=.onrender.com
```

### 4. Deploy Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set environment variable in Vercel:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

## Done!
Both frontend and backend deployed.
