// components/Hero.jsx
import Button from "./Button";

export default function Hero({ feature }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
      <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full blur-2xl opacity-30"
           style={{ background: "radial-gradient(30% 30% at 50% 50%, #ec4899, transparent)" }}/>
      <div className="p-8 md:p-12">
        <h1 className="h-display text-3xl md:text-5xl font-extrabold leading-tight">
          Level up your <span className="text-[var(--brand-pink)]">gaming news</span> and reviews.
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300 max-w-2xl">
          Daily curated articles, honest reviews, hands-on tutorials, and a growing media library—built for players.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => location.assign('/articles')}>Browse Articles</Button>
          <Button variant="ghost" onClick={() => location.assign('/reviews')}>Latest Reviews</Button>
        </div>

        {feature && (
          <a href={feature.link || "#"} target={feature.link ? "_blank" : "_self"} rel="noreferrer"
             className="block mt-8 card overflow-hidden hover:shadow-lg transition-shadow">
            {feature.image && <img src={feature.image} alt="" className="w-full h-56 object-cover" />}
            <div className="p-4">
              <div className="text-xs text-neutral-500">Featured</div>
              <div className="h-display text-xl font-semibold mt-1">{feature.title}</div>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
