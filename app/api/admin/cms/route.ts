import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { now, run } from "@/lib/db";
import type { TextOverride } from "@/lib/cms";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

// Saves one inline edit. Uses json_set/json_remove so concurrent edits never overwrite each other.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return json({ error: "Forbidden" }, 403);
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return json({ error: "Bad origin" }, 403);

  const body = (await req.json().catch(() => null)) as
    | { type: "text"; key: string; value: TextOverride | null }
    | { type: "image"; src: string; url: string | null }
    | null;
  if (!body) return json({ error: "Invalid request" }, 400);

  let settingKey: "texts" | "images";
  let itemKey: string;
  let value: unknown;
  if (body.type === "text") {
    if (!/^[\w:./-]{3,120}$/.test(body.key ?? "")) return json({ error: "Invalid key" }, 400);
    settingKey = "texts";
    itemKey = body.key;
    if (body.value) {
      const v = body.value;
      const clean: TextOverride = {};
      if (typeof v.t === "string") clean.t = v.t.slice(0, 5000);
      if (typeof v.c === "string" && /^#[0-9a-f]{6}$/i.test(v.c)) clean.c = v.c;
      if (typeof v.s === "number" && v.s >= 0.5 && v.s <= 3) clean.s = Math.round(v.s * 100) / 100;
      if (v.b === true) clean.b = true;
      if (v.h === true) clean.h = true;
      value = Object.keys(clean).length ? (typeof v.o === "string" ? { ...clean, o: v.o.slice(0, 500) } : clean) : null;
    } else value = null;
  } else if (body.type === "image") {
    if (typeof body.src !== "string" || !body.src.startsWith("/") || body.src.length > 300) return json({ error: "Invalid image" }, 400);
    if (body.url && !/^\/api\/media\/[\w-]+$/.test(body.url)) return json({ error: "Invalid image URL" }, 400);
    settingKey = "images";
    itemKey = body.src;
    value = body.url || null;
  } else return json({ error: "Invalid type" }, 400);

  const path = `$."${itemKey.replace(/"/g, "")}"`;
  await run("INSERT OR IGNORE INTO settings (key, value, updated_at, updated_by) VALUES (?, '{}', ?, ?)", [settingKey, now(), user.id]);
  if (value == null) {
    await run("UPDATE settings SET value = json_remove(value, ?), updated_at = ?, updated_by = ? WHERE key = ?", [path, now(), user.id, settingKey]);
  } else {
    await run("UPDATE settings SET value = json_set(value, ?, json(?)), updated_at = ?, updated_by = ? WHERE key = ?", [
      path,
      JSON.stringify(value),
      now(),
      user.id,
      settingKey,
    ]);
  }
  revalidateTag("settings");
  revalidatePath("/", "layout");
  return json({ ok: true });
}
