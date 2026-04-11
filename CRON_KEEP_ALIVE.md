# Cron Job Configuration for Keep-Alive

## Problem on Render
Render's free tier spins down inactive services after 15 minutes. This means your website will be slow to load after inactivity. To prevent this, we use a cron job to ping the health endpoint periodically.

## Solution: External Cron Services

Since Render doesn't have built-in cron job management, we recommend using one of these free services:

---

## Option 1: EasyCron (Recommended - Easiest Setup)

### Setup Steps:

1. **Visit**: https://www.easycron.com/
2. **Sign Up** (free)
3. **Create New Cron Job**:
   - **Cron URL**: `https://your-app.onrender.com/api/health`
   - **Execution interval**: Every 10 minutes (0 */10 * * * *)
   - **Timezone**: Your timezone
   - **HTTP Method**: GET
4. **Click "Create"**
5. Done! The cron will ping your health endpoint every 10 minutes

**Pros**: Simple UI, free tier, no setup needed  
**Cons**: Limited to 1 free job on free tier

---

## Option 2: cron-job.org (Free Alternative)

### Setup Steps:

1. **Visit**: https://cron-job.org/
2. **Sign Up** (free - no credit card needed)
3. **Create New Cronjob**:
   - **URL**: `https://your-app.onrender.com/api/health`
   - **Execution time**: Every 10 minutes
   - **Notification**: Enable email alerts (optional)
4. **Save**
5. Done!

**Pros**: Multiple free jobs, reliable  
**Cons**: Slightly more complex UI

---

## Option 3: GitHub Actions (Advanced - Most Reliable)

### Setup Steps:

1. **In your GitHub repo**, create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Alive

on:
  schedule:
    # Runs every 10 minutes
    - cron: '*/10 * * * *'
  workflow_dispatch:

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping health endpoint
        run: |
          curl -f https://your-app.onrender.com/api/health || exit 1
```

2. **Push to GitHub**
3. **Enable Actions** if not already enabled
4. Done! GitHub will automatically ping your endpoint every 10 minutes

**Pros**: Free, reliable, integrated with GitHub  
**Cons**: Requires GitHub, slight setup

---

## Option 4: UptimeRobot (Uptime Monitoring + Keep-Alive)

### Setup Steps:

1. **Visit**: https://uptimerobot.com/
2. **Sign Up** (free)
3. **Add New Monitor**:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: `Doorstep Repair Keep-Alive`
   - **URL**: `https://your-app.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes (keeps app alive + monitors uptime)
   - **Alert Contacts**: Add your email
4. **Click "Create Monitor"**
5. Done!

**Pros**: Also monitors uptime, free tier has many jobs, dashboard  
**Cons**: Slightly slower response

---

## Health Check Endpoint

The endpoint has been added to your server:

```
GET /api/health
```

**Response (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2026-04-12T10:30:45.123Z",
  "uptime": 3600.5
}
```

**Response (503 Service Unavailable)**:
```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

---

## Testing Locally

```bash
curl http://localhost:5000/api/health
```

---

## Recommended Configuration

| Platform | Interval | Method |
|----------|----------|--------|
| Render Free | 10 minutes | EasyCron or GitHub Actions |
| Render Pro | Not needed | Keep-alive not required |
| Production | 5 minutes | UptimeRobot (also monitors uptime) |

---

## How It Works

1. **Without Cron**: App spins down after 15 min → Next request takes 30-50 seconds (cold start)
2. **With Cron**: App stays alive → Fast response times always

The cron job simply makes a request to `/api/health` every 10 minutes, which keeps the container active.

---

## Verify It's Working

After setting up the cron job, watch your Render dashboard:

1. Go to Render → Your App → Logs
2. You should see requests to `/api/health` every ~10 minutes
3. If requests appear, the cron job is working ✅

---

## Next Steps

1. **Choose your cron service** (EasyCron recommended)
2. **Set up cron job** to ping `/api/health`
3. **Test**: Wait 10 minutes and check logs
4. **Verify**: Visit your app after inactivity → should load instantly

