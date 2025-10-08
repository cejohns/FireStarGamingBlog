// backend/server/routes/reviews.routes.js
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';

let usingMongo = false;
let Review = null;

try {
  const m = await import('../models/Review.js'); // optional Mongoose model
  Review = m.default;
  usingMongo = !!Review;
} catch {}

const memory = []; // fallback
const r = Router();

/** GET /api/reviews?q=&game=&ratingMin=&ratingMax=&page=&pageSize= */
r.get('/', async (req, res, next) => {
  try {
    const { q = '', game = '', ratingMin = 0, ratingMax = 10, page = 1, pageSize = 20 } = req.query;
    if (usingMongo) {
      const where = {
        ...(q ? { title: { $regex: q, $options: 'i' } } : {}),
        ...(game ? { game: { $regex: game, $options: 'i' } } : {}),
        rating: { $gte: Number(ratingMin), $lte: Number(ratingMax) },
        status: 'published',
      };
      const items = await Review.find(where)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(Number(pageSize));
      return res.json(items);
    }
    const items = memory
      .filter(x =>
        (q ? x.title?.toLowerCase().includes(String(q).toLowerCase()) : true) &&
        (game ? x.game?.toLowerCase().includes(String(game).toLowerCase()) : true) &&
        (x.rating ?? 0) >= Number(ratingMin) &&
        (x.rating ?? 10) <= Number(ratingMax) &&
        (x.status ?? 'published') === 'published'
      )
      .slice((page - 1) * pageSize, (page - 1) * pageSize + Number(pageSize));
    res.json(items);
  } catch (e) { next(e); }
});

/** POST /api/reviews  (admin) */
r.post('/', requireAuth(['admin']), async (req, res, next) => {
  try {
    const body = req.body;
    if (usingMongo) {
      const doc = await Review.create(body);
      return res.status(201).json(doc);
    }
    const doc = { ...body, _id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
    memory.unshift(doc);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

export default r;
