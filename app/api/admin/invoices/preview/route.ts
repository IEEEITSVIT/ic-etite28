import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getSettings } from "@/lib/settings";
import { SAMPLE_INVOICE, renderInvoicePdf } from "@/lib/invoices";

// Sample invoice rendered with the current CMS invoice template.
export async function GET() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { invoice } = await getSettings();
  const bytes = await renderInvoicePdf({ ...SAMPLE_INVOICE, number: `${invoice.prefix}/PREVIEW/00001` }, invoice);
  return new NextResponse(Buffer.from(bytes), {
    headers: { "content-type": "application/pdf", "content-disposition": 'inline; filename="invoice-preview.pdf"', "cache-control": "no-store" },
  });
}
