"use client";

import { useRef, useState } from "react";
import { BG_CATEGORIES, BUILTIN_BACKGROUNDS, type Background, type BackgroundLibrary, type BgCategory } from "@/lib/studio/backgrounds";
import { cn } from "@/lib/utils";

type Props = {
  library: BackgroundLibrary;
  mode: "server" | "local" | "loading";
  category: BgCategory;
  selectedId: string;
  onSelect: (bg: Background) => void;
  onUpload: (file: File, name: string, category: BgCategory) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSetDefault: (category: BgCategory, id: string) => Promise<void>;
};

/** 배경 라이브러리: 기본 5종 + 업로드, 카테고리 필터, 카테고리별 기본 지정 */
export default function BackgroundPicker({ library, mode, category, selectedId, onSelect, onUpload, onDelete, onSetDefault }: Props) {
  const [filter, setFilter] = useState<BgCategory | "all">("all");
  const [uploadCat, setUploadCat] = useState<BgCategory>(category);
  const [uploadName, setUploadName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const all = [...library.items, ...BUILTIN_BACKGROUNDS];
  const list = filter === "all" ? all : all.filter((b) => b.category === filter);

  const pick = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      await onUpload(file, uploadName.trim() || file.name.replace(/\.[^.]+$/, ""), uploadCat);
      setUploadName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setErr(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {(["all", ...BG_CATEGORIES.map((c) => c.key)] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-bold",
              filter === k ? "border-brand bg-brand text-white" : "border-line text-muted hover:text-ink",
            )}
          >
            {k === "all" ? "전체" : BG_CATEGORIES.find((c) => c.key === k)?.label}
          </button>
        ))}
      </div>

      <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1">
        {list.map((b) => {
          const isDefault = library.defaults[b.category] === b.id;
          const isDefaultForCurrent = library.defaults[category] === b.id;
          return (
            <div key={b.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(b)}
                className={cn(
                  "block w-full overflow-hidden rounded-xl border-2 bg-surface",
                  selectedId === b.id ? "border-brand ring-2 ring-brand/30" : "border-transparent hover:border-line",
                )}
                title={b.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.url} alt={b.name} className="aspect-square w-full object-cover" loading="lazy" />
              </button>
              <p className="mt-0.5 truncate text-center text-[10px] text-muted">
                {isDefaultForCurrent && <span className="text-uplus">★ </span>}
                {b.name}
                {isDefault && !isDefaultForCurrent && <span className="text-muted"> · 기본</span>}
              </p>
              <div className="absolute right-1 top-1 hidden gap-1 group-hover:flex">
                <button
                  type="button"
                  onClick={() => onSetDefault(category, b.id)}
                  title={`${BG_CATEGORIES.find((c) => c.key === category)?.label} 기본 배경으로`}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-uplus shadow-card"
                >
                  ★
                </button>
                {!b.builtin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`"${b.name}" 배경을 삭제할까요?`)) void onDelete(b.id);
                    }}
                    title="삭제"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-accent shadow-card"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-[10px] text-muted">
        ★ 는 현재 글 카테고리({BG_CATEGORIES.find((c) => c.key === category)?.label})의 기본 배경. 이미지에 마우스를 올려 ★로 지정, × 로 삭제.
      </p>

      {/* 업로드 */}
      <div className="mt-3 rounded-xl border border-dashed border-brand/40 p-3">
        <p className="mb-2 text-[11px] font-bold text-muted">내가 만든 배경 올리기 {mode === "local" && "(이 브라우저에만 저장)"}</p>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            placeholder="이름 (예: 오피스넷 사무실 사진)"
            className="w-full rounded-lg border border-line px-2.5 py-1.5 text-xs outline-none focus:border-brand"
          />
          <select
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value as BgCategory)}
            className="rounded-lg border border-line px-2 py-1.5 text-xs"
          >
            {BG_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <label
          className={cn(
            "mt-2 block cursor-pointer rounded-lg bg-brand-gradient py-2 text-center text-xs font-bold text-white",
            busy && "opacity-60",
          )}
        >
          {busy ? "올리는 중…" : "이미지 파일 선택해서 올리기"}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => pick(e.target.files?.[0] ?? null)} />
        </label>
        {err && <p className="mt-1 text-[11px] text-accent">{err}</p>}
        <p className="mt-1 text-[10px] text-muted">정사각형(1080×1080) 또는 4:3 권장. 10MB 이하 PNG/JPG. 문구가 들어갈 자리를 비워 두면 좋습니다.</p>
      </div>
    </div>
  );
}
