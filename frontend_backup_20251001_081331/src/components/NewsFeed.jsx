import React, { useEffect, useState } from "react";

export default function NewsFeed({ query }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = new URL("/api/gaming-news-cached", window.location.origin);
    if (query) u.searchParams.set("q", query);
    fetch(u).then(r => r.json()).then(data => {
      setItems(data.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [query]);

  if (loading) return <div className="p-4">Loading gaming news…</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map(item => (
        <article key={item.id} className="rounded-2xl shadow p-4 bg-white dark:bg-neutral-900">
          <header className="flex items-center justify-between mb-2 text-sm opacity-80">
            <span className="font-semibold">FireStarGaming</span>
            <span className="italic">Source: {item.source}</span>
          </header>

          {item.image && (
            <a href={item.url} target="_blank" rel="noreferrer">
              <img src={item.image} alt="" className="w-full h-48 object-cover rounded-xl mb-3" />
            </a>
          )}

          <a href={item.url} target="_blank" rel="noreferrer"
             className="block text-lg font-bold hover:underline">
            {item.title}
          </a>

          {item.summary && <p className="mt-2 text-sm opacity-90">{item.summary}</p>}

          <footer className="mt-3 text-xs opacity-70">
            {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ""}
            {item.videoUrl && <span className="ml-2 px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">Video</span>}
          </footer>
        </article>
      ))}
    </div>
  );
}
