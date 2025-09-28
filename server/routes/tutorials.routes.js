import { Router } from 'express';
import * as ctrl from '../controllers/tutorials.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();
r.get('/', ctrl.list);
r.get('/:slug', ctrl.getBySlug);
r.post('/', requireAuth(['admin','author']), ctrl.create);
r.patch('/:id', requireAuth(['admin','author']), ctrl.update);
r.delete('/:id', requireAuth(['admin']), ctrl.remove);
export default r;
