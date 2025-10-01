import { Router } from 'express';
const r = Router();

/**
 * NOTE: This is a stub so the API can start.
 * Replace with real register/login controller later.
 */
r.post('/register', (_req, res) => res.status(201).json({ ok: true }));
r.post('/login', (_req, res) => res.json({ token: 'stub', role: 'admin' }));

export default r;
