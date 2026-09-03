import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { reviews } from "@/lib/content";

export default function Reviews() {
  return (
    <Section id="reviews" tone="surface" eyebrow={reviews.subtitle} title={reviews.title}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {reviews.items.map((r) => (
          <li key={r.name} className="flex flex-col rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center gap-1 text-brand" aria-label={`별점 ${r.rating}점`}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Icon key={i} name="star" className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <p className="text-xs font-bold">{r.name}</p>
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted">
                {r.industry}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
