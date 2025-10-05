import { Router } from 'express';
import Tutorial from '../models/Tutorial.js';
import { crudRouter } from '../utils/crudRouter.js';

const r = Router();

// Public listing only returns published by default; admins can still POST/PUT/DELETE via auth.
r.use(
  '/',
  crudRouter(Tutorial, {
    listQuery: { status: 'published' },
    sort: { publishedAt: -1, createdAt: -1 },
    writable: true, // guarded inside crudRouter with requireAuth(['admin'])
  })
);

export default r;
