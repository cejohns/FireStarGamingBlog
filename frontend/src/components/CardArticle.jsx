// src/components/CardArticle.jsx
export default function CardArticle({ a }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <a href={a.link} target="_blank" rel="noreferrer" className="text-lg font-semibold underline">
        {a.title}
      </a>
      <div className="mt-1 text-xs text-neutral-500">
        {a.source} • {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ''}
      </div>
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        {(a.summary || a.content || '').slice(0, 220)}{(a.summary || a.content) ? '…' : ''}
      </p>
    </article>
  );
}

// src/components/CardPost.jsx
export function CardPost({ p }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-lg font-semibold">{p.title}</div>
      <div className="mt-1 text-xs text-neutral-500">
        {p.status} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}
      </div>
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        {(p.body || '').slice(0, 240)}{p.body ? '…' : ''}
      </p>
    </article>
  );
}

// src/components/CardReview.jsx
export function CardReview({ r }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">{r.title}</div>
        <div className="rounded bg-black px-2 py-1 text-xs text-white dark:bg-white dark:text-black">
          {r.score ?? 'NR'}
        </div>
      </div>
      <div className="mt-1 text-xs text-neutral-500">
        {r.platform ?? 'Unknown'} • {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
      </div>
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        {(r.body || '').slice(0, 240)}{r.body ? '…' : ''}
      </p>
    </article>
  );
}

// src/components/CardTutorial.jsx
export function CardTutorial({ t }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-lg font-semibold">{t.title}</div>
      <div className="mt-1 text-xs text-neutral-500">
        {t.topic ?? 'General'} • {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
      </div>
      <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
        {(t.body || t.summary || '').slice(0, 240)}{(t.body || t.summary) ? '…' : ''}
      </p>
    </article>
  );
}
