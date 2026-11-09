import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { batch, first, now } from "@/lib/db";
import { newId } from "@/lib/portal/ids";
import { getSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";

// Gateway-agnostic payments. Every payable record (conference registration, TechNext
// booking, event registration) carries payment_status / amount / currency / ref / link
// columns. The provider is chosen in /admin/settings:
//   manual — send the payer to the admin-configured payment link (or per-record link);
//            an admin marks the record paid after reconciling.
//   vit    — VIT payment API. Fill in createVitCheckout() and the callback verification
//            once VIT shares the API contract; everything else already routes through here.

export type PaymentPurpose = "conference" | "technext" | "event";
export type PaymentStatus = "not_required" | "unpaid" | "pending" | "paid" | "waived" | "failed";

export const PAYMENT_STATUSES: PaymentStatus[] = ["not_required", "unpaid", "pending", "paid", "waived", "failed"];

const TABLES: Record<PaymentPurpose, { table: string; key: string }> = {
  conference: { table: "conference_registrations", key: "id" },
  technext: { table: "technext_bookings", key: "id" },
  // Event registrations are keyed by (event_id, user_id); ref is "eventId:userId".
  event: { table: "registrations", key: "event_id || ':' || user_id" },
};

export interface PayableRecord {
  purpose: PaymentPurpose;
  ref: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  link: string | null;
  userId: string;
}

export async function getPayable(purpose: PaymentPurpose, ref: string): Promise<PayableRecord | null> {
  const t = TABLES[purpose];
  const row = await first<{ amount: number; currency: string; status: PaymentStatus; link: string | null; user_id: string }>(
    `SELECT payment_amount AS amount, payment_currency AS currency, payment_status AS status, payment_link AS link, user_id
       FROM ${t.table} WHERE ${t.key} = ?`,
    [ref]
  );
  return row ? { purpose, ref, amount: row.amount, currency: row.currency, status: row.status, link: row.link, userId: row.user_id } : null;
}

export interface CheckoutResult {
  redirectUrl?: string;
  message?: string;
}

async function defaultLink(purpose: PaymentPurpose, ref: string): Promise<string> {
  const s = await getSettings();
  if (purpose === "conference") return s.payments.conferenceLink;
  if (purpose === "technext") return s.payments.technextLink;
  const ev = await first<{ payment_link: string | null }>("SELECT payment_link FROM events WHERE id = ?", [ref.split(":")[0]]);
  return ev?.payment_link ?? "";
}

// Placeholder for VIT's gateway: expected to create an order and return a hosted
// checkout URL. Env: VIT_PAYMENT_API_URL, VIT_PAYMENT_MERCHANT_ID, VIT_PAYMENT_SECRET.
async function createVitCheckout(p: PayableRecord, paymentId: string): Promise<CheckoutResult> {
  const api = process.env.VIT_PAYMENT_API_URL;
  const merchant = process.env.VIT_PAYMENT_MERCHANT_ID;
  const secret = process.env.VIT_PAYMENT_SECRET;
  if (!api || !merchant || !secret) {
    return { message: "Online payment is not available yet. Please check back later or contact the organisers." };
  }
  const payload = {
    merchantId: merchant,
    orderId: paymentId,
    amount: p.amount,
    currency: p.currency,
    returnUrl: `${SITE_URL}/dashboard?payment=${paymentId}`,
    callbackUrl: `${SITE_URL}/api/payments/callback`,
  };
  const body = JSON.stringify(payload);
  const res = await fetch(api, {
    method: "POST",
    headers: { "content-type": "application/json", "x-signature": sign(body, secret) },
    body,
  });
  const data = (await res.json().catch(() => ({}))) as { checkoutUrl?: string; message?: string };
  if (!res.ok || !data.checkoutUrl) return { message: data.message ?? "Could not start the payment. Please try again." };
  return { redirectUrl: data.checkoutUrl };
}

export function sign(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function verifySignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = Buffer.from(sign(body, secret));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function startCheckout(p: PayableRecord): Promise<CheckoutResult> {
  if (p.status === "paid" || p.status === "waived" || p.status === "not_required") return { message: "No payment is due." };
  const settings = await getSettings();
  const paymentId = newId();
  const t = TABLES[p.purpose];
  await batch([
    {
      sql: `INSERT INTO payments (id, purpose, ref_id, user_id, amount, currency, provider, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'created', ?, ?)`,
      params: [paymentId, p.purpose, p.ref, p.userId, p.amount, p.currency, settings.payments.provider, now(), now()],
    },
    { sql: `UPDATE ${t.table} SET payment_status = 'pending' WHERE ${t.key} = ? AND payment_status IN ('unpaid','failed')`, params: [p.ref] },
  ]);

  if (settings.payments.provider === "vit") return createVitCheckout(p, paymentId);

  const link = p.link || (await defaultLink(p.purpose, p.ref));
  if (!link) return { message: settings.payments.instructions };
  const url = new URL(link);
  url.searchParams.set("ref", paymentId);
  return { redirectUrl: url.toString() };
}

// Used by admins (manual reconciliation) and by the gateway callback.
export function setPaymentStatusStatements(purpose: PaymentPurpose, ref: string, status: PaymentStatus, providerRef?: string | null) {
  const t = TABLES[purpose];
  return [
    {
      sql: `UPDATE ${t.table} SET payment_status = ?, payment_ref = COALESCE(?, payment_ref) WHERE ${t.key} = ?`,
      params: [status, providerRef ?? null, ref],
    },
  ];
}
