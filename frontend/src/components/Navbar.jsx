import { useEffect, useState } from 'react';

export default function Navbar({ active, onSelect }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const tabs = [
    { key:'articles', label:'Articles' },
    { key:'posts',    label:'Posts' },
    { key:'reviews',  label:'Reviews' },
    { key:'tutorials',label:'Tutorials' },
    { key:'media',    label:'Media' },
  ];

  return (
    <header className="sticky top-0 z-10 border-b bg-white/70 backdrop-blur dark:bg-neutral-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="font-extrabold text-xl tracking-tight">
          <span className="text-indigo-600 dark:text-indigo-400">FireStar</span> Gaming
        </div>

        <nav className="hidden gap-2 md:flex">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onSelect(t.key)}
              className={`rounded-full px-3 py-1 text-sm ${
                active === t.key
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full border px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setDark(d => !d)}
            title="Toggle dark mode"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
}
