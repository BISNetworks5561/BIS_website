import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { bundles } from "@/lib/content";

export default function Bundles() {
  return (
    <Section id="bundles" eyebrow={bundles.subtitle} title={bundles.title}>
      <ul className="grid gap-5 md:grid-cols-3">
        {bundles.items.map((b) => (
          <li key={b.name} className="rounded-3xl border border-line p-6 shadow-card md:p-8">
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
                <Icon name={b.icon as IconName} className="h-6 w-6" />
              </span>
              <span className="rounded-full border border-brand/30 px-3 py-1 text-xs font-bold text-brand">{b.tag}</span>
            </div>
            <h3 className="mt-5 text-xl font-black">{b.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
            <a href="#consult" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand hover:underline">
              결합 견적 문의 <Icon name="arrow" className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
