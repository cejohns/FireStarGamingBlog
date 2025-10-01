import cron from "node-cron";
import pRetry from "p-retry";
import { getGamingNews } from "../services/newsService.js";

// Optional: in-memory cache; swap to Redis/DB when ready
let latest = { ts: 0, items: [] };
export function getCachedNews() { return latest.items; }

async function refresh() {
  const items = await pRetry(() => getGamingNews({}), { retries: 2 });
  latest = { ts: Date.now(), items };
  console.log(`[news] refreshed ${items.length} items`);
}

export function startNewsCron() {
  // run now + every 15 minutes
  refresh().catch(console.error);
  cron.schedule("*/15 * * * *", () => refresh().catch(console.error));
}
