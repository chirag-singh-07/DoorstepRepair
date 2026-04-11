import cron from "node-cron";

const CRON_JOB_URL = process.env.CRON_JOB_URL || `http://localhost:${process.env.PORT || 5000}/api/health`;

interface CronJob {
  name: string;
  schedule: string;
  task: () => Promise<void>;
}

const jobs: CronJob[] = [
  {
    name: "Keep-Alive Health Check",
    schedule: "*/10 * * * *", // Every 10 minutes
    task: async () => {
      try {
        const response = await fetch(CRON_JOB_URL);
        const data = await response.json();
        console.log(`[CRON] Keep-Alive pinged at ${new Date().toISOString()}: ${data.status}`);
      } catch (error) {
        console.error(`[CRON] Keep-Alive health check failed:`, error);
      }
    },
  },
  {
    name: "Database Connection Check",
    schedule: "0 * * * *", // Every hour
    task: async () => {
      try {
        const response = await fetch(`${CRON_JOB_URL}`);
        if (response.ok) {
          console.log(`[CRON] Database connection verified at ${new Date().toISOString()}`);
        }
      } catch (error) {
        console.error(`[CRON] Database connection check failed:`, error);
      }
    },
  },
];

export function initializeCronJobs(): void {
  console.log("[CRON] Initializing scheduled jobs...");

  jobs.forEach((job) => {
    try {
      cron.schedule(job.schedule, async () => {
        try {
          await job.task();
        } catch (error) {
          console.error(`[CRON] Error executing ${job.name}:`, error);
        }
      });
      console.log(`[CRON] ✓ ${job.name} scheduled: ${job.schedule}`);
    } catch (error) {
      console.error(`[CRON] Failed to schedule ${job.name}:`, error);
    }
  });

  console.log("[CRON] All scheduled jobs initialized");
}

export function stopCronJobs(): void {
  console.log("[CRON] Stopping all scheduled jobs...");
  cron.getTasks().forEach((task) => task.stop());
}
