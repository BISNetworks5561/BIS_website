"use client";

import { useEffect, useState } from "react";
import {
  AFFILIATE_LS_KEY,
  AFFILIATE_POSITION_LABEL,
  COUPANG_DISCLOSURE,
  DEFAULT_AFFILIATE,
  isCoupangUrl,
  normalizeUrl,
  type AffiliateLink,
  type AffiliateOptions,
  type AffiliatePosition,
} from "@/lib/studio/affiliate";
import { cn } from "@/lib/utils";

const input = "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

type Props = {
  value: AffiliateOptions;
  onChange: (v: AffiliateOptions) => void;
};

/** 쿠팡파트너스 링크 입력 패널 — 본문 복사 시 링크 블록 + 고지 문구가 함께 들어감 */
export default function AffiliateLinks({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", url: "", note: "" });
  const [err, setErr] = useState("");

  // 마지막 설정 복원 (브라우저 저장)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(AFFILIATE_LS_KEY) ?? "null") as Partial<AffiliateOptions> | null;
      if (saved && Array.isArray(saved.links)) {
        onChange({ ...DEFAULT_AFFILIATE, ...saved });
        if (saved.links.length) setOpen(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<AffiliateOptions>) => {
    const next = { ...value, ...patch };
    onChange(next);
    try {
      localStorage.setItem(AFFILIATE_LS_KEY, JSON.stringify(next));
    } catch {}
  };

  const add = () => {
    setErr("");
    const url = normalizeUrl(draft.url);
    if (!draft.title.trim()) return setErr("상품명(링크 문구)을 입력하세요.");
    if (!url) return setErr("올바른 링크 주소가 아닙니다. https:// 로 시작하는 주소를 넣으세요.");
    const link: AffiliateLink = { id: `af-${Date.now()}`, title: draft.title.trim(), url, note: draft.note.trim() || undefined };
    update({ links: [...value.links, link], enabled: true });
    setDraft({ title: "", url: "", note: "" });
  };

  const remove = (id: string) => update({ links: value.links.filter((l) => l.id !== id) });

  const nonCoupang = value.links.filter((l) => !isCoupangUrl(l.url)).length;

  return (
    <div className="rounded-2xl bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-xs font-bold text-muted">
          <span aria-hidden className={cn("inline-block transition-transform", open && "rotate-90")}>
            ▸
          </span>
          쿠팡파트너스 링크
          {value.links.length > 0 && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand">{value.links.length}개</span>
          )}
        </button>
        <label className="flex items-center gap-1.5 text-xs font-bold">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
            className="h-4 w-4 accent-[var(--color-brand)]"
          />
          본문에 삽입
        </label>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          {value.links.length > 0 && (
            <ul className="space-y-1.5">
              {value.links.map((l) => (
                <li key={l.id} className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">
                      {l.title}
                      {!isCoupangUrl(l.url) && <span className="ml-1 rounded bg-accent/10 px-1 py-0.5 text-[10px] font-bold text-accent">쿠팡 아님</span>}
                    </p>
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="block truncate text-muted underline-offset-2 hover:underline">
                      {l.url}
                    </a>
                    {l.note && <p className="text-muted">{l.note}</p>}
                  </div>
                  <button type="button" onClick={() => remove(l.id)} aria-label="삭제" className="shrink-0 text-muted hover:text-accent">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-2 rounded-xl border border-dashed border-line bg-white p-3">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="상품명 · 링크 문구 (예: 기가 와이파이 공유기 추천)" className={input} />
            <input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
              placeholder="https://link.coupang.com/a/… (파트너스에서 생성한 단축 링크)"
              className={input}
            />
            <input value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="한 줄 추천 이유 (선택)" className={input} />
            <div className="flex items-center justify-between gap-2">
              {err ? <p className="text-[11px] font-medium text-accent">{err}</p> : <span className="text-[11px] text-muted">추가하면 자동으로 “본문에 삽입”이 켜집니다.</span>}
              <button type="button" onClick={add} className="h-8 shrink-0 rounded-full bg-brand px-4 text-xs font-bold text-white">
                + 링크 추가
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold text-muted">삽입 위치</span>
              <select value={value.position} onChange={(e) => update({ position: e.target.value as AffiliatePosition })} className={input}>
                {(Object.keys(AFFILIATE_POSITION_LABEL) as AffiliatePosition[]).map((p) => (
                  <option key={p} value={p}>
                    {AFFILIATE_POSITION_LABEL[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-bold text-muted">블록 제목</span>
              <input value={value.heading} onChange={(e) => update({ heading: e.target.value })} placeholder="함께 보면 좋은 상품" className={input} />
            </label>
          </div>

          <label className="flex items-start gap-2 text-[11px] text-muted">
            <input type="checkbox" checked={value.disclosure} onChange={(e) => update({ disclosure: e.target.checked })} className="mt-0.5 h-3.5 w-3.5" />
            <span>
              고지 문구 포함 (쿠팡파트너스 필수): <em>{COUPANG_DISCLOSURE}</em>
            </span>
          </label>
          {nonCoupang > 0 && (
            <p className="text-[11px] text-accent">쿠팡 주소가 아닌 링크가 {nonCoupang}개 있습니다. 그대로 넣을 수는 있지만 쿠팡 고지 문구와 맞지 않을 수 있습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
