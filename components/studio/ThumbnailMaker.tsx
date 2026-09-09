"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Ratio = "1:1" | "4:3" | "16:9";
const SIZES: Record<Ratio, [number, number]> = { "1:1": [1080, 1080], "4:3": [1200, 900], "16:9": [1280, 720] };

const PRESETS = [
  { key: "blue", label: "BIS 블루", src: "/studio/thumb-bg-blue.png", dark: true },
  { key: "white", label: "화이트", src: "/studio/thumb-bg-white.png", dark: false },
] as const;

const LS_KEY = "bis-studio-thumb-bg";

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  onChange: (v: { title?: string; subtitle?: string; badge?: string }) => void;
};

/** 고정 배경 이미지 + 문구 오버레이 → PNG. 배경은 프리셋 또는 내 PC 이미지(브라우저에만 저장) */
export default function ThumbnailMaker({ title, subtitle, badge, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [bgKey, setBgKey] = useState<string>("blue");
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [darkText, setDarkText] = useState(false);
  const [overlay, setOverlay] = useState(0.25);
  const [align, setAlign] = useState<"left" | "center">("left");
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState("");

  // 저장된 커스텀 배경 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        setCustomBg(saved);
        setBgKey("custom");
      }
    } catch {}
  }, []);

  const bgSrc = bgKey === "custom" ? customBg : PRESETS.find((p) => p.key === bgKey)?.src ?? PRESETS[0].src;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgSrc) return;
    const [W, H] = SIZES[ratio];
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 폰트 준비 (next/font 로 로드된 Noto Sans KR)
    const family = getComputedStyle(document.body).fontFamily.split(",")[0].replace(/["']/g, "").trim();
    try {
      await Promise.all([document.fonts.load(`900 80px "${family}"`), document.fonts.load(`500 40px "${family}"`)]);
    } catch {}

    // 배경
    const img = await loadImage(bgSrc);
    const r = Math.max(W / img.width, H / img.height);
    const dw = img.width * r;
    const dh = img.height * r;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

    if (overlay > 0) {
      ctx.fillStyle = `rgba(${darkText ? "255,255,255" : "0,0,0"},${overlay})`;
      ctx.fillRect(0, 0, W, H);
    }

    const pad = Math.round(W * 0.08);
    const textColor = darkText ? "#0B2A5B" : "#FFFFFF";
    const subColor = darkText ? "rgba(11,42,91,0.75)" : "rgba(255,255,255,0.85)";
    const x = align === "center" ? W / 2 : pad;
    ctx.textAlign = align;
    ctx.textBaseline = "alphabetic";

    // 뱃지
    let y = Math.round(H * 0.36);
    if (badge.trim()) {
      const bsize = Math.round(W * 0.03 * scale);
      ctx.font = `700 ${bsize}px "${family}"`;
      const tw = ctx.measureText(badge).width;
      const bx = align === "center" ? x - tw / 2 - bsize * 0.8 : x;
      const bh = bsize * 1.9;
      const by = y - bh - bsize * 1.4;
      ctx.fillStyle = "#E6007E";
      roundRect(ctx, bx, by, tw + bsize * 1.6, bh, bh / 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(badge, bx + bsize * 0.8, by + bh * 0.68);
      ctx.textAlign = align;
    }

    // 제목 (최대 3줄, 자동 줄바꿈)
    const tsize = Math.round(W * 0.085 * scale);
    ctx.font = `900 ${tsize}px "${family}"`;
    ctx.fillStyle = textColor;
    const maxW = W - pad * 2;
    const lines = title
      .split(/\n/)
      .flatMap((l) => wrap(ctx, l, maxW))
      .slice(0, 3);
    const lh = tsize * 1.22;
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh + tsize));
    y = y + lines.length * lh + tsize * 0.5;

    // 보조 문구
    if (subtitle.trim()) {
      const ssize = Math.round(W * 0.036 * scale);
      ctx.font = `500 ${ssize}px "${family}"`;
      ctx.fillStyle = subColor;
      wrap(ctx, subtitle, maxW)
        .slice(0, 2)
        .forEach((line, i) => ctx.fillText(line, x, y + i * ssize * 1.5 + ssize));
    }
  }, [bgSrc, ratio, title, subtitle, badge, darkText, overlay, align, scale]);

  useEffect(() => {
    const t = setTimeout(() => void draw(), 60);
    return () => clearTimeout(t);
  }, [draw]);

  const onPickFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setCustomBg(url);
      setBgKey("custom");
      try {
        if (url.length < 3_500_000) localStorage.setItem(LS_KEY, url);
        else setStatus("이미지가 커서 이번 세션에서만 사용됩니다(3MB 이하 권장).");
      } catch {
        setStatus("브라우저 저장 공간이 부족해 이번 세션에서만 사용됩니다.");
      }
    };
    reader.readAsDataURL(file);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `thumb-${Date.now()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    setStatus("PNG를 내려받았습니다. 네이버 에디터 사진 업로드로 넣으세요.");
  };

  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setStatus("이미지가 복사되었습니다. 네이버 에디터 본문에 Ctrl+V 하세요.");
    } catch {
      setStatus("이 브라우저는 이미지 복사를 지원하지 않습니다. 다운로드를 이용하세요.");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <canvas ref={canvasRef} className="block h-auto w-full" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={download} className="h-10 rounded-full bg-brand-gradient px-5 text-sm font-bold text-white">
            PNG 다운로드
          </button>
          <button type="button" onClick={copyImage} className="h-10 rounded-full border-2 border-brand-dark px-5 text-sm font-bold text-brand-dark">
            이미지 복사
          </button>
          {status && <p className="self-center text-xs text-muted">{status}</p>}
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <Field label="대표 문구 (줄바꿈 가능)">
          <textarea
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-line px-3 py-2 font-bold"
          />
        </Field>
        <Field label="보조 문구">
          <input value={subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
        </Field>
        <Field label="뱃지 (비우면 숨김)">
          <input value={badge} onChange={(e) => onChange({ badge: e.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
        </Field>

        <Field label="배경">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setBgKey(p.key);
                  setDarkText(!p.dark);
                }}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-bold", bgKey === p.key ? "border-brand bg-brand text-white" : "border-line")}
              >
                {p.label}
              </button>
            ))}
            {customBg && (
              <button
                type="button"
                onClick={() => setBgKey("custom")}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-bold", bgKey === "custom" ? "border-brand bg-brand text-white" : "border-line")}
              >
                내 이미지
              </button>
            )}
          </div>
          <label className="mt-2 block cursor-pointer rounded-xl border border-dashed border-brand/40 px-3 py-2 text-center text-xs text-muted hover:bg-brand-light/40">
            고정 배경 이미지 올리기 (이 브라우저에 저장됨)
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] ?? null)} />
          </label>
        </Field>

        <Field label="비율">
          <div className="flex gap-2">
            {(Object.keys(SIZES) as Ratio[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRatio(r)}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-bold", ratio === r ? "border-brand bg-brand text-white" : "border-line")}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={`어둡게 ${Math.round(overlay * 100)}%`}>
            <input type="range" min={0} max={0.7} step={0.05} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} className="w-full" />
          </Field>
          <Field label={`글자 크기 ${Math.round(scale * 100)}%`}>
            <input type="range" min={0.7} max={1.3} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
          </Field>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={darkText} onChange={(e) => setDarkText(e.target.checked)} /> 어두운 글자(밝은 배경용)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={align === "center"} onChange={(e) => setAlign(e.target.checked ? "center" : "left")} /> 가운데 정렬
          </label>
        </div>
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width <= maxW || !cur) {
      cur = test;
      // 단어 자체가 너무 길면 글자 단위로 끊기
      while (ctx.measureText(cur).width > maxW && cur.length > 1) {
        let cut = cur.length - 1;
        while (cut > 1 && ctx.measureText(cur.slice(0, cut)).width > maxW) cut--;
        lines.push(cur.slice(0, cut));
        cur = cur.slice(cut);
      }
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
