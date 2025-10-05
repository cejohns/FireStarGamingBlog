// backend/server/routes/articles.routes.js
import { Router } from 'express';

let Article = null;
let usingMongo = false;

try {
  const m = await import('../models/Article.js');
  Article = m.default;
  usingMongo = !!Article;
} catch {
  // model not present: fallback to memory
}

const memory = []; // fallback storage when Mongo isn't ready
const r = Router();

// GET /api/articles?q=...
r.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (usingMongo) {
      const match = { status: 'published' };
      if (q) {
        match.$or = [
          { title:   { $regex: q, $options: 'i' } },
          { summary: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
          { source:  { $regex: q, $options: 'i' } },
        ];
      }
      const items = await Article
        .find(match)
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(100)
        .lean();
      return res.json(items);
    } else {
      // in-memory search
      const items = !q
        ? memory
        : memory.filter(a =>
            [a.title, a.summary, a.content, a.source]
              .filter(Boolean)
              .some(s => s.toLowerCase().includes(q.toLowerCase()))
          );
      return res.json(items);
    }
  } catch (e) { next(e); }
});

// POST /api/articles  (optional dev seeding)
r.post('/', async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title ?? 'Untitled',
      link: req.body.link ?? '',
      source: req.body.source ?? 'manual',
      summary: req.body.summary ?? '',
      content: req.body.content ?? '',
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
      status: req.body.status ?? 'published',
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    };

    if (usingMongo) {
      const created = await Article.create(payload);
      return res.status(201).json(created);
    } else {
      const doc = { ...payload, _id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
      memory.unshift(doc);
      return res.status(201).json(doc);
    }
  } catch (e) { next(e); }
});

export default r;
