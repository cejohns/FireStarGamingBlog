// ESM version; for CJS see note below
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";

const GAMESPOT_RSS = "https://www.gamespot.com/feeds/game-news/";
const POLYGON_RSS  = "https://www.polygon.com/rss/index.xml";
const KOTAKU_RSS   = "https://kotaku.com/rss";
const IGN_RSS      = "https://feeds.ign.com/ign/all";

// --- helpers ---
const toISO = (d) => (d ? new Date(d).toISOString() : null);
const sha1  = (s) => crypto.createHash("sha1").update(s).digest("hex");

// RSS fetcher
async function fetchRss(url) {
  const xml = await fetch(url, { timeout: 15000 }).then(r => r.text());
  const parsed = await parseStringPromise(xml, { explicitArray: false });
  const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  const arr = Array.isArray(items) ? items : [items];

  return arr.map(i => {
    const title = i.title?._ || i.title || "";
    const link  = i.link?.href || i.link || i.guid || "";
    const pub   = i.pubDate || i.published || i.updated;
    const media = i["media:content"]?.$.url || i.enclosure?.$.url || null;
    const desc  = i.description || i.summary || "";
    return {
      id: sha1(String(link || title)),
      source: new URL(String(link || "https://example.com")).hostname.replace("www.",""),
      title: String(title).trim(),
      url: String(link),
      publishedAt: toISO(pub),
      image: media,
      summary: String(desc).replace(/<[^>]+>/g, "").slice(0, 280),
      videoUrl: null,
      outlet: "rss"
    };
  });
}

// Steam per-app news (optional query: ?appid=570)
async function steamNews(appid, count = 5) {
  if (!appid) return [];
  const u = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appid}&count=${count}&maxlength=0&format=json`;
  const json = await fetch(u, { timeout: 15000 }).then(r => r.json());
  return (json?.appnews?.newsitems || []).map(n => ({
    id: sha1(n.url),
    source: "store.steampowered.com",
    title: n.title,
    url: n.url,
    publishedAt: toISO(n.date * 1000),
    image: null,
    summary: "",
    videoUrl: null,
    outlet: "steam"
  }));
}

// NewsAPI (broad search)
async function newsApi(q, sourcesCsv) {
  const key = process.env.NEWSAPI_KEY;
  if (!key) return [];
  const base = new URL("https://newsapi.org/v2/everything");
  base.searchParams.set("q", q || "gaming");
  base.searchParams.set("language", "en");
  base.searchParams.set("pageSize", "50");
  base.searchParams.set("sortBy", "publishedAt");
  if (sourcesCsv) base.searchParams.set("sources", sourcesCsv);

  const json = await fetch(base.toString(), {
    headers: { "X-Api-Key": key }, timeout: 15000
  }).then(r => r.json());

  return (json?.articles || []).map(a => ({
    id: sha1(a.url),
    source: new URL(a.url).hostname.replace("www.",""),
    title: a.title,
    url: a.url,
    publishedAt: toISO(a.publishedAt),
    image: a.urlToImage || null,
    summary: a.description || "",
    videoUrl: null,
    outlet: "newsapi"
  }));
}

// Giant Bomb (articles + videos)
async function giantBomb(q = "gaming") {
  const key = process.env.GIANTBOMB_KEY;
  if (!key) return [];
  const base = new URL("https://www.giantbomb.com/api/search/");
  base.searchParams.set("api_key", key);
  base.searchParams.set("format", "json");
  base.searchParams.set("query", q);
  base.searchParams.set("resources", "article,video");
  const json = await fetch(base.toString(), { timeout: 15000 }).then(r => r.json());

  return (json?.results || []).map(r => ({
    id: sha1(r.site_detail_url || r.api_detail_url || r.guid || JSON.stringify(r)),
    source: "giantbomb.com",
    title: r.name || r.title,
    url: r.site_detail_url,
    publishedAt: toISO(r.publish_date || r.date_added || r.date_last_updated),
    image: r.image?.super_url || r.image?.medium_url || null,
    summary: r.deck || "",
    videoUrl: r.api_detail_url?.includes("/video/") ? r.site_detail_url : null,
    outlet: "giantbomb"
  }));
}

// Merge + dedupe + sort
function normalizeAndSort(list) {
  const byUrl = new Map();
  for (const it of list) {
    if (!it?.url || !it?.title) continue;
    if (!byUrl.has(it.url)) byUrl.set(it.url, it);
  }
  return [...byUrl.values()].sort((a, b) =>
    new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  );
}

export async function getGamingNews({ q, appid } = {}) {
  const sources = [
    fetchRss(GAMESPOT_RSS),
    fetchRss(POLYGON_RSS),
    fetchRss(KOTAKU_RSS),
    fetchRss(IGN_RSS),
    newsApi(process.env.NEWS_KEYWORDS || q, process.env.NEWS_SOURCES),
    giantBomb(process.env.NEWS_KEYWORDS || q),
    steamNews(appid)
  ];

  const settled = await Promise.allSettled(sources);
  const merged = settled.flatMap(s => (s.status === "fulfilled" ? s.value : []));
  return normalizeAndSort(merged);
}
