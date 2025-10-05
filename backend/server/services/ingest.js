import Parser from 'rss-parser';
import Article from '../models/Article.js';
const parser = new Parser();

/** Ingest a single feed URL; returns {inserted, skipped} */
export async function ingestFeed(url, sourceId) {
  const feed = await parser.parseURL(url);
  let inserted = 0, skipped = 0;
  for (const item of feed.items || []) {
    const link = item.link || item.guid;
    if (!link) { skipped++; continue; }

    const update = {
      source: sourceId,
      title: item.title || '(no title)',
      link,
      summary: item.contentSnippet || item.summary || '',
      content: item['content:encoded'] || item.content || '',
      author: item.creator || item.author || '',
      publishedAt: item.isoDate ? new Date(item.isoDate) : (item.pubDate ? new Date(item.pubDate) : undefined),
    };

    const res = await Article.updateOne({ link }, { $setOnInsert: update }, { upsert: true });
    if (res.upsertedCount === 1) inserted++; else skipped++;
  }
  return { inserted, skipped };
}

/** Ingest all active sources */
export async function ingestAllActiveSources(SourceModel) {
  const sources = await SourceModel.find({ active: true });
  const results = [];
  for (const s of sources) {
    try {
      const r = await ingestFeed(s.url, s._id);
      results.push({ source: s.name, url: s.url, ...r });
    } catch (e) {
      results.push({ source: s.name, url: s.url, error: e.message });
    }
  }
  return results;
}
