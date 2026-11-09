import { NextResponse, type NextRequest } from "next/server";
import { first } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const row = await first<{ image_b64: string; mime: string }>("SELECT image_b64, mime FROM certificate_templates WHERE scope = ? AND kind = ?", [
    req.nextUrl.searchParams.get("scope"),
    req.nextUrl.searchParams.get("kind"),
  ]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(Buffer.from(row.image_b64, "base64"), {
    headers: { "content-type": row.mime, "cache-control": "private, max-age=3600" },
  });
}
