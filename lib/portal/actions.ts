import "server-only";
import { redirect, unstable_rethrow } from "next/navigation";
import { PortalError } from "@/lib/portal/events";

export function withFlash(path: string, kind: "ok" | "error", message: string) {
  const [base, hash] = path.split("#");
  const url = `${base}${base.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(message)}`;
  return hash ? `${url}#${hash}` : url;
}

export function flash(path: string, kind: "ok" | "error", message: string): never {
  redirect(withFlash(path, kind, message));
}

// Runs a server-action body and turns failures into a redirect back to `path` with an
// error message; expected validation errors (PortalError) are shown verbatim. On success
// it redirects to `successPath` (default `path`), with the returned message if any.
export async function guarded(path: string, fn: () => Promise<string | void>, successPath: string | (() => string) = path): Promise<never> {
  let ok: string | void;
  try {
    ok = await fn();
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof PortalError) flash(path, "error", err.message);
    console.error(err);
    if (err instanceof Error && /Database is not configured|D1 error|fetch failed/.test(err.message)) {
      flash(path, "error", "The portal can't reach its database right now. Please try again in a few minutes.");
    }
    flash(path, "error", "Something went wrong. Please try again.");
  }
  const target = typeof successPath === "function" ? successPath() : successPath;
  if (ok) flash(target, "ok", ok);
  redirect(target);
}

export const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);
export const num = (fd: FormData, key: string, fallback = 0) => {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? n : fallback;
};
export const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "1" || fd.get(key) === "true";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

// datetime-local inputs are entered in IST.
export const istToIso = (v: string) => (v ? new Date(`${v}${v.length === 16 ? ":00" : ""}+05:30`).toISOString() : null);
export const isoToIstInput = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 5.5 * 3600e3);
  return d.toISOString().slice(0, 16);
};
export const fmtIst = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) + " IST"
    : "—";
