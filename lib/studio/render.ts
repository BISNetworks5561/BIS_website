import type { BlogPost } from "@/lib/studio/schema";
import { siteConfig } from "@/site.config";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 네이버 스마트에디터에 붙여넣기 위한 HTML (인라인 스타일 최소화) */
export function postToHtml(p: BlogPost): string {
  const out: string[] = [];
  out.push(`<p>${esc(p.intro)}</p>`);
  for (const s of p.sections) {
    out.push(`<h3><strong>${esc(s.heading)}</strong></h3>`);
    for (const para of s.paragraphs) out.push(`<p>${esc(para)}</p>`);
    if (s.bullets.length) {
      out.push(`<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`);
    }
  }
  if (p.faq.length) {
    out.push(`<h3><strong>자주 묻는 질문</strong></h3>`);
    for (const f of p.faq) {
      out.push(`<p><strong>Q. ${esc(f.q)}</strong></p><p>A. ${esc(f.a)}</p>`);
    }
  }
  out.push(`<p>${esc(p.closing)}</p>`);
  out.push(ctaHtml());
  out.push(`<p>${p.hashtags.map((h) => "#" + esc(h.replace(/^#/, ""))).join(" ")}</p>`);
  return out.join("\n");
}

/** 텍스트만 복사할 때 */
export function postToText(p: BlogPost): string {
  const out: string[] = [];
  out.push(p.intro, "");
  for (const s of p.sections) {
    out.push(`■ ${s.heading}`, "");
    for (const para of s.paragraphs) out.push(para, "");
    if (s.bullets.length) {
      for (const b of s.bullets) out.push(`• ${b}`);
      out.push("");
    }
  }
  if (p.faq.length) {
    out.push("■ 자주 묻는 질문", "");
    for (const f of p.faq) out.push(`Q. ${f.q}`, `A. ${f.a}`, "");
  }
  out.push(p.closing, "", ...ctaLines(), "", p.hashtags.map((h) => "#" + h.replace(/^#/, "")).join(" "));
  return out.join("\n");
}

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
