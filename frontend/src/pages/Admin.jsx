// ...at top:
import { api } from '../lib/api';
import { useEffect, useState } from 'react';

function AdminSources() {
  const [sources, setSources] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl]   = useState('');
  const [msg, setMsg]   = useState('');

  const load = () => api('/sources', { auth:true }).then(setSources).catch(e=>setMsg(e.message));

  useEffect(()=>{ load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setMsg('');
    await api('/sources', { method:'POST', auth:true, body:{ name, url }});
    setName(''); setUrl('');
    setMsg('Source added.');
    load();
  };

  const toggle = async (id, active) => {
    setMsg('');
    await api(`/sources/${id}`, { method:'PATCH', auth:true, body:{ active: !active }});
    load();
  };

  const ingest = async () => {
    setMsg('Running ingest...');
    const res = await api('/sources/ingest', { method:'POST', auth:true });
    setMsg(`Ingest complete: ${res.results.map(r => `${r.source} +${r.inserted||0}/${r.skipped||0}${r.error?` ERR:${r.error}`:''}`).join(' | ')}`);
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-xl shadow grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Sources</h2>
        <button onClick={ingest} className="rounded bg-black text-white px-3 py-1">Run Ingest</button>
      </div>
      <form onSubmit={add} className="grid gap-2 sm:grid-cols-3">
        <input className="border rounded p-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded p-2 sm:col-span-2" placeholder="Feed URL (RSS/Atom)" value={url} onChange={e=>setUrl(e.target.value)} />
        <button className="rounded bg-black text-white px-4 py-2 w-fit">Add</button>
      </form>
      {msg && <div className="text-sm text-gray-600">{msg}</div>}
      <div className="grid gap-2">
        {sources.map(s => (
          <div key={s._id} className="flex items-center justify-between border rounded p-2">
            <div>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-gray-600">{s.url}</div>
            </div>
            <button onClick={()=>toggle(s._id, s.active)} className="rounded border px-3 py-1">
              {s.active ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// In your existing Admin component, render <AdminSources /> somewhere:
export default function Admin() {
  // ...keep your login + create post UI
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* ...login section... */}
      {/* ...create post form... */}
      <AdminSources />
    </div>
  );
}
