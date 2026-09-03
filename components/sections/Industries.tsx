import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { industries } from "@/lib/content";

export default function Industries() {
  return (
    <Section id="industries" eyebrow={industries.subtitle} title={industries.title}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {industries.items.map((it) => (
          <li
            key={it.name}
            className="group rounded-3xl border border-line p-6 transition-colors hover:border-brand hover:bg-brand-light/40"
          >
            <Icon name={it.icon as IconName} className="h-8 w-8 text-ink group-hover:text-brand" />
            <h3 className="mt-4 text-lg font-black">{it.name}</h3>
            <p className="mt-1 text-sm text-muted">{it.desc}</p>
            <p className="mt-4 inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold text-white group-hover:bg-brand">
              추천 {it.rec}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
