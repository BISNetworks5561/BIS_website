import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { features } from "@/lib/content";

export default function Features() {
  return (
    <Section id="features" eyebrow={features.subtitle} title={features.title}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.items.map((f) => (
          <li key={f.title} className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light text-brand">
              <Icon name={f.icon as IconName} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-black">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
