// components/RatingStars.jsx
export default function RatingStars({ value=0, outOf=10 }) {
  const pct = Math.max(0, Math.min(1, value / outOf)) * 100;
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <div className="relative h-4 w-24 overflow-hidden rounded">
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800"/>
        <div className="absolute inset-y-0 left-0 bg-[var(--brand-pink)]" style={{ width: `${pct}%` }}/>
      </div>
      <span className="tabular-nums">{value.toFixed(1)}/{outOf}</span>
    </div>
  );
}
