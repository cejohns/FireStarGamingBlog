// src/components/ErrorNote.jsx
export default function ErrorNote({ msg }) {
  if (!msg) return null;
  return (
    <div className="mb-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-950/30 dark:text-red-300">
      {msg}
    </div>
  );
}