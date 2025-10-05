import { useEffect, useState } from 'react';

export default function App() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  const load = async (query='') => {
    const res = await fetch(`/api/articles${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(()=>{ load(); }, []);

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">FireStar Gaming</h1>

      <div className="mb-4 flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Search articles..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="rounded bg-black text-white px-4" onClick={()=>load(q)}>Search</button>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">No articles yet.</div>
      ) : (
        <div className="grid gap-4">
          {items.map(a => (
            <article key={a._id} className="p-4 rounded-xl shadow bg-white">
              <a href={a.link} target="_blank" rel="noreferrer" className="text-xl font-bold underline">{a.title}</a>
              <div className="text-xs text-gray-600 mt-1">
                {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : '' }
              </div>
              <p className="mt-2 text-sm">{(a.summary || a.content || '').slice(0, 200)}...</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
