import "server-only";
import { headers } from "next/headers";
import { first, now, run } from "@/lib/db";

// Fixed-window limits for the auth flows. Limits per IP are generous because many students
// share one campus IP (VIT Wi-Fi); per-email / per-account limits are the strict ones.
export const LIMITS = {
  "login-ip": { max: 40, minutes: 15 }, // failed logins from one IP
  "forgot-email": { max: 3, minutes: 60 }, // reset emails to one address
  "forgot-ip": { max: 15, minutes: 60 },
  "signup-ip": { max: 30, minutes: 60 },
  "resend-user": { max: 5, minutes: 60 }, // verification code resends
  "verify-user": { max: 6, minutes: 15 }, // wrong verification codes
} as const;

export type LimitKind = keyof typeof LIMITS;

// Client IP as seen by Vercel (it sets x-forwarded-for / x-real-ip itself).
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim().slice(0, 64);
}

const sinceIso = (minutes: number) => new Date(Date.now() - minutes * 60e3).toISOString();

// True when `key` has already used up its allowance for `kind`.
export async function isLimited(kind: LimitKind, key: string): Promise<boolean> {
  const { max, minutes } = LIMITS[kind];
  const row = await first<{ n: number }>("SELECT COUNT(*) AS n FROM rate_events WHERE kind = ? AND key = ? AND at > ?", [kind, key, sinceIso(minutes)]);
  return (row?.n ?? 0) >= max;
}

// Records one use. Occasionally sweeps events older than a day.
export async function recordHit(kind: LimitKind, key: string): Promise<void> {
  await run("INSERT INTO rate_events (kind, key, at) VALUES (?, ?, ?)", [kind, key, now()]);
  if (Math.random() < 0.02) await run("DELETE FROM rate_events WHERE at < ?", [sinceIso(24 * 60)]);
}

// Checks and records in one go; returns false (and records nothing) when over the limit.
export async function takeToken(kind: LimitKind, key: string): Promise<boolean> {
  if (await isLimited(kind, key)) return false;
  await recordHit(kind, key);
  return true;
}

export async function clearHits(kind: LimitKind, key: string): Promise<void> {
  await run("DELETE FROM rate_events WHERE kind = ? AND key = ?", [kind, key]);
}
