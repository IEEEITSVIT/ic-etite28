import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

// Shared building blocks for the portal (login, dashboard, evaluator and admin pages).

export const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-[#004B87] focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 disabled:bg-slate-100";
export const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#002147] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#003366] disabled:opacity-60";
export const btnGold =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB81C] px-5 py-2.5 text-sm font-bold text-[#002147] shadow-sm transition hover:bg-[#F5A623] disabled:opacity-60";
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60";

export function PortalPage({
  title,
  subtitle,
  actions,
  children,
  width = "max-w-6xl",
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  width?: string;
}) {
  return (
    <div className="bg-[#F4F6FA] min-h-[70vh]">
      <div className={`${width} mx-auto px-4 sm:px-6 py-8 sm:py-10`}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] tracking-tight">{title}</h1>
            {subtitle && <div className="mt-1 text-slate-600 text-[15px]">{subtitle}</div>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function Card({ title, actions, children, className = "" }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          {title && <h2 className="text-lg font-bold text-[#002147]">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Flash({ ok, error }: { ok?: string | string[]; error?: string | string[] }) {
  const okMsg = Array.isArray(ok) ? ok[0] : ok;
  const errMsg = Array.isArray(error) ? error[0] : error;
  if (!okMsg && !errMsg) return null;
  return (
    <div
      role={errMsg ? "alert" : "status"}
      className={`mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${
        errMsg ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {errMsg ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span>{errMsg ?? okMsg}</span>
    </div>
  );
}

export function Field({ label, hint, children, className = "" }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const BADGE_TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-sky-50 text-sky-800 border-sky-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  navy: "bg-[#002147] text-white border-[#002147]",
};

export function Badge({ tone = "slate", children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone]}`}>{children}</span>;
}

const STATUS_TONE: Record<string, keyof typeof BADGE_TONES> = {
  paid: "green",
  waived: "green",
  confirmed: "green",
  approved: "green",
  sent: "green",
  qualified: "green",
  public: "green",
  not_required: "slate",
  unlisted: "blue",
  pending: "amber",
  unpaid: "amber",
  queued: "amber",
  hidden: "slate",
  failed: "red",
  rejected: "red",
  cancelled: "red",
  archived: "slate",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? "slate"}>{status.replace(/_/g, " ")}</Badge>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{children}</p>;
}

export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className = "" }: { children?: ReactNode; className?: string }) => (
  <td className={`px-3 py-2.5 align-top text-slate-700 ${className}`}>{children}</td>
);

export function Tabs({ items, active }: { items: { href: string; label: string; key: string }[]; active: string }) {
  return (
    <nav className="mb-6 flex gap-1.5 overflow-x-auto rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
      {items.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            t.key === active ? "bg-[#002147] text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-[#002147]">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
