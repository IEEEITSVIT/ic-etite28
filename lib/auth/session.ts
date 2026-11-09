import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { first, now, run } from "@/lib/db";
import { sha256 } from "@/lib/portal/ids";

export type Role = "participant" | "evaluator" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone: string | null;
  institution: string | null;
  department: string | null;
  year_of_study: string | null;
  city: string | null;
  email_verified: number;
}

const SESSION_COOKIE = "ic_session";
// Readable by client JS so the static navbar can show "Dashboard" instead of "Login".
const LOGGED_IN_COOKIE = "ic_logged_in";
const SESSION_DAYS = 14;

const adminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isBootstrapAdmin = (email: string) => adminEmails().includes(email.toLowerCase());

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  await run("INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)", [
    sha256(token),
    userId,
    expires.toISOString(),
    now(),
  ]);
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(SESSION_COOKIE, token, { httpOnly: true, secure, sameSite: "lax", path: "/", expires });
  jar.set(LOGGED_IN_COOKIE, "1", { httpOnly: false, secure, sameSite: "lax", path: "/", expires });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await run("DELETE FROM sessions WHERE id = ?", [sha256(token)]).catch(() => {});
  jar.delete(SESSION_COOKIE);
  jar.delete(LOGGED_IN_COOKIE);
}

export async function destroyAllSessions(userId: string) {
  await run("DELETE FROM sessions WHERE user_id = ?", [userId]);
}

// Cached per request so layouts and pages share one lookup.
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return first<SessionUser>(
    `SELECT u.id, u.email, u.name, u.role, u.phone, u.institution, u.department, u.year_of_study, u.city, u.email_verified
       FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.id = ? AND s.expires_at > ?`,
    [sha256(token), now()]
  ).catch(() => null);
});

export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  const nextQs = next ? `?next=${encodeURIComponent(next)}` : "";
  if (!user) redirect(`/login${nextQs}`);
  if (!user.email_verified) redirect(`/verify-email${nextQs}`);
  return user;
}

export async function requireRole(roles: Role[], next?: string): Promise<SessionUser> {
  const user = await requireUser(next);
  if (!roles.includes(user.role)) redirect("/dashboard?error=" + encodeURIComponent("You do not have access to that page."));
  return user;
}

export const requireAdmin = (next?: string) => requireRole(["admin"], next);
