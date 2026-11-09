import { NextResponse } from "next/server";
import { first } from "@/lib/db";

// Serves uploaded images. A new upload always gets a new id, so responses are immutable.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await first<{ mime: string; data_b64: string }>("SELECT mime, data_b64 FROM media WHERE id = ?", [id]);
  if (!row) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(row.data_b64, "base64"), {
    headers: { "content-type": row.mime, "cache-control": "public, max-age=31536000, immutable" },
  });
}
