import { Router } from 'express';
const r = Router();

// GET /api/sources  (temporary stub)
r.get('/', (_req, res) => {
  res.json([
    // put your real sources here later
    { id: 'stub', name: 'Example Source', enabled: true }
  ]);
});

// POST /api/sources (optional stub)
r.post('/', (req, res) => {
  res.status(201).json({ ok: true, received: req.body || {} });
});

export default r;
