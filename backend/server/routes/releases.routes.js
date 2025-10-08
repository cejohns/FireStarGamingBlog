// backend/server/routes/releases.routes.js
import { Router } from 'express';
import config from '../config/env.js';

const r = Router();

// GET /api/releases?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&page_size=20&platforms=18,1
r.get('/', async (req, res, next) => {
  try {
    const {
      from,
      to,
      page = 1,
      page_size = 20,
      platforms = '', // RAWG platform IDs e.g., PC 4, PS5 187, XSX 186, Switch 7
    } = req.query;

    const params = new URLSearchParams({
      key: config.rawgApiKey || process.env.RAWG_API_KEY || '',
      dates: `${from || new Date().toISOString().slice(0,10)},${to || new Date(Date.now()+1000*60*60*24*60).toISOString().slice(0,10)}`,
      ordering: '-released',
      page: String(page),
      page_size: String(page_size),
    });
    if (platforms) params.set('platforms', platforms);

    const url = `https://api.rawg.io/api/games?${params.toString()}`;
    const out = await fetch(url).then(r => r.json());
    // normalize
    const items = (out.results || []).map(g => ({
      id: g.id,
      name: g.name,
      released: g.released,
      background_image: g.background_image,
      rating: g.rating,
      platforms: (g.platforms || []).map(p => p.platform?.name),
      genres: (g.genres || []).map(g => g.name),
      slug: g.slug
    }));
    res.json({ count: out.count || items.length, items });
  } catch (e) { next(e); }
});

export default r;
