// src/components/MediaGallery.jsx
export default function MediaGallery({ files = [] }) {
  if (files.length === 0) {
    return <div className="text-neutral-500">No media yet.</div>;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {files.map((f) => {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(f);
        const url = `/api/uploads/files/${encodeURIComponent(f)}`;
        return (
          <div key={f} className="overflow-hidden rounded-xl border dark:border-neutral-800">
            {isVideo ? (
              <video src={url} controls className="h-56 w-full object-cover" />
            ) : (
              <img src={url} alt={f} className="h-56 w-full object-cover" />
            )}
            <div className="truncate px-3 py-2 text-xs">{f}</div>
          </div>
        );
      })}
    </div>
  );
}
