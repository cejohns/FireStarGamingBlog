import { useCallback, useEffect, useMemo, useState } from "react";

/* ----------------------------- small utilities ---------------------------- */

function cls(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Time({ value }) {
  if (!value) return null;
  const d = new Date(value);
  return (
    <time dateTime={d.toISOString()} className="text-xs text-neutral-400">
      {d.toLocaleString()}
    </time>
  );
}

function Pill({ children }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-neutral-300">
      {children}
    </span>
  );
}

function Card({ className, children }) {
  return (
    <article
      className={cls(
        "rounded-xl border border-white/10 bg-neutral-900/60 p-4 hover:border-pink-500/40 transition",
        className
      )}
    >
      {children}
    </article>
  );
}

function Grid({ children }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  );
}

function Section({ id, title, action, children }) {
  return (
    <section id={id} className="py-8">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

/** Fetch JSON safely; returns {data, err, loading}.
 *  If response isn't JSON or 404s, it won't explode the UI.
 */
function useApi(url) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setErr({ status: res.status, text });
        setData(null);
      } else {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          setData(await res.json());
        } else {
          setData(null);
        }
      }
    } catch (e) {
      setErr({ message: e?.message || "Network error" });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]); // ✅ only depends on url

  useEffect(() => {
    load();
  }, [load]);

  return { data, err, loading, reload: load };
}

/* ----------------------------- page components ---------------------------- */

