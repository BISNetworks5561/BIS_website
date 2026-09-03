import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { hero } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand-light blur-3xl md:h-[640px] md:w-[640px]"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:py-28">
        <div className="animate-fade-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-light px-3 py-1 text-xs font-bold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {hero.eyebrow}
          </p>
          <h1 className="text-3xl font-black leading-[1.2] tracking-tight md:text-5xl md:leading-[1.15]">
            {hero.title[0]}
            <br />
            <span className="text-brand">{hero.title[1]}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{hero.subtitle}</p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {hero.bullets.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon name="check" className="h-4 w-4 text-brand" strokeWidth={2.5} />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#consult" size="lg">
              {hero.primaryCta}
              <Icon name="arrow" className="h-5 w-5" />
            </Button>
            <a
              href={telHref(siteConfig.contact.phone)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-ink px-8 text-base font-bold hover:bg-ink hover:text-white"
            >
              <Icon name="phone" className="h-5 w-5" />
              {hero.secondaryCta} {siteConfig.contact.phoneDisplay}
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">{hero.note}</p>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-card md:p-8">
            <p className="text-sm font-bold text-brand">LG U+ 오피스넷</p>
            <p className="mt-1 text-2xl font-black">기업 전용 광케이블 인터넷</p>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                { k: "최대 속도", v: "10Gbps" },
                { k: "PC 연결", v: "무제한" },
                { k: "고정IP", v: `최대 ${siteConfig.pricing.maxStaticIp}개` },
                { k: "장애센터", v: "24시간" },
              ].map((d) => (
                <div key={d.k} className="rounded-2xl bg-surface p-4">
                  <dt className="text-xs font-medium text-muted">{d.k}</dt>
                  <dd className="mt-1 text-xl font-black">{d.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink p-4 text-white">
              <div>
                <p className="text-xs opacity-80">월 요금</p>
                <p className="text-2xl font-black">
                  {siteConfig.pricing.standalone[0].dynamic.toLocaleString("ko-KR")}원
                  <span className="text-sm font-medium opacity-80">부터</span>
                </p>
              </div>
              <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold">가입비·설치비 0원</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
