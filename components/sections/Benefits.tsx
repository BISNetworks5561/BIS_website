import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { benefits } from "@/lib/content";

export default function Benefits() {
  return (
    <Section id="benefits" eyebrow={benefits.subtitle} title={benefits.title}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.items.map((b) => (
          <li key={b.title} className="rounded-3xl bg-brand-gradient p-6 text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
              <Icon name={b.icon as IconName} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-black">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{b.desc}</p>
          </li>
        ))}
        <li className="flex flex-col justify-between rounded-3xl border-2 border-dashed border-brand/40 p-6">
          <div>
            <p className="text-sm font-bold text-brand">혜택은 상담 시 확정</p>
            <p className="mt-2 text-lg font-black">우리 사무실에 맞는 혜택, 전화 한 통으로 확인하세요</p>
          </div>
          <a
            href="#consult"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white"
          >
            혜택 상담받기
          </a>
        </li>
      </ul>
      <p className="mt-5 text-center text-xs text-muted md:text-sm">{benefits.note}</p>
    </Section>
  );
}
