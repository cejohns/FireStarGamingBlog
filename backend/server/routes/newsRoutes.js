import { Router } from 'express';
import { getCachedNews, ingestOnce } from '../jobs/newsIngest.js';

const r = Router();

// Cached list (fast)
r.get('/', (_req, res) => {
  res.json({ count: getCachedNews().length, items: getCachedNews() });
});

// Force a refresh (protect with auth in prod)
r.post('/refresh', async (_req, res) => {
  const n = await ingestOnce();
  res.json({ refreshed: n });
});

export default r;
