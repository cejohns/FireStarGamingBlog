// backend/server/routes/techNews.routes.js
import { Router } from 'express';

const r = Router();

// in-memory stub so the UI can render immediately
const memory = [
  {
    _id: 'seed-tech-1',
    title: 'NVIDIA unveils new RTX features',
    link: 'https://example.com/nvidia-rtx-news',
    source: 'ExampleTech',
    summary: 'DLSS and path tracing improvements announced.',
    content: '',
    publishedAt: new Date().toISOString(),
    status: 'published',
  }
];

r.get('/', (req, res) => {
  const q = (req.query.q || '').toString().toLowerCase();
  const items = q
    ? memory.filter(a =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.summary || '').toLowerCase().includes(q)
      )
    : memory;
  res.json({ count: items.length, items });
});

export default r;
