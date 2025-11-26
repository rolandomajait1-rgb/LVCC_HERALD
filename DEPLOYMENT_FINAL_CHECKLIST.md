# Final Deployment Checklist

## ✅ Backend (Railway)
- [ ] Environment variables set (.env.production)
- [ ] Database migrations run
- [ ] CORS configured for frontend domain
- [ ] File uploads configured
- [ ] API endpoints tested

## ✅ Frontend (Vercel)
- [ ] Build successful (npm run build)
- [ ] Environment variables set
- [ ] API base URL updated for production
- [ ] Routes configured (vercel.json)
- [ ] Domain connected

## ✅ Database
- [ ] Production database created
- [ ] Seeders run (categories, admin user)
- [ ] Backups configured
- [ ] Connection string updated

## ✅ Security
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

## 🚀 Quick Deploy Commands
```bash
# Push to GitHub (triggers deployments)
git add .
git commit -m "Ready for production"
git push origin main

# Manual Railway deploy
railway up

# Manual Vercel deploy
vercel --prod
```