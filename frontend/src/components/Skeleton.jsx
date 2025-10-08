// components/Skeleton.jsx
export default function Skeleton({ className="" }) {
  return <div className={`animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70 ${className}`} />;
}
