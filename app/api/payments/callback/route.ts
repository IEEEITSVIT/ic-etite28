import { NextResponse } from "next/server";
import { batch, first, now } from "@/lib/db";
import { applyPaymentStatus, verifySignature, type PaymentPurpose } from "@/lib/payments";

// Payment gateway callback (VIT payment API). Expected body (adjust to VIT's contract):
//   { "orderId": "<payment id we sent>", "status": "success" | "failed", "transactionId": "..." }
// signed with HMAC-SHA256(VIT_PAYMENT_SECRET) in the `x-signature` header.
// On success the registration is marked paid, which issues the invoice and emails it.
export async function POST(req: Request) {
  const secret = process.env.VIT_PAYMENT_SECRET;
  if (!secret) return NextResponse.json({ error: "Payment gateway not configured" }, { status: 503 });
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  let body: { orderId?: string; status?: string; transactionId?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const payment = await first<{ id: string; purpose: PaymentPurpose; ref_id: string; status: string }>("SELECT id, purpose, ref_id, status FROM payments WHERE id = ?", [
    body.orderId ?? "",
  ]);
  if (!payment) return NextResponse.json({ error: "Unknown order" }, { status: 404 });

  const success = body.status === "success" || body.status === "paid";
  await batch([
    {
      sql: "UPDATE payments SET status = ?, provider_ref = ?, raw = ?, updated_at = ? WHERE id = ?",
      params: [success ? "paid" : "failed", body.transactionId ?? null, raw.slice(0, 4000), now(), payment.id],
    },
  ]);
  await applyPaymentStatus(payment.purpose, payment.ref_id, success ? "paid" : "failed", body.transactionId ?? null);
  return NextResponse.json({ ok: true });
}
