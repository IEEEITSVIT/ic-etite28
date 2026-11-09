import { NextResponse, type NextRequest } from "next/server";
import { first } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getInvoiceFor, invoicePdf, type InvoiceRow } from "@/lib/invoices";
import type { PaymentPurpose } from "@/lib/payments";

// Invoice PDF for the payer (or any invoice for admins): ?id=<invoice id> or ?purpose=&ref=.
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const sp = req.nextUrl.searchParams;
  const id = sp.get("id");
  const inv = id
    ? await first<InvoiceRow>("SELECT * FROM invoices WHERE id = ?", [id])
    : await getInvoiceFor((sp.get("purpose") ?? "") as PaymentPurpose, sp.get("ref") ?? "");
  if (!inv || (user.role !== "admin" && inv.user_id !== user.id)) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  const pdf = await invoicePdf(inv);
  return new NextResponse(Buffer.from(pdf.bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${sp.get("inline") ? "inline" : "attachment"}; filename="${pdf.filename}"`,
      "cache-control": "private, no-store",
    },
  });
}
