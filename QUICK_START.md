# 🚀 Quick Start Guide - La Verdad Herald

## Para sa Local Development

### 1️⃣ Start Backend (Laravel)

```bash
cd backend
php artisan serve
```

✅ Backend running sa: **http://localhost:8000**

---

### 2️⃣ Start Frontend (React)

```bash
cd frontend
npm run dev
```

✅ Frontend running sa: **http://localhost:5173**

---

### 3️⃣ Test Connection

Open browser: **http://localhost:5173**

Check kung may articles na lumalabas sa homepage.

---

## 🔧 Configuration Check

### Backend (.env)
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend (.env)
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🐛 Troubleshooting

### Problem: CORS Error
```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

### Problem: Routes not found
```bash
cd backend
php artisan route:clear
php artisan optimize
```

### Problem: Database error
```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 📊 Test Endpoints

### Test Backend
```bash
curl http://localhost:8000/api/ping
# Response: {"message":"pong"}
```

### Test Articles
```bash
curl http://localhost:8000/api/articles/public
# Response: {...articles...}
```

---

## 👤 Default Admin Account

```
Email: admin@example.com
Password: password
```

---

## 📁 Project Structure

```
TEST/
├── backend/          # Laravel API
│   ├── routes/api.php
│   ├── app/Http/Controllers/
│   └── .env
├── frontend/         # React App
│   ├── src/
│   ├── .env
│   └── vite.config.js
└── README.md
```

---

## 🔑 Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Admin Dashboard | http://localhost:5173/admin |
| Login | http://localhost:5173/login |

---

## ✅ Checklist

- [ ] Backend running (port 8000)
- [ ] Frontend running (port 5173)
- [ ] Database connected
- [ ] Articles showing on homepage
- [ ] Can login as admin
- [ ] Can create/edit articles

---

## 📚 More Info

- **API Endpoints:** See `ENDPOINTS_ORGANIZED.md`
- **Connection Guide:** See `API_CONNECTION_GUIDE.md`
- **Full README:** See `README.md`
