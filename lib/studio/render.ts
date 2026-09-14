import type { BlogPost } from "@/lib/studio/schema";
import { activeLinks, COUPANG_DISCLOSURE, DEFAULT_AFFILIATE, type AffiliateOptions } from "@/lib/studio/affiliate";
import { siteConfig } from "@/site.config";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 네이버 스마트에디터에 붙여넣기 위한 HTML (인라인 스타일 최소화) */
export function postToHtml(p: BlogPost, affiliate: AffiliateOptions = DEFAULT_AFFILIATE): string {
  const links = activeLinks(affiliate);
  const block = links.length ? affiliateHtml(affiliate, links) : "";
  const out: string[] = [];
  out.push(`<p>${esc(p.intro)}</p>`);
  p.sections.forEach((s, i) => {
    out.push(`<h3><strong>${esc(s.heading)}</strong></h3>`);
    for (const para of s.paragraphs) out.push(`<p>${esc(para)}</p>`);
    if (s.bullets.length) {
      out.push(`<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`);
    }
    if (block && affiliate.position === "afterFirst" && i === 0) out.push(block);
  });
  if (block && affiliate.position === "beforeFaq") out.push(block);
  if (p.faq.length) {
    out.push(`<h3><strong>자주 묻는 질문</strong></h3>`);
    for (const f of p.faq) {
      out.push(`<p><strong>Q. ${esc(f.q)}</strong></p><p>A. ${esc(f.a)}</p>`);
    }
  }
  if (block && affiliate.position === "end") out.push(block);
  out.push(`<p>${esc(p.closing)}</p>`);
  out.push(ctaHtml());
  out.push(`<p>${p.hashtags.map((h) => "#" + esc(h.replace(/^#/, ""))).join(" ")}</p>`);
  return out.join("\n");
}

/** 텍스트만 복사할 때 */
export function postToText(p: BlogPost, affiliate: AffiliateOptions = DEFAULT_AFFILIATE): string {
  const links = activeLinks(affiliate);
  const block = links.length ? affiliateLines(affiliate, links) : [];
  const out: string[] = [];
  out.push(p.intro, "");
  p.sections.forEach((s, i) => {
    out.push(`■ ${s.heading}`, "");
    for (const para of s.paragraphs) out.push(para, "");
    if (s.bullets.length) {
      for (const b of s.bullets) out.push(`• ${b}`);
      out.push("");
    }
    if (block.length && affiliate.position === "afterFirst" && i === 0) out.push(...block, "");
  });
  if (block.length && affiliate.position === "beforeFaq") out.push(...block, "");
  if (p.faq.length) {
    out.push("■ 자주 묻는 질문", "");
    for (const f of p.faq) out.push(`Q. ${f.q}`, `A. ${f.a}`, "");
  }
  if (block.length && affiliate.position === "end") out.push(...block, "");
  out.push(p.closing, "", ...ctaLines(), "", p.hashtags.map((h) => "#" + h.replace(/^#/, "")).join(" "));
  return out.join("\n");
}

/* ── 제휴 링크 블록 ── */

function affiliateHtml(o: AffiliateOptions, links: ReturnType<typeof activeLinks>): string {
  const items = links
    .map(
      (l) =>
        `<li><a href="${esc(l.url)}" target="_blank" rel="noopener sponsored">${esc(l.title)}</a>${l.note ? ` — ${esc(l.note)}` : ""}</li>`,
    )
    .join("");
  const heading = o.heading.trim() ? `<h3><strong>${esc(o.heading.trim())}</strong></h3>` : "";
  const disclosure = o.disclosure ? `<p><em>${esc(COUPANG_DISCLOSURE)}</em></p>` : "";
  return [heading, `<ul>${items}</ul>`, disclosure].filter(Boolean).join("\n");
}

function affiliateLines(o: AffiliateOptions, links: ReturnType<typeof activeLinks>): string[] {
  const out: string[] = [];
  if (o.heading.trim()) out.push(`■ ${o.heading.trim()}`, "");
  for (const l of links) out.push(`• ${l.title}${l.note ? ` — ${l.note}` : ""}`, `  ${l.url}`);
  if (o.disclosure) out.push("", COUPANG_DISCLOSURE);
  return out;
}

/* ── 회사 CTA ── */

function ctaLines(): string[] {
  const c = siteConfig.contact;
  return [
    `📞 ${siteConfig.brand.name} (${siteConfig.brand.tagline})`,
    `대표전화 ${c.phoneDisplay} · ${c.manager.name} ${c.manager.phone}`,
    `${c.hours}`,
    `홈페이지 ${siteConfig.site.url}`,
  ];
}

function ctaHtml(): string {
  const c = siteConfig.contact;
  return [
    `<p><strong>📞 ${esc(siteConfig.brand.name)}</strong> · ${esc(siteConfig.brand.tagline)}</p>`,
    `<p>대표전화 <strong>${esc(c.phoneDisplay)}</strong> · ${esc(c.manager.name)} ${esc(c.manager.phone)}<br>${esc(c.hours)}<br>홈페이지 ${esc(siteConfig.site.url)}</p>`,
  ].join("\n");
}
