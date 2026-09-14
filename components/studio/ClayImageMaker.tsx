"use client";

import { useEffect, useState } from "react";
import { useAdminKey } from "@/components/admin/admin-key-context";
import { productToCategory, type Background, type BackgroundLibrary } from "@/lib/studio/backgrounds";
import { IMAGE_ASPECTS, IMAGE_STYLES, IMAGE_STYLE_KEYS, type ImageAspect, type ImageStyle } from "@/lib/studio/image-options";
import type { BlogPost, StudioRequest } from "@/lib/studio/schema";
import { cn } from "@/lib/utils";

const LS_LIB = "bis-studio-bg-library";
const LS_STYLE = "bis-studio-img-style";

type Generated = { id: string; dataUrl: string; model: string; prompt: string; aspect: ImageAspect; style: ImageStyle; at: number };

type Props = {
  post: BlogPost | null;
  topic: string;
  product: StudioRequest["product"];
  /** GEMINI_API_KEY 설정 여부 (null = 아직 조회 전) */
  geminiReady: boolean | null;
  /** 생성 이미지를 배경 라이브러리에 넣은 뒤 호출 (대표이미지 탭으로 전환용) */
  onUseAsBackground: (bgId: string) => void;
};

/** 글 내용에 맞춘 AI 대표이미지 (클레이아트 기본) 생성 */
export default function ClayImageMaker({ post, topic, product, geminiReady, onUseAsBackground }: Props) {
  const key = useAdminKey();
  const [scene, setScene] = useState("");
  const [style, setStyle] = useState<ImageStyle>("clay");
  const [aspect, setAspect] = useState<ImageAspect>("16:9");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Generated[]>([]);
  const [current, setCurrent] = useState<Generated | null>(null);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  // 글이 바뀌면 장면 설명을 글의 이미지 컨셉으로 채움
  useEffect(() => {
    if (post?.imagePrompt) setScene(post.imagePrompt);
  }, [post]);
  useEffect(() => {
    try {
      const s = localStorage.getItem(LS_STYLE) as ImageStyle | null;
      if (s && s in IMAGE_STYLES) setStyle(s);
    } catch {}
  }, []);
  const chooseStyle = (s: ImageStyle) => {
    setStyle(s);
    try {
      localStorage.setItem(LS_STYLE, s);
    } catch {}
  };

  const generate = async () => {
    setError("");
    setNote("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/image", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ scene, title: post?.title ?? topic, product, style, aspect, model: model.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "이미지 생성 실패");
      const g: Generated = { id: `ai-${Date.now()}`, dataUrl: data.dataUrl, model: data.model, prompt: data.prompt, aspect, style, at: Date.now() };
      setItems((prev) => [g, ...prev].slice(0, 8));
      setCurrent(g);
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!current) return;
    const a = document.createElement("a");
    a.href = current.dataUrl;
    a.download = `bis-${current.style}-${new Date(current.at).toISOString().slice(0, 10)}.png`;
    a.click();
  };

  /** 배경 라이브러리(서버 → 실패 시 브라우저)에 추가하고 대표이미지 탭으로 */
  const useAsBackground = async () => {
    if (!current) return;
    setSaving(true);
    setError("");
    const category = productToCategory(product);
    const name = ((post?.title ?? topic) || "AI 이미지").slice(0, 24) + " (AI)";
    try {
      const blob = await (await fetch(current.dataUrl)).blob();
      const fd = new FormData();
      fd.append("file", new File([blob], "ai.png", { type: blob.type || "image/png" }));
      fd.append("name", name);
      fd.append("category", category);
      const res = await fetch("/api/admin/backgrounds", { method: "POST", headers: { "x-admin-key": key }, body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.item) {
        setNote("배경 라이브러리에 추가했습니다. 대표이미지 탭에서 문구를 얹어 보세요.");
        onUseAsBackground((data.item as Background).id);
        return;
      }
      if (!data.fallback) throw new Error(data.error ?? "저장 실패");
      // 서버 저장 불가 → 브라우저 저장 (ThumbnailMaker 와 같은 형식)
      const dataUrl = await toJpeg(current.dataUrl, 1200);
      const item: Background = { id: `bg-${Date.now()}`, name, category, url: dataUrl, light: await isLight(dataUrl) };
      const lib = readLocal();
      writeLocal({ ...lib, items: [item, ...lib.items] });
      setNote("서버 저장이 불가해 이 브라우저에만 저장했습니다. 대표이미지 탭에서 사용할 수 있습니다.");
      onUseAsBackground(item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const canGenerate = !!key && !loading && geminiReady !== false;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* 미리보기 */}
      <div className="min-w-0">
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface",
            aspect === "16:9" ? "aspect-video" : aspect === "4:3" ? "aspect-[4/3]" : "aspect-square",
          )}
        >
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.dataUrl} alt="AI 생성 대표이미지" className="h-full w-full object-cover" />
          ) : (
            <div className="px-6 text-center text-sm text-muted">
              {loading ? (
                <>
                  <span className="mx-auto mb-3 block h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
                  {IMAGE_STYLES[style].label} 이미지를 만드는 중… (10~30초)
                </>
              ) : (
                <>
                  오른쪽에서 장면 설명을 확인하고 <b className="text-ink">이미지 생성</b>을 누르세요.
                  <br />
                  글을 먼저 생성하면 글의 이미지 컨셉이 자동으로 들어갑니다.
                </>
              )}
            </div>
          )}
          {loading && current && <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-bold text-brand">다시 만드는 중…</div>}
        </div>

        {current && (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={useAsBackground} disabled={saving} className="h-10 rounded-full bg-brand-gradient px-5 text-sm font-black text-white disabled:opacity-50">
                {saving ? "저장 중…" : "대표이미지 배경으로 사용"}
              </button>
              <button type="button" onClick={download} className="h-10 rounded-full border border-line px-4 text-sm font-bold hover:bg-surface">
                PNG 다운로드
              </button>
              <button type="button" onClick={generate} disabled={!canGenerate} className="h-10 rounded-full border border-line px-4 text-sm font-bold hover:bg-surface disabled:opacity-50">
                같은 설정으로 다시
              </button>
              <button type="button" onClick={() => setShowPrompt((v) => !v)} className="text-xs text-muted underline-offset-2 hover:underline">
                {showPrompt ? "프롬프트 숨기기" : "사용된 프롬프트 보기"}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              {current.model} · {IMAGE_STYLES[current.style].label} · {current.aspect}
            </p>
            {showPrompt && <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-surface p-3 text-[11px] leading-relaxed text-ink/80">{current.prompt}</pre>}
          </>
        )}
        {note && <p className="mt-3 rounded-xl bg-brand-light px-3 py-2 text-sm font-medium text-brand-dark">{note}</p>}
        {error && <p className="mt-3 rounded-xl bg-accent/10 px-3 py-2 text-sm font-medium text-accent">{error}</p>}

        {items.length > 1 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold text-muted">이번 세션에서 만든 이미지</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {items.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setCurrent(g)}
                  className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2", current?.id === g.id ? "border-brand" : "border-line")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.dataUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 설정 */}
      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-bold text-muted">스타일</p>
          <div className="grid gap-1.5">
            {IMAGE_STYLE_KEYS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => chooseStyle(s)}
                aria-pressed={style === s}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm",
                  style === s ? "border-brand bg-brand-light font-bold text-brand-dark" : "border-line bg-white hover:border-brand/50",
                )}
              >
                <span>
                  {style === s && <span aria-hidden>✓ </span>}
                  {IMAGE_STYLES[s].label}
                </span>
                <span className="text-[11px] font-normal text-muted">{IMAGE_STYLES[s].desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-bold text-muted">비율</p>
          <div className="flex gap-1.5">
            {IMAGE_ASPECTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAspect(a)}
                className={cn("h-9 flex-1 rounded-xl border text-sm font-bold", aspect === a ? "border-brand bg-brand text-white" : "border-line bg-white")}
              >
                {a}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-muted">네이버 블로그 대표이미지는 1:1 또는 16:9 를 권장합니다.</p>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-bold text-muted">장면 설명 (한국어로 자유롭게)</span>
          <textarea
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            rows={5}
            placeholder="예: 작은 카페 카운터에서 사장님이 태블릿 포스와 와이파이 공유기를 보며 미소 짓는 장면"
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
          <span className="mt-1 block text-[11px] text-muted">
            비워 두면 상품({product})에 맞는 기본 장면으로 그립니다. 글자·로고는 자동으로 제외되어 문구를 얹기 좋게 나옵니다.
          </span>
        </label>

        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="이미지 모델 (비우면 자동 선택)"
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs outline-none focus:border-brand"
        />

        <button
          type="button"
          onClick={generate}
          disabled={!canGenerate}
          className="h-12 w-full rounded-full bg-brand-gradient text-base font-black text-white disabled:opacity-50"
        >
          {loading ? "생성 중…" : current ? "새 이미지 생성" : "이미지 생성"}
        </button>
        {geminiReady === false && (
          <p className="text-[11px] text-accent">이미지 생성은 Gemini 키가 필요합니다. Vercel 환경변수 GEMINI_API_KEY 를 추가하세요.</p>
        )}
        <p className="text-[11px] text-muted">Gemini 이미지 모델을 사용하며 1장당 소액의 API 비용이 발생합니다. 마음에 드는 결과가 나오면 배경으로 저장해 재사용하세요.</p>
      </div>
    </div>
  );
}

/* ── 브라우저 저장 폴백 (ThumbnailMaker 와 동일 형식) ── */

function readLocal(): BackgroundLibrary {
  try {
    const v = JSON.parse(localStorage.getItem(LS_LIB) ?? "null");
    return v && Array.isArray(v.items) ? v : { items: [], defaults: {} };
  } catch {
    return { items: [], defaults: {} };
  }
}
function writeLocal(lib: BackgroundLibrary) {
  localStorage.setItem(LS_LIB, JSON.stringify(lib));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 읽을 수 없습니다."));
    img.src = src;
  });
}

async function toJpeg(src: string, max: number): Promise<string> {
  const img = await loadImage(src);
  const r = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * r);
  c.height = Math.round(img.height * r);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.88);
}

async function isLight(src: string): Promise<boolean> {
  const img = await loadImage(src);
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 32, 32);
  const d = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000;
  return sum / (d.length / 4) > 160;
}
