import Section from "@/components/ui/Section";
import Icon from "@/components/ui/Icon";
import ConsultForm from "@/components/ConsultForm";
import { consult } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";

export default function Consult() {
  return (
    <Section id="consult" eyebrow={consult.subtitle} title={consult.title} desc={consult.desc}>
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-3xl bg-ink p-6 text-white md:p-8">
          <p className="text-sm font-bold text-brand-light">전화가 더 빠릅니다</p>
          <a href={telHref(siteConfig.contact.phone)} className="mt-2 block text-3xl font-black md:text-4xl">
            {siteConfig.contact.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-white/70">{siteConfig.contact.hours}</p>
          <ul className="mt-6 space-y-2 text-sm text-white/85">
            {["당일 맞춤 견적 제안", "가입비·설치비 0원", "설치 후 장애·이전·변경 전담 관리"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </ul>
          {siteConfig.contact.kakaoUrl && (
            <a
              href={siteConfig.contact.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[#FEE500] px-5 text-sm font-bold text-[#191919]"
            >
              카카오톡 상담
            </a>
          )}
          <p className="mt-6 text-xs text-white/50">장애 접수: {siteConfig.contact.faultPhone} (LG U+ 기업 장애센터)</p>
        </aside>

        <div className="rounded-3xl border border-line p-6 shadow-card md:p-8">
          <ConsultForm />
        </div>
      </div>
    </Section>
  );
}
