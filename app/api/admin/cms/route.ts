import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { batch, now, type Statement } from "@/lib/db";
import type { TextOverride } from "@/lib/cms";
import { COLLECTIONS, cleanCollection } from "@/lib/collections";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

function cleanText(v: TextOverride | null): TextOverride | null {
  if (!v) return null;
  const c: TextOverride = {};
  if (typeof v.t === "string") c.t = v.t.slice(0, 5000);
  if (typeof v.c === "string" && /^#[0-9a-f]{6}$/i.test(v.c)) c.c = v.c;
  if (typeof v.s === "number" && v.s >= 0.5 && v.s <= 3) c.s = Math.round(v.s * 100) / 100;
  if (v.b === true) c.b = true;
  if (v.h === true) c.h = true;
  if (!Object.keys(c).length) return null;
  if (typeof v.o === "string") c.o = v.o.slice(0, 500);
  return c;
}

// json_set / json_remove per item, so saves from two admins never overwrite each other.
function upsert(settingKey: string, itemKey: string, value: unknown, userId: string): Statement[] {
  const path = `$."${itemKey.replace(/"/g, "")}"`;
  return [
    { sql: "INSERT OR IGNORE INTO settings (key, value, updated_at, updated_by) VALUES (?, '{}', ?, ?)", params: [settingKey, now(), userId] },
    value == null
      ? { sql: "UPDATE settings SET value = json_remove(value, ?), updated_at = ?, updated_by = ? WHERE key = ?", params: [path, now(), userId, settingKey] }
      : { sql: "UPDATE settings SET value = json_set(value, ?, json(?)), updated_at = ?, updated_by = ? WHERE key = ?", params: [path, JSON.stringify(value), now(), userId, settingKey] },
  ];
}

// Publishes edits from Admin → Page content / Lists: { texts?, images?, collections? }, each a
// map of key → new value (null restores the original).
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return json({ error: "Forbidden" }, 403);
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return json({ error: "Bad origin" }, 403);

  const body = (await req.json().catch(() => null)) as {
    texts?: Record<string, TextOverride | null>;
    images?: Record<string, string | null>;
    collections?: Record<string, unknown[] | null>;
  } | null;
  if (!body) return json({ error: "Invalid request" }, 400);

  const stmts: Statement[] = [];
  for (const [key, v] of Object.entries(body.texts ?? {})) {
    if (!/^[\w:./-]{3,120}$/.test(key)) return json({ error: `Invalid text key ${key}` }, 400);
    stmts.push(...upsert("texts", key, cleanText(v), user.id));
  }
  for (const [src, url] of Object.entries(body.images ?? {})) {
    if (!src.startsWith("/") || src.length > 300) return json({ error: "Invalid image" }, 400);
    if (url && !/^\/api\/media\/[\w-]+$/.test(url)) return json({ error: "Invalid image URL" }, 400);
    stmts.push(...upsert("images", src, url || null, user.id));
  }
  for (const [key, items] of Object.entries(body.collections ?? {})) {
    if (!(key in COLLECTIONS)) return json({ error: `Unknown list ${key}` }, 400);
    stmts.push(...upsert("collections", key, items == null ? null : cleanCollection(key, items), user.id));
  }
  if (stmts.length === 0) return json({ ok: true, saved: 0 });
  await batch(stmts);
  revalidateTag("settings");
  revalidatePath("/", "layout");
  return json({ ok: true });
}
