"use client";

import { useMemo, useState } from "react";
import { useAdminKey } from "@/components/admin/AdminShell";
import ThumbnailMaker from "@/components/studio/ThumbnailMaker";
import type { BlogPost, StudioRequest } from "@/lib/studio/schema";
import { postToHtml, postToText } from "@/lib/studio/render";
import { cn } from "@/lib/utils";

const input = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";

const DEFAULT_REQ: StudioRequest = {
  topic: "",
  keywords: [],
  product: "officenet",
  tone: "friendly",
  length: "medium",
  audience: "",
  region: "",
  notes: "",
};

export default function StudioClient() {
  const key = useAdminKey();
  const [req, setReq] = useState<StudioRequest>(DEFAULT_REQ);
  const [keywordsText, setKeywordsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState<BlogPost | null>(null);
  const [usage, setUsage] = useState<{ input: number; output: number; model: string } | null>(null);
  const [tab, setTab] = useState<"post" | "thumb">("post");
  const [thumb, setThumb] = useState({ title: "", subtitle: "", badge: "LG U+ 오피스넷" });
  const [toast, setToast] = useState("");

  const generate = async () => {
    setError("");
    setLoading(true);
    try {
      const body: StudioRequest = {
        ...req,
        keywords: keywordsText
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 10),
      };
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "생성 실패");
      const p = data.post as BlogPost;
      setPost(p);
      setUsage(data.usage);
      setThumb((t) => ({ ...t, title: p.thumbnailTitle, subtitle: p.thumbnailSub }));
      setTab("post");
    } catch (e) {
      setError(e instanceof Error ? e.message : "생성 실패");
    } finally {
      setLoading(false);
    }
  };

  const html = useMemo(() => (post ? postToHtml(post) : ""), [post]);
  const text = useMemo(() => (post ? postToText(post) : ""), [post]);

  const copy = async (kind: "html" | "text" | "title" | "tags") => {
    if (!post) return;
    try {
      if (kind === "html") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
        flash("서식 포함 본문을 복사했습니다. 네이버 에디터 본문에 Ctrl+V");
      } else if (kind === "text") {
        await navigator.clipboard.writeText(text);
        flash("텍스트 본문을 복사했습니다.");
      } else if (kind === "title") {
        await navigator.clipboard.writeText(post.title);
        flash("제목을 복사했습니다.");
      } else {
        await navigator.clipboard.writeText(post.hashtags.map((h) => "#" + h.replace(/^#/, "")).join(" "));
        flash("해시태그를 복사했습니다.");
      }
    } catch {
      flash("복사에 실패했습니다. 텍스트를 직접 선택해 복사하세요.");
    }
  };

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="p-5 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black">콘텐츠 스튜디오</h1>
        <p className="mt-1 text-sm text-muted">주제와 키워드를 넣으면 네이버 블로그용 글을 작성하고, 고정 배경 위에 문구만 바꿔 대표이미지를 만듭니다.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* 입력 */}
        <section className="space-y-4 rounded-3xl border border-line bg-white p-5 shadow-card">
          <Field label="주제 *">
            <input
              value={req.topic}
              onChange={(e) => setReq({ ...req, topic: e.target.value })}
              placeholder="예: 사무실 이전할 때 인터넷 개통 체크리스트"
              className={input}
            />
          </Field>
          <Field label="핵심 키워드 (쉼표로 구분, 첫 번째가 가장 중요)">
            <input
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="예: 기업인터넷, 사무실 인터넷 설치, 고정IP"
              className={input}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="상품">
              <select value={req.product} onChange={(e) => setReq({ ...req, product: e.target.value as StudioRequest["product"] })} className={input}>
                <option value="officenet">오피스넷</option>
                <option value="soho">소호인터넷</option>
                <option value="phone">인터넷전화</option>
                <option value="cctv">CCTV</option>
                <option value="other">기타/종합</option>
              </select>
            </Field>
            <Field label="톤">
              <select value={req.tone} onChange={(e) => setReq({ ...req, tone: e.target.value as StudioRequest["tone"] })} className={input}>
                <option value="friendly">친절한 존댓말</option>
                <option value="professional">전문적</option>
                <option value="casual">편안한 구어체</option>
              </select>
            </Field>
            <Field label="분량">
              <select value={req.length} onChange={(e) => setReq({ ...req, length: e.target.value as StudioRequest["length"] })} className={input}>
                <option value="short">짧게 (1,200~1,600자)</option>
                <option value="medium">보통 (1,800~2,500자)</option>
                <option value="long">길게 (2,800~3,500자)</option>
              </select>
            </Field>
            <Field label="지역 (선택)">
              <input value={req.region} onChange={(e) => setReq({ ...req, region: e.target.value })} placeholder="예: 강남구" className={input} />
            </Field>
          </div>
          <Field label="독자 (선택)">
            <input value={req.audience} onChange={(e) => setReq({ ...req, audience: e.target.value })} placeholder="예: 직원 10~30명 규모 사무실 총무 담당자" className={input} />
          </Field>
          <Field label="추가 요청·참고 내용 (선택)">
            <textarea
              value={req.notes}
              onChange={(e) => setReq({ ...req, notes: e.target.value })}
              rows={4}
              placeholder="꼭 넣을 내용, 피할 표현, 참고 자료 요약 등"
              className={input}
            />
          </Field>
          <button
            type="button"
            onClick={generate}
            disabled={loading || req.topic.trim().length < 2 || !key}
            className="h-12 w-full rounded-full bg-brand-gradient text-base font-black text-white disabled:opacity-50"
          >
            {loading ? "작성 중… (30초~1분)" : "글 생성하기"}
          </button>
          {error && <p className="rounded-xl bg-accent/10 px-3 py-2 text-sm font-medium text-accent">{error}</p>}
          {usage && (
            <p className="text-[11px] text-muted">
              {usage.model} · 입력 {usage.input.toLocaleString()} / 출력 {usage.output.toLocaleString()} 토큰
            </p>
          )}
        </section>

        {/* 결과 */}
        <section className="min-w-0 rounded-3xl border border-line bg-white p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex rounded-full bg-surface p-1">
              {(["post", "thumb"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn("rounded-full px-4 py-1.5 text-sm font-bold", tab === t ? "bg-white text-brand shadow-card" : "text-muted")}
                >
                  {t === "post" ? "본문" : "대표이미지"}
                </button>
              ))}
            </div>
            {post && tab === "post" && (
              <div className="flex flex-wrap gap-2">
                <Btn onClick={() => copy("title")}>제목 복사</Btn>
                <Btn onClick={() => copy("html")} primary>
                  본문 복사 (서식)
                </Btn>
                <Btn onClick={() => copy("text")}>텍스트만</Btn>
                <Btn onClick={() => copy("tags")}>해시태그</Btn>
              </div>
            )}
          </div>

          {toast && <p className="mb-3 rounded-xl bg-brand-light px-3 py-2 text-sm font-medium text-brand-dark">{toast}</p>}

          {tab === "thumb" && (
            <ThumbnailMaker
              title={thumb.title || "대표 문구를 입력하세요"}
              subtitle={thumb.subtitle}
              badge={thumb.badge}
              onChange={(v) => setThumb((t) => ({ ...t, ...v }))}
            />
          )}

          {tab === "post" && !post && (
            <div className="flex min-h-[320px] items-center justify-center text-center text-sm text-muted">
              왼쪽에 주제를 넣고 “글 생성하기”를 누르면 여기에 결과가 표시됩니다.
            </div>
          )}

          {tab === "post" && post && (
            <article className="prose-bis max-w-none">
              <p className="text-xs font-bold text-brand">제목</p>
              <h2 className="text-xl font-black md:text-2xl">{post.title}</h2>
              {post.altTitles.length > 0 && (
                <p className="mt-1 text-xs text-muted">대안: {post.altTitles.join(" / ")}</p>
              )}
              <div className="my-4 rounded-2xl bg-surface p-4 text-xs text-muted">
                <p>
                  <b className="text-ink">대표이미지 문구</b> {post.thumbnailTitle.replace(/\n/g, " / ")} · {post.thumbnailSub}
                </p>
                <p className="mt-1">
                  <b className="text-ink">이미지 컨셉</b> {post.imagePrompt}
                </p>
                <p className="mt-1">
                  <b className="text-ink">SEO 키워드</b> {post.seoKeywords.join(", ")}
                </p>
              </div>
              <div
                className="space-y-3 text-[15px] leading-relaxed [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-black [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted">{label}</span>
      {children}
    </label>
  );
}

function Btn({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-4 text-xs font-bold",
        primary ? "bg-brand-gradient text-white" : "border border-line text-ink hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
