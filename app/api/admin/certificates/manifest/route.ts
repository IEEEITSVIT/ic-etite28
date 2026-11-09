import { NextResponse, type NextRequest } from "next/server";
import { first, parseJson } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { certificateRecipients, type CertKind, type CertTemplateRow } from "@/lib/certificates/server";
import { DEFAULT_LAYOUT } from "@/lib/certificates/render";

// Everything the admin's browser needs to build all certificates locally.
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const scope = req.nextUrl.searchParams.get("scope") ?? "";
  const kind = (req.nextUrl.searchParams.get("kind") ?? "participation") as CertKind;
  const row = await first<CertTemplateRow>("SELECT * FROM certificate_templates WHERE scope = ? AND kind = ?", [scope, kind]);
  if (!row) return NextResponse.json({ error: "Upload and save a template first." }, { status: 404 });
  const recipients = await certificateRecipients(scope, kind);
  return NextResponse.json(
    {
      template: { b64: row.image_b64, mime: row.mime, width: row.width, height: row.height },
      layout: parseJson(row.layout, DEFAULT_LAYOUT),
      recipients: recipients.map((r) => ({ email: r.email, values: r.values })),
    },
    { headers: { "cache-control": "no-store" } }
  );
}
