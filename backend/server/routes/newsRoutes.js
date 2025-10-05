import { Router } from 'express';
const r = Router();

r.get('/', (_req, res) => {
  res.json({ items: [], note: 'newsRoutes stub — replace with real implementation' });
});

export default r;
