import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCallBar from "@/components/MobileCallBar";
import Icon from "@/components/ui/Icon";
import UplusBadge from "@/components/ui/UplusBadge";
import { productPages } from "@/lib/content";
import { siteConfig, telHref } from "@/site.config";

type Key = keyof typeof productPages;

/** 준비 중인 상품 페이지 공통 레이아웃 — 핵심 포인트 + 상담 유도 */
export default function ProductComingSoon({ product }: { product: Key }) {
  const p = productPages[product];
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
          <UplusBadge>LG U+ {p.title}</UplusBadge>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{p.headline}</h1>
          <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">{p.desc}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {p.points.map((t) => (
              <li key={t} className="flex items-start gap-2 rounded-2xl border border-line p-4 text-sm font-semibold">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-3xl bg-brand-gradient p-6 text-white md:p-8">
            <p className="text-sm font-bold text-white/80">상세 페이지 준비 중</p>
            <p className="mt-1 text-xl font-black md:text-2xl">
              {p.title} 요금과 혜택은 전화 한 통으로 바로 안내해 드립니다.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={telHref(siteConfig.contact.phone)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-black text-brand-dark"
              >
                <Icon name="phone" className="h-5 w-5" />
                {siteConfig.contact.phoneDisplay}
              </a>
              <Link
                href="/#consult"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-white/60 px-6 text-base font-bold text-white hover:bg-white/10"
              >
                온라인 상담 신청 <Icon name="arrow" className="h-5 w-5" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-white/70">{siteConfig.contact.hours}</p>
          </div>

          <p className="mt-8 text-sm text-muted">
            기업 전용 인터넷이 필요하시면{" "}
            <Link href="/" className="font-bold text-brand underline underline-offset-4">
              오피스넷 안내 페이지
            </Link>
            를 확인하세요.
          </p>
        </section>
      </main>
      <Footer />
      <MobileCallBar />
    </>
  );
}
