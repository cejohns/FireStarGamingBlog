import Parser from 'rss-parser';
import cron from 'node-cron';
import { fetch as undiciFetch } from 'undici';
let ArticleModel = null;

try {
  const m = await import('../models/Article.js');
  ArticleModel = m.default;
} catch { /* fallback memory only */ }

import sources from '../config/sources.js';

const parser = new Parser({
  // use undici for fetch under the hood (Node 18+)
  requestOptions: { fetch: undiciFetch }
});

// simple in-memory cache for the last fetch
let cache = [];
export const getCachedNews = () => cache;

export async function ingestOnce() {
  const collected = [];
  for (const src of sources) {
    try {
      const feed = await parser.parseURL(src.url);
      for (const item of feed.items.slice(0, 20)) {
        collected.push({
          title: item.title ?? 'Untitled',
          link: item.link ?? '',
          source: src.name,
          summary: item.contentSnippet || item.summary || '',
          content: item.content || '',
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
          status: 'published',
          tags: [],
        });
      }
    } catch (e) {
      console.error('RSS error for', src.id, e.message);
    }
  }

  // update cache
  cache = collected;

  // persist (optional)
  if (ArticleModel) {
    for (const a of collected) {
      try {
        // upsert by link to avoid dupes
        await ArticleModel.updateOne(
          { link: a.link },
          { $setOnInsert: a },
          { upsert: true }
        );
      } catch (e) {
        console.error('Upsert err:', e.message);
      }
    }
  }
  return collected.length;
}

export function startNewsCron() {
  // every 30 minutes (adjust CRON via env if you like)
  const expr = process.env.NEWS_CRON || '*/30 * * * *';
  cron.schedule(expr, async () => {
    console.log('📰 Ingest cron tick…');
    const n = await ingestOnce();
    console.log(`📰 Ingested ${n} items`);
  });

  // prime cache on boot
  ingestOnce().then(n => console.log(`📰 Boot ingest: ${n} items`));
}
