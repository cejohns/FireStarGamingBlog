export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        className="flex-1 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-neutral-900 dark:border-neutral-700"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        onClick={onSubmit}
      >
        Search
      </button>
    </div>
  );
}
