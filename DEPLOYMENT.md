# Deployment Guide - Vercel & Render

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- PostgreSQL database
- Environment variables configured

## Deployment on Vercel

### Step 1: Push to Git
```bash
git push origin main
```

### Step 2: Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select the project root directory

### Step 3: Configure Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DATABASE_URL = postgresql://user:password@host:port/dbname
SESSION_SECRET = your-secure-random-string
NODE_ENV = production
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

**Note:** Vercel has cold start limitations with bundled backends. For production, consider a dedicated backend service.

---

## Deployment on Render

### Step 1: Create PostgreSQL Database
1. Visit [render.com](https://render.com)
2. Click "New +" → "PostgreSQL"
3. Fill in database details:
   - **Name**: `doorstep-repair-db`
   - **Database**: `doorsteprepair`
   - **User**: `postgres`
   - **Region**: Choose closest to you
4. Click "Create Database"
5. Copy the Internal Database URL

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Select your Git repository
3. Configure:
   - **Name**: `doorstep-repair-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Region**: Same as database

### Step 3: Add Environment Variables
In Environment → Environment Variables, add:

```
NODE_ENV = production
DATABASE_URL = postgresql://[user]:[password]@[internal-host]:[port]/[dbname]
SESSION_SECRET = your-secure-random-string
PORT = 5000
```

### Step 4: Deploy
1. Click "Deploy"
2. Monitor deployment logs
3. Access your app at `https://doorstep-repair-api.onrender.com`

---

## One-Click Deployment Files

The following files have been created for deployment:

- **`vercel.json`** - Vercel build configuration
- **`render.yaml`** - Render service configuration
- **`.env.example`** - Environment variable template

---

## Database Migration

### First Time Setup

1. **Local testing** (before deployment):
```bash
npm run db:push
```

2. **On Render/Vercel**, run migrations after deployment:
```bash
npm run db:push
```

---

## Environment Variables Needed

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| `DATABASE_URL` | String | ✅ Yes | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | String | ⚠️ Recommended | `abc123def456` (use `openssl rand -hex 32`) |
| `NODE_ENV` | String | ✅ Yes | `production` |
| `PORT` | Number | Optional | `5000` |

---

## Troubleshooting

### Build Fails
- Clear build cache: Vercel → Settings → Function & Serverless → Clear Cache
- Check `script/build.ts` esbuild configuration

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check firewall rules allow your IP
- Test locally with `npm run db:push`

### Cold Start Issues (Vercel)
- Consider using Render for backend (better for Node.js)
- Enable "Serverless Function" caching in Vercel

---

## Recommended Setup

**For best performance:**
- **Frontend**: Vercel (React with Vite)
- **Backend API**: Render (Node.js/Express)
- **Database**: Render PostgreSQL or Neon

Or:
- **Everything**: Render (simpler architecture)

---

## Production Checklist

- [ ] DATABASE_URL set in environment variables
- [ ] SESSION_SECRET set to a random secure string
- [ ] NODE_ENV set to `production`
- [ ] Database migrations run (`npm run db:push`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Start command works locally (`npm start`)
- [ ] CORS configured if needed
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render)
- [ ] **Cron job configured for keep-alive** (see `CRON_KEEP_ALIVE.md`)

