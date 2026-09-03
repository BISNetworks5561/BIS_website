import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { benefits } from "@/lib/content";

export default function Benefits() {
  return (
    <Section id="benefits" eyebrow={benefits.subtitle} title={benefits.title}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.items.map((b) => (
          <li key={b.title} className="rounded-3xl bg-ink p-6 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand">
              <Icon name={b.icon as IconName} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-black">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{b.desc}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-center text-xs text-muted md:text-sm">{benefits.note}</p>
    </Section>
  );
}
