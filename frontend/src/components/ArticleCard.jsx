// components/ArticleCard.jsx
import Tag from "./Tag";
import RatingStars from "./RatingStars";

export default function ArticleCard({ item }) {
  const href = item.link || `/articles/${item.slug || item._id}`;
  const date = item.publishedAt || item.createdAt;
  return (
    <article className="card group hover:shadow-md transition-shadow overflow-hidden">
      {item.image && (
        <a href={href} target={item.link ? "_blank" : "_self"} rel="noreferrer" className="block">
          <img src={item.image} alt="" className="w-full h-44 object-cover group-hover:opacity-95 transition"/>
        </a>
      )}
      <div className="p-4">
        <a href={href} target={item.link ? "_blank" : "_self"} rel="noreferrer">
          <h3 className="text-lg font-semibold h-display leading-snug group-hover:text-[var(--brand-pink)]">
            {item.title || "(Untitled)"}
          </h3>
        </a>
        <div className="mt-1 text-xs text-neutral-500">
          {date && new Date(date).toLocaleString()}
          {item.source ? ` • ${item.source}` : ""}
        </div>
        {(item.summary || item.excerpt || item.body) && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3">
            {(item.summary || item.excerpt || item.body).toString().replace(/<[^>]+>/g, "")}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {(item.tags || []).slice(0, 4).map(t => <Tag key={t}>#{t}</Tag>)}
        </div>
        {/* Optional rating field for reviews */}
        {typeof item.rating === "number" && (
          <div className="mt-3"><RatingStars value={item.rating} outOf={10}/></div>
        )}
      </div>
    </article>
  );
}
