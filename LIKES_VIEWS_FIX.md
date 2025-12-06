# Likes at Views Fix - Ayos na!

## Problema
Ang likes at views ay nag-rereset pagkatapos mag-refresh ng page dahil naka-store lang sa local state at gumagamit ng random numbers.

## Solusyon

### 1. Frontend Changes (ArticleCard.jsx)
- **Tinanggal**: Random number generation para sa likes
- **Idinagdag**: 
  - Fetch ng actual likes count mula sa backend API
  - localStorage persistence para sa guest users
  - Backend API call para sa authenticated users
  - Auto-load ng likes data on component mount

### 2. Frontend Changes (ArticleDetail.jsx)
- **Idinagdag**:
  - localStorage persistence para sa likes
  - Session tracking para sa views
  - Proper error handling para sa unauthenticated users
  - Backend integration para sa authenticated users

### 3. Backend Changes (ArticleController.php)
- **Ina-update ang mga methods**:
  - `show()` - Returns likes_count at is_liked status
  - `showBySlug()` - Returns likes_count at is_liked status
  - `showById()` - Returns likes_count at is_liked status
- **Existing API endpoints**:
  - `POST /api/articles/{article}/like` - Toggle like/unlike

## Paano Gumagana

### Para sa Guest Users (Hindi naka-login)
1. Likes ay naka-store sa **localStorage**
2. Hindi mag-rereset kahit mag-refresh
3. Data ay naka-persist sa browser

### Para sa Authenticated Users (Naka-login)
1. Likes ay naka-store sa **database** via backend API
2. Real-time sync sa lahat ng devices
3. localStorage ay ginagamit as cache
4. Views ay naka-track sa database

## Database Schema
Existing table: `article_user_interactions`
- `user_id` - User who interacted
- `article_id` - Article ID
- `type` - 'liked', 'viewed', 'shared'

## Testing
1. **Guest User Test**:
   - Click like button
   - Refresh page
   - Like count dapat same pa rin

2. **Authenticated User Test**:
   - Login
   - Click like button
   - Refresh page
   - Like count dapat same pa rin
   - Check sa ibang device/browser - dapat synced

## API Endpoints Used
- `GET /api/articles/{id}` - Get article with likes count
- `POST /api/articles/{id}/like` - Toggle like (requires auth)
- `GET /api/articles/by-slug/{slug}` - Get article by slug with likes
- `GET /api/articles/id/{id}` - Get article by ID with likes

## Notes
- Views ay naka-track per session (sessionStorage)
- Likes ay persistent (localStorage for guests, database for users)
- Backend automatically tracks views when authenticated users view articles
