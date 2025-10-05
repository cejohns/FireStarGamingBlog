import { Router } from 'express';
import sources from '../config/sources.js';
const r = Router();

r.get('/', (_req, res) => res.json(sources));

export default r;
