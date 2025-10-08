import { useEffect, useState, useCallback } from "react";
import ArticleCard from "../components/ArticleCard";
import Hero from "../components/Hero";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/gaming-news");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) { setErr(e.message || "Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const feature = items[0];

  return (
    <section className="space-y-8">
      <Hero feature={feature} />

      <div className="flex items-center justify-between">
        <h2 className="h-display text-2xl font-bold">Latest</h2>
        <a href="/articles" className="text-sm text-[var(--brand-pink)] hover:underline">View all</a>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-48 rounded-2xl"/>)}
        </div>
      )}

      {err && <div className="text-sm text-rose-600">{err}</div>}

      {!loading && !err && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 9).map((it, i) => <ArticleCard key={it._id || it.link || i} item={it} />)}
        </div>
      )}
    </section>
  );
}
