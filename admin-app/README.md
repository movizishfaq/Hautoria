# Hautoria Admin (separate Vercel project)

Admin is **not** on `www.hautoria.com/admin`. Deploy it as a second project that talks to the store API.

## Local

```bash
# terminal 1 — API
npm run dev:server

# terminal 2 — admin UI (http://localhost:5174)
npm run dev:admin
```

Optional `.env` (repo root):

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SITE_URL=http://localhost:5173
```

## Vercel (second project)

1. Vercel → **Add New Project** → same GitHub repo `Hautoria`.
2. Project name e.g. `hautoria-admin`.
3. **Root Directory:** leave as repo root (`.`).
4. Build settings:
   - **Build Command:** `npm run build:admin`
   - **Output Directory:** `admin-dist`
   - **Install Command:** `npm install`
5. Environment variables:
   - `VITE_API_BASE_URL` = `https://www.hautoria.com/api`
   - `VITE_SITE_URL` = `https://www.hautoria.com`
6. Deploy. Open the new admin URL.
7. On the **store** project, set:
   - `VITE_ADMIN_URL` = your admin URL (so `/admin` redirects there)

Login: `admin@hautoria.com` / `Admin@123456`

Orders come only from MongoDB via `POST /api/orders` on checkout. Refresh Orders after a real checkout.
