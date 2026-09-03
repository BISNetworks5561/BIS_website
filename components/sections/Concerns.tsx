import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { concerns } from "@/lib/content";

export default function Concerns() {
  return (
    <Section id="concerns" tone="surface" eyebrow={concerns.subtitle} title={concerns.title}>
      <ul className="grid gap-5 md:grid-cols-2">
        {concerns.items.map((c, i) => (
          <li key={c.q} className="flex gap-4 rounded-3xl bg-white p-6 shadow-card">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-black text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-base font-black">
                <span className="text-brand">Q.</span> &ldquo;{c.q}&rdquo;
              </p>
              <p className="mt-3 flex gap-2 text-sm leading-relaxed text-muted">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                {c.a}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
