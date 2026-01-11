const cron = require("node-cron");
const { fetchTeluguNews } = require("../services/teluguser");

console.log("Telugu RSS cron started");

cron.schedule("*/10 * * * *", async () => {
  try {
    const categories = ["general", "politics", "sports", "cinema"];

    for (const cat of categories) {
      await fetchTeluguNews(cat);
    }

    console.log("Cron fetch done");
  } catch (err) {
    console.error("Cron error:", err.message);
  }
});
