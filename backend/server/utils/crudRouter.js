// backend/server/utils/crudRouter.js
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';

export function crudRouter(Model, { writable = true, listQuery = {}, sort = { createdAt: -1 } } = {}) {
  const r = Router();

  // LIST
  r.get('/', async (req, res, next) => {
    try {
      const { q } = req.query;
      let query = { ...listQuery };
      if (q) {
        query.$or = [
          { title: new RegExp(q, 'i') },
          { summary: new RegExp(q, 'i') },
          { body: new RegExp(q, 'i') },
        ];
      }
      const items = await Model.find(query).sort(sort).limit(100);
      res.json(items);
    } catch (e) { next(e); }
  });

  // READ
  r.get('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json(doc);
    } catch (e) { next(e); }
  });

  if (writable) {
    // CREATE
    r.post('/', requireAuth(['admin']), async (req, res, next) => {
      try {
        const doc = await Model.create(req.body);
        res.status(201).json(doc);
      } catch (e) { next(e); }
    });

    // UPDATE
    r.put('/:id', requireAuth(['admin']), async (req, res, next) => {
      try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.json(doc);
      } catch (e) { next(e); }
    });

    // DELETE
    r.delete('/:id', requireAuth(['admin']), async (req, res, next) => {
      try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Not found' });
        res.status(204).end();
      } catch (e) { next(e); }
    });
  }

  return r;
}
