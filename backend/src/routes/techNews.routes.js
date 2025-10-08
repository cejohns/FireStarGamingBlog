// @ts-nocheck
import { Router } from 'express';
import Parser from 'rss-parser';

const r = Router();
const parser = new Parser();

/** Default tech sources */
const DEFAULT_FEEDS = [
  // Add/remove as you like
  'https://www.theverge.com/rss/index.xml',
  'https://techcrunch.com/feed/',
  'https://arstechnica.com/feed/',
  'https://www.wired.com/feed/rss'
];

/**
 * GET /api/tech-news
 * Optional query:
 *   ?q=keyword (filters title/summary)
 *   ?sources=url1,url2 (comma-separated custom feed URLs)
 *   ?limit=50
 */
r.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().toLowerCase().trim();
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const sources = (req.query.sources
      ? req.query.sources.toString().split(',').map(s => s.trim()).filter(Boolean)
      : DEFAULT_FEEDS
    );

    const results = [];
    for (const feedUrl of sources) {
      try {
        const feed = await parser.parseURL(feedUrl);
        for (const item of feed.items || []) {
          results.push({
            title: item.title || '',
            link: item.link || '',
            source: feed.title || new URL(feedUrl).hostname,
            summary: item.contentSnippet || item.summary || '',
            content: item.content || '',
            publishedAt: item.isoDate || item.pubDate || null,
            status: 'published',
            tags: []
          });
        }
      } catch (err) {
        // Skip a broken feed but keep responding
        console.warn('tech feed failed:', feedUrl, err?.message);
      }
    }

    // Filter & sort
    let items = results;
    if (q) {
      items = items.filter(i =>
        (i.title || '').toLowerCase().includes(q) ||
        (i.summary || '').toLowerCase().includes(q) ||
        (i.content || '').toLowerCase().includes(q)
      );
    }
    items.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
    items = items.slice(0, limit);

    res.json({ count: items.length, items });
  } catch (e) { next(e); }
});

export default r;
