// Early-bird pricing and registration windows, shared by the CMS-driven pages and the
// registration actions so the price shown is the price charged.

export interface EarlyBird {
  endsAt: string; // YYYY-MM-DD (inclusive, IST) or ISO date-time; empty = no early bird
  percent: number; // fallback discount when an item has no explicit early price
}

export interface Prize {
  title: string;
  amount: number | null;
  description: string;
}

export const NO_EARLY_BIRD: EarlyBird = { endsAt: "", percent: 0 };

// Dates entered as YYYY-MM-DD mean "until the end of that day in IST".
export function endOfIst(value: string): number {
  if (!value) return NaN;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T23:59:59+05:30`).getTime() : new Date(value).getTime();
}
const startOfIst = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00+05:30`).getTime() : new Date(value).getTime());

export function isEarlyBird(eb: EarlyBird | null | undefined, now = Date.now()): boolean {
  if (!eb?.endsAt) return false;
  const end = endOfIst(eb.endsAt);
  return Number.isFinite(end) && now <= end;
}

export interface Price {
  amount: number | null; // what is charged now
  regular: number | null;
  early: boolean; // true when an early-bird reduction applies right now
}

// Explicit early price wins; otherwise the percentage discount; otherwise the regular price.
export function priceNow(regular: number | null, earlyPrice: number | null | undefined, eb: EarlyBird | null | undefined, now = Date.now()): Price {
  if (regular == null) return { amount: null, regular, early: false };
  if (!isEarlyBird(eb, now)) return { amount: regular, regular, early: false };
  if (earlyPrice != null && earlyPrice >= 0 && earlyPrice < regular) return { amount: earlyPrice, regular, early: true };
  if (eb && eb.percent > 0) return { amount: Math.round(regular * (1 - Math.min(eb.percent, 100) / 100)), regular, early: true };
  return { amount: regular, regular, early: false };
}

export type WindowState = "not_open" | "open" | "closed";
export function windowState(opensAt: string | null | undefined, closesAt: string | null | undefined, now = Date.now()): WindowState {
  if (opensAt && startOfIst(opensAt) > now) return "not_open";
  if (closesAt && endOfIst(closesAt) < now) return "closed";
  return "open";
}

export const prizeTotal = (prizes: Prize[]) => prizes.reduce((sum, p) => sum + (p.amount ?? 0), 0);

export const formatDeadline = (value: string | null | undefined) =>
  value
    ? new Date(endOfIst(value)).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(/^\d{4}-\d{2}-\d{2}$/.test(value) ? {} : { hour: "2-digit", minute: "2-digit" }),
        timeZone: "Asia/Kolkata",
      })
    : "";
