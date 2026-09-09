"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminKey } from "@/components/admin/AdminShell";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  created_at: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  region: string | null;
  plan_type: "standalone" | "bundle" | "unknown";
  speed: string | null;
  ip_type: "dynamic" | "static" | "unknown";
  message: string | null;
  status: "new" | "contacted" | "closed";
  memo: string | null;
};

const STATUS: Record<Row["status"], { label: string; cls: string }> = {
  new: { label: "신규", cls: "bg-uplus/10 text-uplus" },
  contacted: { label: "연락함", cls: "bg-brand-light text-brand-dark" },
  closed: { label: "완료", cls: "bg-surface text-muted" },
};
const PLAN: Record<Row["plan_type"], string> = { standalone: "단독", bundle: "결합", unknown: "-" };
const IP: Record<Row["ip_type"], string> = { dynamic: "유동", static: "고정", unknown: "-" };

export default function ConsultsClient() {
  const key = useAdminKey();
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Row["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/consults", { headers: { "x-admin-key": key }, cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "불러오기 실패");
      setRows(data.rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (id: string, body: Partial<Pick<Row, "status" | "memo">>) => {
    const res = await fetch("/api/admin/consults", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ id, ...body }),
    });
    if (res.ok) setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...body } : r)));
  };

  const shown = rows.filter((r) => filter === "all" || r.status === filter);
  const counts = { all: rows.length, new: rows.filter((r) => r.status === "new").length };

  return (
    <div className="p-5 md:p-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">상담 접수 현황</h1>
          <p className="mt-1 text-sm text-muted">홈페이지 상담 폼으로 들어온 신청입니다. 신규 {counts.new}건 / 전체 {counts.all}건</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white p-1 shadow-card">
            {(["all", "new", "contacted", "closed"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn("rounded-full px-3 py-1.5 text-xs font-bold", filter === f ? "bg-brand text-white" : "text-muted")}
              >
                {f === "all" ? "전체" : STATUS[f].label}
              </button>
            ))}
          </div>
          <button type="button" onClick={load} className="h-9 rounded-full border border-line bg-white px-4 text-xs font-bold">
            새로고침
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-2xl border border-accent/30 bg-white p-4 text-sm text-accent">{error}</p>}
      {loading && <p className="text-sm text-muted">불러오는 중…</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-surface text-xs text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">접수일시</th>
                <th className="px-4 py-3 font-semibold">담당자 / 회사</th>
                <th className="px-4 py-3 font-semibold">연락처</th>
                <th className="px-4 py-3 font-semibold">지역</th>
                <th className="px-4 py-3 font-semibold">상품 / 속도 / IP</th>
                <th className="px-4 py-3 font-semibold">상태</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    접수 내역이 없습니다.
                  </td>
                </tr>
              )}
              {shown.map((r) => (
                <FragmentRow key={r.id} r={r} open={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} onPatch={patch} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FragmentRow({
  r,
  open,
  onToggle,
  onPatch,
}: {
  r: Row;
  open: boolean;
  onToggle: () => void;
  onPatch: (id: string, body: Partial<Pick<Row, "status" | "memo">>) => Promise<void>;
}) {
  const [memo, setMemo] = useState(r.memo ?? "");
  const d = new Date(r.created_at);
  const when = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return (
    <>
      <tr onClick={onToggle} className={cn("cursor-pointer border-t border-line hover:bg-surface/60", open && "bg-surface/60")}>
        <td className="px-4 py-3 whitespace-nowrap text-muted">{when}</td>
        <td className="px-4 py-3">
          <span className="font-bold">{r.name}</span>
          {r.company && <span className="text-muted"> · {r.company}</span>}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <a href={`tel:${r.phone.replace(/[^\d]/g, "")}`} className="font-bold text-brand" onClick={(e) => e.stopPropagation()}>
            {r.phone}
          </a>
        </td>
        <td className="px-4 py-3">{r.region ?? "-"}</td>
        <td className="px-4 py-3 whitespace-nowrap">
          {PLAN[r.plan_type]} / {r.speed ?? "-"} / {IP[r.ip_type]}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <select
            value={r.status}
            onChange={(e) => onPatch(r.id, { status: e.target.value as Row["status"] })}
            className={cn("rounded-full px-2.5 py-1 text-xs font-bold", STATUS[r.status].cls)}
          >
            <option value="new">신규</option>
            <option value="contacted">연락함</option>
            <option value="closed">완료</option>
          </select>
        </td>
      </tr>
      {open && (
        <tr className="border-t border-line bg-surface/40">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="text-sm">
                <p className="text-xs font-bold text-muted">문의 내용</p>
                <p className="mt-1 whitespace-pre-wrap">{r.message || "(없음)"}</p>
                {r.email && <p className="mt-2 text-xs text-muted">이메일 {r.email}</p>}
              </div>
              <div>
                <p className="text-xs font-bold text-muted">상담 메모</p>
                <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" />
                <button
                  type="button"
                  onClick={() => onPatch(r.id, { memo })}
                  className="mt-2 h-8 rounded-full bg-brand-dark px-4 text-xs font-bold text-white"
                >
                  메모 저장
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
