// backend/server/routes/tutorials.routes.js
import { Router } from 'express';
import Tutorial from '../models/Tutorial.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js'; // adjust if your auth names differ
import sanitizeHtml from 'sanitize-html';

const r = Router();

// small helper to log rich errors
const logErr = (label, err) => {
  console.error(`🛑 ${label}`, {
    name: err?.name,
    code: err?.code,
    message: err?.message,
    keyValue: err?.keyValue,
    stack: err?.stack?.split('\n').slice(0, 3).join('\n'),
  });
};

// GET /api/tutorials  (search, tag, pagination)
r.get('/', async (req, res) => {
  try {
    const { q, tag, page = 1, limit = 20 } = req.query;
    const filter = { status: 'published' };

    if (q) {
      filter.$text = { $search: q };
    }
    if (tag) {
      filter.tags = tag; // tags is an array of strings
    }

    const cursor = Tutorial.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    if (q) cursor.select({ score: { $meta: 'textScore' } });

    const items = await cursor.lean();
    res.json(items);
  } catch (err) {
    logErr('Route error: GET /api/tutorials', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/tutorials (admin)
r.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const payload = { ...req.body };

    // basic normalization
    if (typeof payload.slug === 'string') {
      payload.slug = payload.slug.trim().toLowerCase();
    }
    if (payload.body) {
      payload.body = sanitizeHtml(payload.body, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']) });
    }
    if (payload.summary) {
      payload.summary = sanitizeHtml(payload.summary);
    }
    if (Array.isArray(payload.tags)) {
      payload.tags = payload.tags.map(t => String(t).trim().toLowerCase()).filter(Boolean);
    }

    if (payload.status === 'published' && !payload.publishedAt) {
      payload.publishedAt = new Date();
    }

    const created = await Tutorial.create(payload);
    res.status(201).json(created);
  } catch (err) {
    logErr('Route error: POST /api/tutorials', err);
    // helpful duplicate key response
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key', keyValue: err.keyValue });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// debug: confirm indexes your API sees
r.get('/__indexes', async (_req, res) => {
  try {
    const idx = await Tutorial.collection.indexes();
    res.json(idx);
  } catch (err) {
    logErr('Route error: GET /api/tutorials/__indexes', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default r;
