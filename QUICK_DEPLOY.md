# Quick Deploy Checklist

## 1. Push Code
```bash
git add .
git commit -m "Deploy"
git push origin main
```

## 2. Render - Database
- New PostgreSQL
- Copy Internal Database URL

## 3. Render - Backend
- New Web Service
- Root: `backend`
- Build: `composer install --no-dev --optimize-autoloader`
- Start: `php artisan serve --host=0.0.0.0 --port=$PORT`
- Add env vars (see DEPLOYMENT_GUIDE.md)
- Shell: `php artisan migrate --force && php artisan db:seed --force`

## 4. Vercel - Frontend
- Import from GitHub
- Root: `frontend`
- Framework: Vite
- Env: `VITE_API_URL=https://your-backend.onrender.com`

## 5. Update Backend
- Set `FRONTEND_URL=https://your-frontend.vercel.app` in Render

## Done! 🚀
