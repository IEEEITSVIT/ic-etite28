import { NextResponse, type NextRequest } from "next/server";
import { first } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { renderCertificateFor, type CertKind } from "@/lib/certificates/server";

// Streams the signed-in participant's certificate, generated on the fly (nothing stored).
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const scope = req.nextUrl.searchParams.get("scope") ?? "";
  const kind = (req.nextUrl.searchParams.get("kind") ?? "participation") as CertKind;
  if (kind !== "participation" && kind !== "winner") return NextResponse.json({ error: "Invalid certificate type." }, { status: 400 });

  // Excel batches: recipients are matched to the logged-in account by email.
  if (scope.startsWith("batch:")) {
    const r = await first<{ id: string; email: string }>("SELECT id, email FROM certificate_batch_recipients WHERE id = ? AND batch_id = ?", [
      req.nextUrl.searchParams.get("r") ?? "",
      scope.slice(6),
    ]);
    if (!r || (user.role !== "admin" && r.email.toLowerCase() !== user.email.toLowerCase())) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }
    if (user.role !== "admin") {
      const released = await first("SELECT 1 AS ok FROM certificate_templates WHERE scope = ? AND released = 1", [scope]);
      if (!released) return NextResponse.json({ error: "Certificates are not available yet." }, { status: 404 });
    }
    const pdf = await renderCertificateFor(scope, "participation", r.id);
    if (!pdf) return NextResponse.json({ error: "No certificate template yet." }, { status: 404 });
    return new NextResponse(Buffer.from(pdf.bytes), {
      headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${pdf.filename}"`, "cache-control": "private, no-store" },
    });
  }

  // Admins may preview any certificate for a specific user.
  const forUser = user.role === "admin" ? (req.nextUrl.searchParams.get("user") ?? user.id) : user.id;

  if (user.role !== "admin") {
    const released = await first("SELECT 1 AS ok FROM certificate_templates WHERE scope = ? AND kind = ? AND released = 1", [scope, kind]);
    if (!released) return NextResponse.json({ error: "Certificates are not available yet." }, { status: 404 });
    if (kind === "winner" && scope.startsWith("event:")) {
      const ev = await first<{ winners_published: number }>("SELECT winners_published FROM events WHERE id = ?", [scope.slice(6)]);
      if (!ev?.winners_published) return NextResponse.json({ error: "Results have not been announced yet." }, { status: 404 });
    }
  }

  const pdf = await renderCertificateFor(scope, kind, forUser);
  if (!pdf) return NextResponse.json({ error: "No certificate is available for this account." }, { status: 404 });
  return new NextResponse(Buffer.from(pdf.bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${pdf.filename}"`,
      "cache-control": "private, no-store",
    },
  });
}
