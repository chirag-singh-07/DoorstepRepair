# Internal Cron Jobs Configuration

## Overview

Your application now includes built-in cron job support using `node-cron`. This runs scheduled tasks directly within your Node.js application.

## Currently Scheduled Jobs

### 1. Keep-Alive Health Check
- **Schedule**: Every 10 minutes (`*/10 * * * *`)
- **Purpose**: Pings the health endpoint to keep the server alive on Render's free tier
- **Endpoint**: `/api/health`

### 2. Database Connection Check
- **Schedule**: Every hour (`0 * * * *`)
- **Purpose**: Verifies database connectivity
- **Endpoint**: `/api/health`

---

## Configuration

### Environment Variable: `CRON_JOB_URL`

The cron jobs use this URL to make internal health check requests:

```env
# Local Development
CRON_JOB_URL=http://localhost:5000/api/health

# Production on Render
CRON_JOB_URL=https://your-app.onrender.com/api/health

# Production on Vercel
CRON_JOB_URL=https://your-app.vercel.app/api/health
```

---

## How It Works

1. **Server Starts**: `npm start` or `npm run dev`
2. **Routes Registered**: All API endpoints are set up
3. **Cron Jobs Initialize**: `initializeCronJobs()` is called
4. **Scheduled Tasks Run**: Jobs execute at their scheduled intervals
5. **Logs Generated**: Check console for `[CRON]` prefixed messages

---

## Cron Job Files

### `/server/cron.ts`
- Core cron job configuration
- Defines all scheduled tasks
- Functions:
  - `initializeCronJobs()` - Start all jobs
  - `stopCronJobs()` - Stop all jobs

### Modified Files
- `server/index.ts` - Calls `initializeCronJobs()` on server startup
- `.env` - Added `CRON_JOB_URL` variable
- `.env.example` - Template with examples

---

## Adding New Cron Jobs

To add a new scheduled task, edit `/server/cron.ts`:

```typescript
const jobs: CronJob[] = [
  {
    name: "My New Job",
    schedule: "0 0 * * *", // Daily at midnight
    task: async () => {
      console.log("Task running at", new Date());
      // Your task logic here
    },
  },
];
```

### Common Cron Schedules

| Pattern | Description |
|---------|-------------|
| `*/5 * * * *` | Every 5 minutes |
| `*/10 * * * *` | Every 10 minutes |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily at midnight |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | Monthly on day 1 |

More info: [node-cron documentation](https://crontab.guru/)

---

## Monitoring Cron Jobs

### Local Development

Watch the console for messages like:

```
[CRON] Initializing scheduled jobs...
[CRON] ✓ Keep-Alive Health Check scheduled: */10 * * * *
[CRON] ✓ Database Connection Check scheduled: 0 * * * *
[CRON] All scheduled jobs initialized

[CRON] Keep-Alive pinged at 2026-04-12T10:30:00.000Z: ok
[CRON] Database connection verified at 2026-04-12T11:00:00.000Z
```

### Production (Render)

1. Go to Render Dashboard → Your App → Logs
2. Filter for `[CRON]` messages
3. Verify health checks are running at scheduled times

---

## When to Use Internal vs External Cron

### Use Internal Cron (`node-cron`)
- ✅ Simple keep-alive pings
- ✅ Database health checks
- ✅ Runs on the same process as your server
- ⚠️ Only works if server is running

### Use External Cron (EasyCron/GitHub Actions)
- ✅ Mission-critical tasks that must run even if server crashes
- ✅ When you need independent job scheduling
- ✅ Using Render/Vercel - prevents cold starts
- ✅ Load distribution across services

### Recommended Setup

**Development & Testing:**
- Use internal `node-cron` for simplicity

**Production:**
- Use internal `node-cron` for basic health checks
- Use external cron (EasyCron/GitHub Actions) for critical tasks

---

## Troubleshooting

### "Cron jobs not running?"

1. Check logs for `[CRON]` initialization messages
2. Verify server started successfully
3. Check `CRON_JOB_URL` is correct
4. Ensure health endpoint is accessible

### "Too many requests in logs?"

- Reduce cron frequency by changing the schedule
- Example: Change `*/10 * * * *` (every 10 min) to `0 * * * *` (hourly)

### "Database connection check fails?"

- Verify `DATABASE_URL` is configured
- Check database is accessible from server
- Look at detailed error messages in logs

---

## Testing Cron Jobs Locally

### Start Development Server

```bash
npm run dev
```

### Check Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-12T10:30:45.123Z",
  "uptime": 3600.5
}
```

### Wait for Cron Execution

- First check runs at next 10-minute interval
- Watch console for `[CRON]` messages
- Example: If you start at 10:04, first check runs at 10:10

---

## Deployment Notes

### For Render
- ✅ Cron jobs will run automatically
- ✅ No external setup needed
- ✅ Keeps app alive on free tier
- Update `CRON_JOB_URL` in Environment Variables:
  ```
  CRON_JOB_URL=https://your-app.onrender.com/api/health
  ```

### For Vercel
- ⚠️ Internal cron has limitations (serverless environment)
- ✅ Use external cron services instead
- Keep `CRON_JOB_URL` for development/testing
- Recommend: EasyCron or GitHub Actions for production

---

## Performance Impact

- **Memory**: Minimal (< 1MB for cron scheduling)
- **CPU**: Negligible (health check takes ~50ms)
- **Network**: One HTTP request every 10 minutes
- **Database**: One query every hour

No noticeable performance degradation on typical deployments.
