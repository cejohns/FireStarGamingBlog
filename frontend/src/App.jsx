import { useEffect, useState } from 'react'

export default function App() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    // Vite proxy sends /api to http://localhost:5000
    fetch('/api/posts')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('Failed to load posts'))))
      .then(setItems)
      .catch(e => setError(e.message))
  }, [])

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">FireStar Gaming</h1>
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded mb-4">{error}</div>
      )}
      {items.length === 0 ? (
        <div className="text-gray-500">No posts yet.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <article key={p._id || p.slug} className="p-4 rounded-xl shadow bg-white">
              <h2 className="text-xl font-bold">{p.title}</h2>
              <p className="text-sm text-gray-600">{p.slug}</p>
              <div className="prose prose-sm max-w-none mt-2">
                {(p.body || '').slice(0, 160)}...
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
