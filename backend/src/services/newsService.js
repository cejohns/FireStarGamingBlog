import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import crypto from "crypto";
const RSS = [
  "https://www.gamespot.com/feeds/game-news/",
  "https://www.polygon.com/rss/index.xml",
  "https://kotaku.com/rss",
  "https://feeds.ign.com/ign/all"
];
const toISO = d => (d ? new Date(d).toISOString() : null);
const sha1 = s => crypto.createHash("sha1").update(String(s)).digest("hex");

async function fetchRss(url){
  const xml = await fetch(url, { timeout: 15000 }).then(r=>r.text());
  const parsed = await parseStringPromise(xml, { explicitArray:false });
  const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
  const arr = Array.isArray(items)? items : [items];
  return arr.map(i=>{
    const title = i.title?._ || i.title || "";
    const link  = i.link?.href || i.link || i.guid || "";
    const pub   = i.pubDate || i.published || i.updated;
    const media = i["media:content"]?.$.url || i.enclosure?.$.url || null;
    const desc  = i.description || i.summary || "";
    return {
      id: sha1(link||title),
      source: link ? new URL(link).hostname.replace(/^www\./,"") : "unknown",
      title: String(title).trim(),
      url: String(link),
      publishedAt: toISO(pub),
      image: media,
      summary: String(desc).replace(/<[^>]+>/g,"").slice(0,280),
      videoUrl: null,
      outlet: "rss"
    };
  });
}
export async function getGamingNews(){
  const sets = await Promise.allSettled(RSS.map(fetchRss));
  const merged = sets.flatMap(s => s.status==="fulfilled" ? s.value : []);
  const byUrl = new Map();
  for(const it of merged){ if(it.url && !byUrl.has(it.url)) byUrl.set(it.url,it); }
  return [...byUrl.values()].sort((a,b)=> new Date(b.publishedAt||0)-new Date(a.publishedAt||0));
}