function Hero({ onSearch, q, setQ }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black p-6 mb-8">
      <div className="flex items-center gap-3 mb-3">
        <img src="/favicon.svg" alt="FireStar" className="w-8 h-8" />
        <h1 className="text-2xl font-extrabold tracking-tight">
          FireStar Gaming
        </h1>
      </div>
      <p className="text-neutral-300 mb-4">
        Daily gaming coverage, tech news, reviews, tutorials & product picks.
      </p>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 ring-pink-500"
          placeholder="Search gaming & tech…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="rounded-xl bg-pink-600/90 hover:bg-pink-600 text-white text-sm px-4"
          onClick={() => onSearch(q)}
        >
          Search
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- sections (API) ----------------------------- */

// Gaming news (exists as /api/gaming-news -> { count, items: [] })
function GamingNews({ query }) {
  const url = useMemo(
    () => `/api/gaming-news${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    [query]
  );
  const { data, err, loading } = useApi(url);
  const items = data?.items ?? [];

  return (
    <Section
      id="news"
      title="Latest Gaming News"
      action={
        <a
          href="/api/gaming-news"
          className="text-sm text-pink-400 hover:underline"
        >
          API →
        </a>
      }
    >
      {loading && <div className="text-neutral-400">Loading news…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load gaming news ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No news yet.</div>
      )}

      <Grid>
        {items.slice(0, 9).map((n) => (
          <Card key={`${n._id || n.link}`}>
            <a
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:underline"
            >
              {n.title}
            </a>
            <div className="mt-2 flex items-center gap-2">
              {n.source && <Pill>{n.source}</Pill>}
              <Time value={n.publishedAt} />
            </div>
            {n.summary && (
              <p className="mt-3 text-sm text-neutral-300 line-clamp-3">
                {n.summary}
              </p>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

// Tech news (new: /api/tech-news -> { count, items: [] })
function TechNews({ query }) {
  const url = useMemo(
    () => `/api/tech-news${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    [query]
  );
  const { data, err, loading } = useApi(url);
  const items = data?.items ?? [];

  return (
    <Section
      id="tech"
      title="New Technology News"
      action={
        <a
          href="/api/tech-news"
          className="text-sm text-pink-400 hover:underline"
        >
          API →
        </a>
      }
    >
      {loading && <div className="text-neutral-400">Loading technology…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load tech news ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No tech stories yet.</div>
      )}

      <Grid>
        {items.slice(0, 9).map((n) => (
          <Card key={`${n._id || n.link}`}>
            <a
              href={n.link}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:underline"
            >
              {n.title}
            </a>
            <div className="mt-2 flex items-center gap-2">
              {n.source && <Pill>{n.source}</Pill>}
              <Time value={n.publishedAt} />
            </div>
            {n.summary && (
              <p className="mt-3 text-sm text-neutral-300 line-clamp-3">
                {n.summary}
              </p>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

// Gaming products (new: /api/products -> array)
function Products() {
  const { data, err, loading } = useApi("/api/products");
  const items = Array.isArray(data) ? data : [];

  return (
    <Section id="products" title="Gaming Products">
      {loading && <div className="text-neutral-400">Loading products…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load products ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No products yet.</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 9).map((p) => (
          <article
            key={p._id}
            className="rounded-xl border border-white/10 bg-neutral-900/60 overflow-hidden hover:border-pink-500/40 transition"
          >
            {p.image ? (
              <a href={p.link} target="_blank" rel="noreferrer" className="block">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
              </a>
            ) : (
              <div className="w-full aspect-video bg-neutral-800" />
            )}
            <div className="p-4">
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="font-semibold hover:underline"
              >
                {p.title}
              </a>
              <div className="mt-1 text-sm text-neutral-300">
                {p.brand && <span>{p.brand} · </span>}
                {p.category}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-pink-400 font-semibold">
                  {p.price ? `${p.currency || "USD"} ${p.price}` : ""}
                </div>
                <div className="flex gap-1">
                  {(p.tags || []).slice(0, 3).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// Reviews (/api/reviews -> array)
function Reviews() {
  const { data, err, loading } = useApi("/api/reviews");
  const items = Array.isArray(data) ? data : [];

  return (
    <Section id="reviews" title="Reviews">
      {loading && <div className="text-neutral-400">Loading reviews…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load reviews ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No reviews yet.</div>
      )}

      <Grid>
        {items.slice(0, 6).map((r) => (
          <Card key={r._id}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold line-clamp-2">{r.title}</h3>
              {typeof r.rating === "number" && (
                <div className="px-2 py-0.5 rounded bg-pink-600/20 text-pink-300 text-xs">
                  {r.rating.toFixed(1)}/10
                </div>
              )}
            </div>
            <Time value={r.publishedAt || r.createdAt} />
            {r.summary && (
              <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
                {r.summary}
              </p>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

// Tutorials (/api/tutorials -> array)
function Tutorials() {
  const { data, err, loading } = useApi("/api/tutorials");
  const items = Array.isArray(data) ? data : [];

  return (
    <Section id="tutorials" title="Tutorials & Guides">
      {loading && <div className="text-neutral-400">Loading tutorials…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load tutorials ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No tutorials yet.</div>
      )}

      <Grid>
        {items.slice(0, 6).map((t) => (
          <Card key={t._id}>
            <h3 className="font-semibold">{t.title}</h3>
            <Time value={t.publishedAt || t.createdAt} />
            {t.summary && (
              <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
                {t.summary}
              </p>
            )}
            {t.link && (
              <a
                href={t.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-pink-400 hover:underline"
              >
                Read more →
              </a>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

// Articles (/api/articles -> array OR [])
function Articles() {
  const { data, err, loading } = useApi("/api/articles");
  const items = Array.isArray(data) ? data : data ?? [];

  return (
    <Section id="articles" title="Editorial Articles">
      {loading && <div className="text-neutral-400">Loading articles…</div>}
      {err && (
        <div className="text-red-400 text-sm">
          Failed to load articles ({err.status || err.message}).
        </div>
      )}
      {!loading && !err && items.length === 0 && (
        <div className="text-neutral-400">No articles yet.</div>
      )}

      <Grid>
        {items.slice(0, 6).map((a) => (
          <Card key={a._id}>
            <h3 className="font-semibold">{a.title || "Untitled"}</h3>
            <Time value={a.publishedAt || a.createdAt} />
            {(a.summary || a.body) && (
              <p className="mt-2 text-sm text-neutral-300 line-clamp-3">
                {(a.summary || a.body || "").toString()}
              </p>
            )}
            {a.link && (
              <a
                href={a.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-pink-400 hover:underline"
              >
                Open →
              </a>
            )}
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

/* ------------------------------- page shell ------------------------------- */

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <div className="mx-auto max-w-7xl px-5 py-8">{children}</div>
      <footer className="border-t border-white/10 mt-12">
        <div className="mx-auto max-w-7xl px-5 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} FireStar Gaming
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------- main ---------------------------------- */

export default function App() {
  const [q, setQ] = useState("");
  const [appliedQ, setAppliedQ] = useState("");

  const onSearch = useCallback((val) => {
    setAppliedQ(val.trim());
  }, []);

  return (
    <Shell>
      <Hero onSearch={onSearch} q={q} setQ={setQ} />
      <GamingNews query={appliedQ} />
      <TechNews query={appliedQ} />
      <Products />
      <Reviews />
      <Tutorials />
      <Articles />
    </Shell>
  );
}
