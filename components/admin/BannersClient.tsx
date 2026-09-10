"use client";

import { useEffect, useState } from "react";
import { useAdminKey } from "@/components/admin/admin-key-context";
import Banners from "@/components/Banners";
import { BANNER_THEMES, DEFAULT_BANNERS, mergeBanners, visibleBanners, type Banner } from "@/lib/banners";
import { cn } from "@/lib/utils";

const KEY = "sidebar-banners";
const input = "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand";

export default function BannersClient() {
  const key = useAdminKey();
  const [items, setItems] = useState<Banner[]>(DEFAULT_BANNERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    (async () => {
      try {
        const res = await fetch(`/api/admin/settings?key=${KEY}`, { headers: { "x-admin-key": key }, cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "불러오기 실패");
        setItems(mergeBanners(data.value));
      } catch (e) {
        setError(
          (e instanceof Error ? e.message : "불러오기 실패") +
            " — 배너 설정 저장에는 SUPABASE_SECRET_KEY 와 admin_settings 테이블이 필요합니다. 지금은 기본 배너가 표시됩니다.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const update = (id: string, patch: Partial<Banner>) => {
    setItems((xs) => xs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setDirty(true);
  };
  const move = (id: string, dir: -1 | 1) => {
    setItems((xs) => {
      const i = xs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= xs.length) return xs;
      const next = [...xs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  };
  const remove = (id: string) => {
    if (!confirm("이 배너를 삭제할까요?")) return;
    setItems((xs) => xs.filter((b) => b.id !== id));
    setDirty(true);
  };
  const add = (kind: Banner["kind"]) => {
    const id = `b-${Date.now()}`;
    setItems((xs) => [
      ...xs,
      kind === "text"
        ? { id, enabled: true, kind, title: "9월 개통 이벤트\n설치비 0원", subtitle: "이번 달 신규 가입 시", cta: "자세히 보기", theme: "magenta", href: "/#consult", newTab: false, badge: "이벤트" }
        : { id, enabled: true, kind, title: "새 배너", image: "", href: "", newTab: true },
    ]);
    setEditing(id);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ key: KEY, value: { items } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "저장 실패");
      setDirty(false);
      setMsg("저장했습니다. 홈페이지에는 1분 안에 반영됩니다.");
      setTimeout(() => setMsg(""), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (id: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "banners");
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { "x-admin-key": key }, body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "업로드 실패");
      return;
    }
    update(id, { image: data.url, kind: "image" });
  };

  const preview = visibleBanners(items);

  return (
    <div className="p-5 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">배너 관리</h1>
          <p className="mt-1 text-sm text-muted">홈페이지 왼쪽 메뉴 아래(모바일은 메뉴 안)에 나오는 위젯입니다. 켜기/끄기, 순서, 이벤트·광고 추가.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => add("image")} className="h-9 rounded-full border border-line bg-white px-4 text-xs font-bold">
            + 이미지 배너
          </button>
          <button type="button" onClick={() => add("text")} className="h-9 rounded-full border border-line bg-white px-4 text-xs font-bold">
            + 텍스트 배너(이벤트)
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="h-9 rounded-full bg-brand-gradient px-5 text-xs font-bold text-white disabled:opacity-50"
          >
            {saving ? "저장 중…" : dirty ? "저장" : "저장됨"}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-2xl border border-accent/30 bg-white p-4 text-sm text-accent">{error}</p>}
      {msg && <p className="mb-4 rounded-2xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">{msg}</p>}
      {loading && <p className="text-sm text-muted">불러오는 중…</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <ul className="space-y-3">
          {items.map((b, i) => (
            <li key={b.id} className={cn("rounded-2xl border bg-white p-4 shadow-card", b.enabled ? "border-line" : "border-dashed border-line opacity-70")}>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={b.enabled} onChange={(e) => update(b.id, { enabled: e.target.checked })} className="h-4 w-4 accent-brand" />
                  <span className={cn("text-xs font-bold", b.enabled ? "text-emerald-600" : "text-muted")}>{b.enabled ? "켜짐" : "꺼짐"}</span>
                </label>
                <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                  {b.kind === "image" && b.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className={cn("h-full w-full", BANNER_THEMES[b.theme ?? "blue"].className)} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {b.title.split("\n")[0]} {b.builtin && <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">기본</span>}
                    {b.badge && <span className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{b.badge}</span>}
                  </p>
                  <p className="truncate text-xs text-muted">{b.kind === "image" ? "이미지 배너" : "텍스트 배너"} · {b.href || "링크 없음"}</p>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => move(b.id, -1)} disabled={i === 0} title="위로">↑</IconBtn>
                  <IconBtn onClick={() => move(b.id, 1)} disabled={i === items.length - 1} title="아래로">↓</IconBtn>
                  <IconBtn onClick={() => setEditing(editing === b.id ? null : b.id)} title="편집">{editing === b.id ? "닫기" : "편집"}</IconBtn>
                  {!b.builtin && <IconBtn onClick={() => remove(b.id)} title="삭제" danger>×</IconBtn>}
                </div>
              </div>

              {editing === b.id && (
                <div className="mt-4 grid gap-3 border-t border-line pt-4 md:grid-cols-2">
                  <Field label="종류">
                    <div className="flex gap-2">
                      {(["image", "text"] as const).map((k) => (
                        <button key={k} type="button" onClick={() => update(b.id, { kind: k })} className={cn("rounded-full border px-3 py-1 text-xs font-bold", b.kind === k ? "border-brand bg-brand text-white" : "border-line")}>
                          {k === "image" ? "이미지" : "텍스트"}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="뱃지 (예: 준비중 · NEW · 이벤트, 비우면 없음)">
                    <input value={b.badge ?? ""} onChange={(e) => update(b.id, { badge: e.target.value })} className={input} />
                  </Field>
                  <Field label={b.kind === "image" ? "이미지 설명(alt) / 제목" : "제목 (줄바꿈 가능)"}>
                    <textarea value={b.title} onChange={(e) => update(b.id, { title: e.target.value })} rows={2} className={input} />
                  </Field>
                  <Field label="링크 (예: /#consult 또는 https://…)">
                    <input value={b.href} onChange={(e) => update(b.id, { href: e.target.value })} className={input} />
                    <label className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <input type="checkbox" checked={b.newTab} onChange={(e) => update(b.id, { newTab: e.target.checked })} /> 새 탭으로 열기
                    </label>
                  </Field>
                  {b.kind === "image" ? (
                    <Field label="이미지 (권장 340×506px, 2:3 세로형)">
                      <input value={b.image ?? ""} onChange={(e) => update(b.id, { image: e.target.value })} placeholder="/banner-app.png 또는 https://…" className={input} />
                      <label className="mt-2 block cursor-pointer rounded-lg border border-dashed border-brand/40 py-2 text-center text-xs font-bold text-brand hover:bg-brand-light/40">
                        이미지 파일 올리기
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(b.id, e.target.files[0])} />
                      </label>
                    </Field>
                  ) : (
                    <>
                      <Field label="부제">
                        <input value={b.subtitle ?? ""} onChange={(e) => update(b.id, { subtitle: e.target.value })} className={input} />
                      </Field>
                      <Field label="버튼 문구">
                        <input value={b.cta ?? ""} onChange={(e) => update(b.id, { cta: e.target.value })} className={input} />
                      </Field>
                      <Field label="배경">
                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(BANNER_THEMES) as Banner["theme"][]).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => update(b.id, { theme: t })}
                              className={cn("h-8 w-14 rounded-lg border-2", BANNER_THEMES[t!].className, b.theme === t ? "border-brand ring-2 ring-brand/30" : "border-transparent")}
                              title={BANNER_THEMES[t!].label}
                            />
                          ))}
                        </div>
                      </Field>
                    </>
                  )}
                  <Field label="노출 기간 (선택)">
                    <div className="flex items-center gap-2">
                      <input type="date" value={b.startsAt ?? ""} onChange={(e) => update(b.id, { startsAt: e.target.value || undefined })} className={input} />
                      <span className="text-xs text-muted">~</span>
                      <input type="date" value={b.endsAt ?? ""} onChange={(e) => update(b.id, { endsAt: e.target.value || undefined })} className={input} />
                    </div>
                  </Field>
                </div>
              )}
            </li>
          ))}
        </ul>

        <aside>
          <p className="mb-2 text-xs font-bold text-muted">홈페이지 미리보기 (현재 노출 {preview.length}개)</p>
          <div className="rounded-2xl border border-line bg-white p-3">
            <Banners banners={preview} />
            {preview.length === 0 && <p className="py-6 text-center text-xs text-muted">노출 중인 배너가 없습니다.</p>}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">저장을 눌러야 홈페이지에 반영됩니다. 기간을 설정한 배너는 해당 기간에만 자동 노출됩니다.</p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-muted">{label}</p>
      {children}
    </div>
  );
}

function IconBtn({ children, onClick, disabled, title, danger }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title: string; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn("h-8 min-w-8 rounded-full border px-2 text-xs font-bold disabled:opacity-30", danger ? "border-accent/40 text-accent" : "border-line text-ink")}
    >
      {children}
    </button>
  );
}
