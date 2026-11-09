import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { now, run } from "@/lib/db";
import { newId } from "@/lib/portal/ids";

const MAX_B64 = 1_900_000; // D1 caps a single value at 2 MB

// Stores an image uploaded from the inline editor and returns its public URL.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await req.json().catch(() => null)) as { data_b64?: string; mime?: string; width?: number; height?: number } | null;
  const mime = body?.mime ?? "";
  if (!body?.data_b64 || !["image/jpeg", "image/png", "image/webp"].includes(mime)) return NextResponse.json({ error: "Upload a JPEG, PNG or WebP image." }, { status: 400 });
  if (body.data_b64.length > MAX_B64) return NextResponse.json({ error: "Image is too large." }, { status: 413 });
  const id = newId();
  await run("INSERT INTO media (id, mime, data_b64, width, height, created_at) VALUES (?, ?, ?, ?, ?, ?)", [
    id,
    mime,
    body.data_b64,
    Math.round(Number(body.width) || 0) || null,
    Math.round(Number(body.height) || 0) || null,
    now(),
  ]);
  return NextResponse.json({ url: `/api/media/${id}` });
}
