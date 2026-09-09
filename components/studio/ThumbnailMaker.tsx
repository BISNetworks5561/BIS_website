"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAdminKey } from "@/components/admin/admin-key-context";
import BackgroundPicker from "@/components/studio/BackgroundPicker";
import {
  BUILTIN_BACKGROUNDS,
  EMPTY_LIBRARY,
  pickBackground,
  type Background,
  type BackgroundLibrary,
  type BgCategory,
} from "@/lib/studio/backgrounds";
import { cn } from "@/lib/utils";

type Ratio = "1:1" | "4:3" | "16:9";
const SIZES: Record<Ratio, [number, number]> = { "1:1": [1080, 1080], "4:3": [1200, 900], "16:9": [1280, 720] };
const LS_LIB = "bis-studio-bg-library";

type Props = {
  title: string;
  subtitle: string;
  badge: string;
  category: BgCategory;
  onChange: (v: { title?: string; subtitle?: string; badge?: string }) => void;
};

/** 대표이미지: 배경(라이브러리) + 문구 오버레이 → PNG */
export default function ThumbnailMaker({ title, subtitle, badge, category, onChange }: Props) {
  const key = useAdminKey();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [library, setLibrary] = useState<BackgroundLibrary>(EMPTY_LIBRARY);
  const [mode, setMode] = useState<"server" | "local" | "loading">("loading");
  const [bg, setBg] = useState<Background>(BUILTIN_BACKGROUNDS[0]);
  const manualRef = useRef(false);

  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [darkText, setDarkText] = useState(false);
  const [overlay, setOverlay] = useState(0.25);
  const [align, setAlign] = useState<"left" | "center">("left");
  const [scale, setScale] = useState(1);
  const [radius, setRadius] = useState(0);
  const [status, setStatus] = useState("");

  /* ── 라이브러리 불러오기 (서버 → 로컬) ── */
  const readLocal = (): BackgroundLibrary => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_LIB) ?? "null");
      return v && Array.isArray(v.items) ? v : EMPTY_LIBRARY;
    } catch {
      return EMPTY_LIBRARY;
    }
  };
  const writeLocal = (lib: BackgroundLibrary) => {
    try {
      localStorage.setItem(LS_LIB, JSON.stringify(lib));
    } catch {
      setStatus("브라우저 저장 공간이 부족합니다. 이미지를 줄이거나 오래된 배경을 삭제하세요.");
    }
  };

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/backgrounds", { headers: { "x-admin-key": key }, cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.library) {
          setLibrary(data.library);
          setMode("server");
          return;
        }
      } catch {}
      if (!cancelled) {
        setLibrary(readLocal());
        setMode("local");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  /* ── 카테고리/라이브러리 변경 시 배경 자동 선택 ── */
  useEffect(() => {
    manualRef.current = false;
  }, [category]);
  useEffect(() => {
    if (mode === "loading" || manualRef.current) return;
    const auto = pickBackground(library, category);
    setBg(auto);
    setDarkText(auto.light);
  }, [library, category, mode]);

  const select = (b: Background) => {
    manualRef.current = true;
    setBg(b);
    setDarkText(b.light);
  };

  /* ── 업로드/삭제/기본 지정 ── */
  const upload = async (file: File, name: string, cat: BgCategory) => {
    if (mode === "server") {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name);
      fd.append("category", cat);
      const res = await fetch("/api/admin/backgrounds", { method: "POST", headers: { "x-admin-key": key }, body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "업로드 실패");
      setLibrary(data.library);
      if (data.item) select(data.item);
      return;
    }
    // 로컬 저장: 1200px JPEG 로 축소
    const dataUrl = await downscale(file, 1200);
    const light = await isLight(dataUrl);
    const item: Background = { id: `bg-${Date.now()}`, name, category: cat, url: dataUrl, light };
    const next = { ...library, items: [item, ...library.items] };
    setLibrary(next);
    writeLocal(next);
    select(item);
  };

  const remove = async (id: string) => {
    if (mode === "server") {
      const res = await fetch(`/api/admin/backgrounds?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: { "x-admin-key": key } });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.library) setLibrary(data.library);
      return;
    }
    const defaults = Object.fromEntries(Object.entries(library.defaults).filter(([, v]) => v !== id)) as BackgroundLibrary["defaults"];
    const next = { items: library.items.filter((b) => b.id !== id), defaults };
    setLibrary(next);
    writeLocal(next);
  };

  const setDefault = async (cat: BgCategory, id: string) => {
    const next = { ...library, defaults: { ...library.defaults, [cat]: id } };
    setLibrary(next);
    if (mode === "server") {
      await fetch("/api/admin/backgrounds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ defaults: { [cat]: id } }),
      });
    } else {
      writeLocal(next);
    }
    setStatus("기본 배경으로 지정했습니다.");
  };

  /* ── 그리기 ── */
  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const [W, H] = SIZES[ratio];
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    const family = getComputedStyle(document.body).fontFamily.split(",")[0].replace(/["']/g, "").trim();
    try {
      await Promise.all([document.fonts.load(`900 80px "${family}"`), document.fonts.load(`500 40px "${family}"`)]);
    } catch {}

    // 라운드 클리핑
    ctx.save();
    if (radius > 0) {
      roundRect(ctx, 0, 0, W, H, radius);
      ctx.clip();
    }

    let img: HTMLImageElement | null = null;
    try {
      img = await loadImage(bg.url);
    } catch {
      setStatus("배경 이미지를 불러오지 못했습니다.");
    }
    if (img) {
      const r = Math.max(W / img.width, H / img.height);
      const dw = img.width * r;
      const dh = img.height * r;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else {
      ctx.fillStyle = "#1160B8";
      ctx.fillRect(0, 0, W, H);
    }

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

    const tsize = Math.round(W * 0.085 * scale);
    ctx.font = `900 ${tsize}px "${family}"`;
    ctx.fillStyle = textColor;
    if (!darkText) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = tsize * 0.15;
      ctx.shadowOffsetY = tsize * 0.04;
    }
    const maxW = W - pad * 2;
    const lines = title
      .split(/\n/)
      .flatMap((l) => wrap(ctx, l, maxW))
      .slice(0, 3);
    const lh = tsize * 1.22;
    lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh + tsize));
    y = y + lines.length * lh + tsize * 0.5;
    ctx.shadowColor = "transparent";

    if (subtitle.trim()) {
      const ssize = Math.round(W * 0.036 * scale);
      ctx.font = `500 ${ssize}px "${family}"`;
      ctx.fillStyle = subColor;
      wrap(ctx, subtitle, maxW)
        .slice(0, 2)
        .forEach((line, i) => ctx.fillText(line, x, y + i * ssize * 1.5 + ssize));
    }
    ctx.restore();
  }, [bg, ratio, title, subtitle, badge, darkText, overlay, align, scale, radius]);

  useEffect(() => {
    const t = setTimeout(() => void draw(), 60);
    return () => clearTimeout(t);
  }, [draw]);

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
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div>
        <div
          className="overflow-hidden rounded-2xl border border-line"
          style={{ backgroundImage: "linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%),linear-gradient(45deg,#e5e7eb 25%,transparent 25%,transparent 75%,#e5e7eb 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0,10px 10px", backgroundColor: "#fff" }}
        >
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

        <div className="mt-5">
          <p className="mb-2 text-xs font-bold text-muted">배경 이미지 {mode === "server" ? "(팀 공용 라이브러리)" : mode === "local" ? "(이 브라우저에만 저장)" : ""}</p>
          <BackgroundPicker
            library={library}
            mode={mode}
            category={category}
            selectedId={bg.id}
            onSelect={select}
            onUpload={upload}
            onDelete={remove}
            onSetDefault={setDefault}
          />
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <Field label="대표 문구 (줄바꿈 가능)">
          <textarea value={title} onChange={(e) => onChange({ title: e.target.value })} rows={3} className="w-full rounded-xl border border-line px-3 py-2 font-bold" />
        </Field>
        <Field label="보조 문구">
          <input value={subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
        </Field>
        <Field label="뱃지 (비우면 숨김)">
          <input value={badge} onChange={(e) => onChange({ badge: e.target.value })} className="w-full rounded-xl border border-line px-3 py-2" />
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

        <Field label={`모서리 라운드 ${radius}px`}>
          <input type="range" min={0} max={160} step={4} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
          <div className="mt-1 flex gap-1.5">
            {[0, 32, 64, 120].map((r) => (
              <button key={r} type="button" onClick={() => setRadius(r)} className={cn("rounded-full border px-2 py-0.5 text-[11px]", radius === r ? "border-brand text-brand" : "border-line text-muted")}>
                {r === 0 ? "없음" : `${r}px`}
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
        <p className="text-[11px] leading-relaxed text-muted">
          라운드를 주면 모서리가 투명한 PNG로 저장됩니다. 네이버 에디터에서는 흰 배경 위에 둥근 카드처럼 보입니다.
        </p>
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
    if (!src.startsWith("data:")) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downscale(file: File, max: number): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const r = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * r);
    c.height = Math.round(img.height * r);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function isLight(src: string): Promise<boolean> {
  try {
    const img = await loadImage(src);
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 16;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 16, 16);
    const d = ctx.getImageData(0, 0, 16, 16).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    return sum / (d.length / 4) > 160;
  } catch {
    return false;
  }
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width <= maxW || !cur) {
      cur = test;
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
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
