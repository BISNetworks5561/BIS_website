"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminKey } from "@/components/admin/admin-key-context";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

type Shortcut = { id: string; label: string; href: string };

const BUILTIN: Shortcut[] = [
  { id: "site", label: "비즈네트웍스 웹사이트", href: siteConfig.site.url },
  { id: "opening", label: "비즈오프닝 앱", href: siteConfig.links.openingApp },
  { id: "blog", label: "네이버 블로그", href: siteConfig.links.blog },
];
const LS_KEY = "bis-admin-shortcuts";

const hostOf = (u: string) => {
  try {
    return new URL(u).host.replace(/^www\./, "");
  } catch {
    return u;
  }
};
const normalizeUrl = (u: string) => {
  const t = u.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

/** 백오피스 바로가기 — 기본 3개 + 사용자가 + 버튼으로 추가 (Supabase 저장, 불가 시 브라우저 저장) */
export default function Shortcuts({ compact = false }: { compact?: boolean }) {
  const key = useAdminKey();
  const [items, setItems] = useState<Shortcut[]>([]);
  const [mode, setMode] = useState<"server" | "local" | "loading">("loading");
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [err, setErr] = useState("");

  const readLocal = (): Shortcut[] => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
    } catch {
      return [];
    }
  };

  // 불러오기: 서버 → 실패 시 로컬
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/settings?key=shortcuts", { headers: { "x-admin-key": key }, cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setItems(Array.isArray(data.value) ? data.value : []);
          setMode("server");
          return;
        }
      } catch {}
      if (!cancelled) {
        setItems(readLocal());
        setMode("local");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const persist = useCallback(
    async (next: Shortcut[]) => {
      setItems(next);
      if (mode === "server") {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-key": key },
          body: JSON.stringify({ key: "shortcuts", value: next }),
        });
        if (res.ok) return;
        setMode("local");
      }
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {}
    },
    [key, mode],
  );

  const add = async () => {
    const url = normalizeUrl(href);
    if (!label.trim()) return setErr("이름을 입력하세요.");
    try {
      new URL(url);
    } catch {
      return setErr("주소 형식이 올바르지 않습니다.");
    }
    setErr("");
    await persist([...items, { id: `${Date.now()}`, label: label.trim(), href: url }]);
    setLabel("");
    setHref("");
    setAdding(false);
  };

  const remove = (id: string) => persist(items.filter((s) => s.id !== id));

  if (compact) {
    return (
      <>
        {[...BUILTIN, ...items].map((s) => (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="rounded-full px-3 py-1.5 text-xs font-bold text-muted">
            {s.label} ↗
          </a>
        ))}
      </>
    );
  }

  return (
    <div>
      <div className="mt-5 mb-1 flex items-center justify-between px-3">
        <p className="text-[11px] font-bold text-muted">바로가기</p>
        <button
          type="button"
          onClick={() => {
            setAdding((v) => !v);
            setErr("");
          }}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border text-sm font-black leading-none",
            adding ? "border-brand bg-brand text-white" : "border-line text-muted hover:border-brand hover:text-brand",
          )}
          aria-label="바로가기 추가"
          title="바로가기 추가"
        >
          {adding ? "×" : "+"}
        </button>
      </div>

      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void add();
          }}
          className="mx-1 mb-2 space-y-2 rounded-xl border border-brand/30 bg-brand-light/40 p-3"
        >
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="이름 (예: LG U+ 파트너)"
            autoFocus
            className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand"
          />
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="주소 (예: partner.lguplus.com)"
            className="w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand"
          />
          {err && <p className="text-[11px] text-accent">{err}</p>}
          <button type="submit" className="h-8 w-full rounded-full bg-brand-gradient text-xs font-bold text-white">
            추가
          </button>
        </form>
      )}

      <nav className="space-y-1">
        {BUILTIN.map((s) => (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface">
            <span className="block text-sm font-bold">{s.label} ↗</span>
            <span className="block text-[11px] text-muted">{hostOf(s.href)}</span>
          </a>
        ))}
        {items.map((s) => (
          <div key={s.id} className="group relative">
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-3 py-2.5 pr-8 transition-colors hover:bg-surface">
              <span className="block truncate text-sm font-bold">{s.label} ↗</span>
              <span className="block truncate text-[11px] text-muted">{hostOf(s.href)}</span>
            </a>
            <button
              type="button"
              onClick={() => remove(s.id)}
              className="absolute right-2 top-2.5 hidden h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-accent/10 hover:text-accent group-hover:flex"
              aria-label={`${s.label} 삭제`}
              title="삭제"
            >
              ×
            </button>
          </div>
        ))}
      </nav>

      {mode === "local" && (
        <p className="mt-2 px-3 text-[10px] leading-relaxed text-muted">
          추가한 바로가기는 이 브라우저에만 저장됩니다. 팀 공용으로 쓰려면 Supabase에 admin_settings 테이블을 만들고 SUPABASE_SECRET_KEY를 설정하세요.
        </p>
      )}
    </div>
  );
}
