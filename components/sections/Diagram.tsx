import Image from "next/image";
import Section from "@/components/ui/Section";
import Icon, { type IconName } from "@/components/ui/Icon";
import { diagram } from "@/lib/content";

export default function Diagram() {
  return (
    <Section id="diagram" tone="surface" eyebrow={diagram.subtitle} title={diagram.title} desc={diagram.desc}>
      {/* U+오피스넷 공식 서비스 구성도 */}
      <figure className="rounded-3xl bg-white p-4 shadow-card md:p-8">
        <Image
          src={diagram.imageSrc}
          alt={diagram.imageAlt}
          width={1201}
          height={442}
          sizes="(min-width: 1024px) 900px, 100vw"
          className="h-auto w-full"
        />
        <figcaption className="mt-4 grid gap-2 text-center text-xs text-muted sm:grid-cols-2 md:text-sm">
          <span>
            <b className="font-bold text-brand-dark">U+오피스넷</b> · 전용망 기반 인터넷 → 초고속 광분배기 (100M~10G)
          </span>
          <span>
            <b className="font-bold text-brand-dark">고객 사무실</b> · 모뎀 → L2 스위치 → 고객사 PC (동시 사용 원활)
          </span>
        </figcaption>
      </figure>

      {/* 사무실 내부 단말 */}
      <div className="mt-6 rounded-3xl border border-dashed border-brand/40 bg-white/60 p-5 md:p-6">
        <p className="mb-4 text-center text-sm font-bold text-brand-dark">사무실 내부 연결 (PC 대수 무제한)</p>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {diagram.devices.map((d) => (
            <li key={d.name} className="flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon name={d.icon as IconName} className="h-5 w-5" />
              </span>
              <p className="mt-3 text-sm font-black">{d.name}</p>
              <p className="mt-0.5 text-xs text-muted">{d.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted">
        <Icon name="headset" className="h-4 w-4 text-brand" />
        {diagram.support}
      </p>
    </Section>
  );
}
