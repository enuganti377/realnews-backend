const cron = require("node-cron");
const { fetchJobs } = require("../services/job"); 

console.log("Jobs RSS cron registered");


cron.schedule("*/10 * * * *", async () => {
  try {
    console.log(" Fetching JOBS: govt");
    const count = await fetchJobs("govt");
    console.log(`Jobs saved (govt): ${count}`);
  } catch (err) {
    console.error(" Jobs Cron error:", err.message);
  }
});

