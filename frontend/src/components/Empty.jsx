// src/components/Empty.jsx
export default function Empty({ children = 'Nothing to show yet.' }) {
  return <div className="text-neutral-500">{children}</div>;
}