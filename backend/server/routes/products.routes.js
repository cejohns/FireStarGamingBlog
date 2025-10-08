// backend/server/routes/products.routes.js
import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

let usingMongo = false;
let Product = null;

try {
  const m = await import('../models/Product.js'); // optional
  Product = m.default;
  usingMongo = !!Product;
} catch {}

const memory = [];
const r = Router();

/** GET /api/products?q=&brand=&type=&min=&max= */
r.get('/', async (req, res, next) => {
  try {
    const { q = '', brand = '', type = '', min = 0, max = 999999 } = req.query;
    if (usingMongo) {
      const where = {
        ...(q ? { name: { $regex: q, $options: 'i' } } : {}),
        ...(brand ? { brand } : {}),
        ...(type ? { type } : {}),
        price: { $gte: Number(min), $lte: Number(max) },
        status: 'active',
      };
      const items = await Product.find(where).sort({ createdAt: -1 }).limit(100);
      return res.json(items);
    }
    const items = memory.filter(x =>
      (q ? x.name?.toLowerCase().includes(String(q).toLowerCase()) : true) &&
      (brand ? x.brand === brand : true) &&
      (type ? x.type === type : true) &&
      (x.price ?? 0) >= Number(min) &&
      (x.price ?? 0) <= Number(max) &&
      (x.status ?? 'active') === 'active'
    );
    res.json(items);
  } catch (e) { next(e); }
});

/** POST /api/products  (admin) */
r.post('/', requireAuth(['admin']), async (req, res, next) => {
  try {
    const body = req.body;
    if (usingMongo) {
      const doc = await Product.create(body);
      return res.status(201).json(doc);
    }
    const doc = { ...body, _id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date(), status: 'active' };
    memory.unshift(doc);
    res.status(201).json(doc);
  } catch (e) { next(e); }
});

export default r;
