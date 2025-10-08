export default function SectionTabs({ active, onSelect }) {
  const tabs = [
    { key:'articles', label:'Articles' },
    { key:'posts',    label:'Posts' },
    { key:'reviews',  label:'Reviews' },
    { key:'tutorials',label:'Tutorials' },
    { key:'media',    label:'Media' },
  ];
  return (
    <div className="mx-auto mb-4 mt-3 grid max-w-6xl grid-cols-3 gap-2 px-4 md:hidden">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`rounded-lg px-3 py-2 text-sm ${
            active === t.key
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'border hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
