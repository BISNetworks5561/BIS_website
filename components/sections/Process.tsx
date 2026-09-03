import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import { process } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";

export default function Process() {
  return (
    <Section id="process" tone="surface" eyebrow={process.subtitle} title={process.title} desc={process.leadTime}>
      <ol className="grid gap-5 md:grid-cols-4">
        {process.steps.map((s, i) => (
          <li key={s.title} className="relative rounded-3xl bg-white p-6 shadow-card">
            <span className="text-4xl font-black text-brand">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-lg font-black">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            {i < process.steps.length - 1 && (
              <Icon
                name="arrow"
                className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-brand md:block"
              />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-3xl bg-brand p-6 text-white md:flex-row md:gap-6 md:p-8">
        <p className="text-center text-lg font-black md:text-xl">지금 전화하시면 당일 견적을 받아보실 수 있습니다.</p>
        <a
          href={telHref(siteConfig.contact.phone)}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-lg font-black text-brand"
        >
          <Icon name="phone" className="h-5 w-5" /> {siteConfig.contact.phoneDisplay}
        </a>
      </div>
    </Section>
  );
}
