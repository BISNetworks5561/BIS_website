"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import Shortcuts from "@/components/admin/Shortcuts";

import { ADMIN_KEY_LS, AdminKeyContext } from "@/components/admin/admin-key-context";

/** 백오피스 공통 셸: 접근 키 게이트 + 좌측 메뉴 */
const MENU = [
  { href: "/admin/studio", label: "콘텐츠 스튜디오", desc: "블로그 글 · 대표이미지" },
  { href: "/admin/consults", label: "상담 접수 현황", desc: "홈페이지 상담 신청 내역" },
  { href: "/admin/opening", label: "BIS opening 사용법", desc: "비즈오프닝 앱 가이드 · 매뉴얼" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState("");
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let saved = "";
    try {
      saved = localStorage.getItem(ADMIN_KEY_LS) ?? "";
    } catch {}
    if (saved) {
      verify(saved).then((ok) => {
        if (ok) {
          setKey(saved);
          setAuthed(true);
        }
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, []);

  const verify = async (k: string) => {
    try {
      const res = await fetch("/api/admin/verify", { method: "POST", headers: { "x-admin-key": k } });
      if (res.ok) return true;
      const data = await res.json().catch(() => ({}));
      setErr(data.error ?? "접근 키가 올바르지 않습니다.");
      return false;
    } catch {
      setErr("서버에 연결할 수 없습니다.");
      return false;
    }
  };

  const login = async () => {
    setBusy(true);
    setErr("");
    const ok = await verify(input);
    if (ok) {
      setKey(input);
      setAuthed(true);
      try {
        localStorage.setItem(ADMIN_KEY_LS, input);
      } catch {}
    }
    setBusy(false);
  };

  const logout = () => {
    setAuthed(false);
    setKey("");
    setInput("");
    try {
      localStorage.removeItem(ADMIN_KEY_LS);
    } catch {}
  };

  if (!ready) return null;

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void login();
          }}
          className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 shadow-card"
        >
          <Image src={siteConfig.brand.logoFullSrc} alt={siteConfig.brand.nameEn} width={966} height={240} className="mx-auto h-9 w-auto" />
          <h1 className="mt-6 text-center text-xl font-black">백오피스</h1>
          <p className="mt-1 text-center text-xs text-muted">내부 직원 전용 · 접근 키를 입력하세요</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            className="mt-5 w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-brand"
            placeholder="접근 키"
          />
          {err && <p className="mt-2 text-xs font-medium text-accent">{err}</p>}
          <button
            type="submit"
            disabled={busy || !input}
            className="mt-4 h-12 w-full rounded-full bg-brand-gradient text-sm font-black text-white disabled:opacity-50"
          >
            {busy ? "확인 중…" : "들어가기"}
          </button>
          <Link href="/" className="mt-4 block text-center text-xs text-muted hover:text-brand">
            ← 홈페이지로
          </Link>
        </form>
      </main>
    );
  }

  return (
    <AdminKeyContext.Provider value={key}>
      <div className="min-h-screen bg-surface">
        <header className="sticky top-0 z-40 border-b border-line bg-white">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Image src={siteConfig.brand.logoFullSrc} alt={siteConfig.brand.nameEn} width={966} height={240} className="h-7 w-auto" />
              </Link>
              <span className="rounded-full bg-brand-dark px-2.5 py-0.5 text-[11px] font-bold text-white">백오피스</span>
            </div>
            <nav className="flex items-center gap-1 md:hidden">
              {MENU.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className={cn("rounded-full px-3 py-1.5 text-xs font-bold", pathname.startsWith(m.href) ? "bg-brand text-white" : "text-muted")}
                >
                  {m.label}
                </Link>
              ))}
            </nav>
            <button type="button" onClick={logout} className="text-xs font-bold text-muted hover:text-accent">
              잠그기
            </button>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1400px] md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden border-r border-line bg-white p-4 md:block">
            <nav className="space-y-1">
              {MENU.map((m) => {
                const active = pathname.startsWith(m.href);
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 transition-colors",
                      active ? "bg-brand-light text-brand-dark" : "hover:bg-surface",
                    )}
                  >
                    <span className="block text-sm font-bold">{m.label}</span>
                    <span className="block text-[11px] text-muted">{m.desc}</span>
                  </Link>
                );
              })}
            </nav>
            <Shortcuts />
            <div className="mt-6 rounded-xl border border-dashed border-line p-3 text-[11px] text-muted">
              이 영역은 메뉴에 노출되지 않고 검색엔진에서도 제외됩니다. 주소를 아는 사람만 접근 키로 들어올 수 있습니다.
            </div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </AdminKeyContext.Provider>
  );
}
