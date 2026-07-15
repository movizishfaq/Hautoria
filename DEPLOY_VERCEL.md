# Deploy Hautoria on Vercel (full stack)

No Railway/Render needed. Frontend (Vite) + API (Express as one serverless function) run on the **same** Vercel project. Database stays on **MongoDB Atlas**.

## Architecture

```
Browser  →  https://your-app.vercel.app
              ├── /*          → Vite SPA (dist/)
              └── /api/*      → api/[...path].ts  → Express app (server/src/app.ts)
                                                    → MongoDB Atlas
```

Locally you can still run:

```bash
npm run dev:all
```

- Vite on `:5173` proxies `/api` → `:3001`
- Or rely on Vercel CLI: `npx vercel dev`

## One-time setup

### 1. MongoDB Atlas

1. Create a cluster and database user.
2. **Network Access** → add `0.0.0.0/0` (Vercel uses dynamic IPs).
3. Copy the connection string (`MONGODB_URI`). URL-encode special characters in the password (e.g. `@` → `%40`).

### 2. Seed products + admin (run once from your machine)

```bash
# .env at repo root must include MONGODB_URI + JWT secrets
npm run seed
```

Admin after seed:

- Email: `admin@hautoria.com`
- Password: `Admin@123456`

### 3. Import on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import `Hautoria` GitHub repo.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Install Command: `npm install`
6. Root Directory: `.` (repo root)

### 4. Environment variables (Vercel → Project → Settings → Environment Variables)

Add these for **Production**, **Preview**, and **Development** (as needed):

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `MONGODB_URI` | **Yes** | `mongodb+srv://user:pass@cluster.../hautoria?...` |
| `JWT_SECRET` | **Yes** | Long random string |
| `REFRESH_TOKEN_SECRET` | **Yes** | Different long random string |
| `CLIENT_URL` | **Yes** | `https://your-app.vercel.app` (your production domain) |
| `NODE_ENV` | Recommended | `production` |
| `VITE_API_BASE_URL` | Recommended | `/api` (same-origin API) |
| `STORE_NAME` | Optional | `Hautoria` |
| `STORE_TAGLINE` | Optional | `Crafted for Timeless Skin.` |
| `JWT_EXPIRES_IN` | Optional | `7d` |
| `REFRESH_TOKEN_EXPIRES_IN` | Optional | `30d` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | Optional | Order emails |
| `WHATSAPP_PROVIDER` | Optional | `callmebot` \| `meta` \| `webhook` |
| `WHATSAPP_STORE_NUMBER` | Optional | Store alerts |
| `WHATSAPP_CALLMEBOT_APIKEY` | Optional | If using CallMeBot |
| `VITE_WHATSAPP_NUMBER` | Optional | Customer WhatsApp button |

> `VITE_*` vars are baked in at **build** time. After changing them, **Redeploy**.

### 5. Deploy

Push to `main` or click **Deploy**. Open:

- Store: `https://your-app.vercel.app`
- Health: `https://your-app.vercel.app/api/health`
- Admin: `https://your-app.vercel.app/admin/login`

## Verify after deploy

- [ ] `GET /api/health` returns `{ status: "ok", runtime: "vercel-serverless" }`
- [ ] Register / login
- [ ] Admin login
- [ ] Product listing & product detail
- [ ] Cart → checkout → order created
- [ ] Admin → Orders shows the order
- [ ] Admin can update order status
- [ ] Products editable in admin

## Platform notes (honest limits)

| Topic | Status |
|-------|--------|
| Express API on Vercel | Supported via single serverless function |
| MongoDB Atlas | Supported (cache connections; allow `0.0.0.0/0`) |
| Auth / admin / checkout | Supported |
| In-memory rate limits | Disabled on Vercel (not shared across instances). Optional later: Upstash Redis |
| SMTP / WhatsApp on checkout | Supported if env set; may approach Hobby **10s** limit under load — Pro plan allows `maxDuration: 30` (already configured) |
| Disk file uploads | Not used (images are URL/paths). For real uploads use **Vercel Blob** |
| WebSockets | Not used |
| PDF invoices (`pdfkit`) | In-memory Buffer — works; if bundling fails, switch to an HTTP PDF API |

## Project structure (relevant)

```
Hautoria/
├── api/
│   └── [...path].ts      # Vercel serverless entry → Express
├── server/
│   └── src/
│       ├── app.ts        # Express app (no listen)
│       ├── index.ts      # Local `npm run dev:server`
│       ├── config/db.ts  # Cached Mongo connect
│       └── routes/       # Unchanged business routes
├── src/                  # React storefront + admin
├── vercel.json
└── package.json          # Frontend + API dependencies
```
