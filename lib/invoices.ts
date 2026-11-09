import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { all, first, now, parseJson, run } from "@/lib/db";
import { newId } from "@/lib/portal/ids";
import { getSettings, type InvoiceTemplate } from "@/lib/settings";
import { toWinAnsi } from "@/lib/certificates/render";
import type { PaymentPurpose } from "@/lib/payments";

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface InvoiceRow {
  id: string;
  seq: number;
  number: string;
  purpose: PaymentPurpose;
  ref_id: string;
  user_id: string | null;
  bill_name: string;
  bill_email: string;
  bill_org: string | null;
  bill_address: string | null;
  bill_gstin: string | null;
  items: string;
  amount: number;
  currency: string;
  payment_ref: string | null;
  issued_at: string;
}

// Indian financial year (April–March), e.g. "2027-28".
export function financialYear(d = new Date()) {
  const ist = new Date(d.getTime() + 5.5 * 3600e3);
  const y = ist.getUTCFullYear();
  const start = ist.getUTCMonth() >= 3 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

interface BillDetails {
  userId: string;
  name: string;
  email: string;
  org: string | null;
  address: string | null;
  gstin: string | null;
  items: InvoiceItem[];
  amount: number;
  currency: string;
  paymentRef: string | null;
}

async function billFor(purpose: PaymentPurpose, ref: string): Promise<BillDetails | null> {
  if (purpose === "conference") {
    const r = await first<{
      user_id: string; name: string; email: string; affiliation: string; country: string; category_label: string; residency: string;
      paper_ids: string | null; payment_amount: number; payment_currency: string; payment_ref: string | null;
    }>(
      `SELECT c.user_id, u.name, u.email, c.affiliation, c.country, c.category_label, c.residency, c.paper_ids,
              c.payment_amount, c.payment_currency, c.payment_ref
         FROM conference_registrations c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
      [ref]
    );
    if (!r) return null;
    const papers = r.paper_ids ? ` (Paper ID: ${r.paper_ids})` : "";
    return {
      userId: r.user_id, name: r.name, email: r.email, org: r.affiliation, address: r.country, gstin: null,
      items: [{ description: `ic-ETITE'28 registration - ${r.category_label}, ${r.residency === "foreign" ? "foreign" : "Indian"} delegate${papers}`, amount: r.payment_amount }],
      amount: r.payment_amount, currency: r.payment_currency, paymentRef: r.payment_ref,
    };
  }
  if (purpose === "technext") {
    const r = await first<{
      user_id: string; contact_name: string; email: string; organization_name: string; city: string; state: string | null; gst_number: string | null;
      stall_type: string; payment_amount: number; payment_currency: string; payment_ref: string | null;
    }>("SELECT * FROM technext_bookings WHERE id = ?", [ref]);
    if (!r) return null;
    const stall = (await getSettings()).technext.stallTypes.find((s) => s.key === r.stall_type);
    return {
      userId: r.user_id, name: r.contact_name, email: r.email, org: r.organization_name,
      address: [r.city, r.state].filter(Boolean).join(", "), gstin: r.gst_number,
      items: [{ description: `TechNext '28 exhibition stall - ${stall ? `${stall.label} (${stall.size})` : r.stall_type}`, amount: r.payment_amount }],
      amount: r.payment_amount, currency: r.payment_currency, paymentRef: r.payment_ref,
    };
  }
  const [eventId, userId] = ref.split(":");
  const r = await first<{
    name: string; email: string; institution: string | null; city: string | null; title: string; team: string | null; fee_scope: string;
    payment_amount: number; payment_currency: string; payment_ref: string | null;
  }>(
    `SELECT u.name, u.email, u.institution, u.city, e.title, t.name AS team, e.fee_scope, r.payment_amount, r.payment_currency, r.payment_ref
       FROM registrations r JOIN users u ON u.id = r.user_id JOIN events e ON e.id = r.event_id LEFT JOIN teams t ON t.id = r.team_id
      WHERE r.event_id = ? AND r.user_id = ?`,
    [eventId, userId]
  );
  if (!r) return null;
  const forTeam = r.fee_scope === "per_team" && r.team ? ` (team ${r.team})` : "";
  return {
    userId, name: r.name, email: r.email, org: r.institution, address: r.city, gstin: null,
    items: [{ description: `${r.title} registration fee${forTeam}`, amount: r.payment_amount }],
    amount: r.payment_amount, currency: r.payment_currency, paymentRef: r.payment_ref,
  };
}

export const getInvoiceFor = (purpose: PaymentPurpose, ref: string) =>
  first<InvoiceRow>("SELECT * FROM invoices WHERE purpose = ? AND ref_id = ?", [purpose, ref]);

// Issues the invoice for a paid record once; later calls return the existing one.
export async function issueInvoice(purpose: PaymentPurpose, ref: string): Promise<InvoiceRow | null> {
  const existing = await getInvoiceFor(purpose, ref);
  if (existing) return existing;
  const bill = await billFor(purpose, ref);
  if (!bill || bill.amount <= 0) return null;
  const { invoice } = await getSettings();
  const prefix = `${(invoice.prefix || "INV").replace(/[^\w-]/g, "")}/${financialYear()}/`;
  // Next number is computed inside the INSERT so concurrent issues can't share one;
  // UNIQUE(seq) / UNIQUE(number) reject a collision and we retry.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await run(
        `INSERT INTO invoices (id, seq, number, purpose, ref_id, user_id, bill_name, bill_email, bill_org, bill_address, bill_gstin,
                               items, amount, currency, payment_ref, issued_at)
         SELECT ?, COALESCE(MAX(seq), 0) + 1, ? || printf('%05d', COALESCE(MAX(seq), 0) + 1), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
           FROM invoices
          WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE purpose = ? AND ref_id = ?)`,
        [
          newId(), prefix, purpose, ref, bill.userId, bill.name, bill.email, bill.org, bill.address, bill.gstin,
          JSON.stringify(bill.items), bill.amount, bill.currency, bill.paymentRef, now(), purpose, ref,
        ]
      );
      return getInvoiceFor(purpose, ref);
    } catch (err) {
      if (!(err instanceof Error) || !/UNIQUE/i.test(err.message) || attempt === 2) throw err;
    }
  }
  return null;
}

export const listInvoices = (limit = 500) => all<InvoiceRow>("SELECT * FROM invoices ORDER BY seq DESC LIMIT ?", [limit]);

// ─── PDF ───────────────────────────────────────────────────────────────

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const twoDigits = (n: number) => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ""}`);
const threeDigits = (n: number) => `${n >= 100 ? `${ONES[Math.floor(n / 100)]} Hundred${n % 100 ? " " : ""}` : ""}${n % 100 ? twoDigits(n % 100) : ""}`;

// Indian numbering (lakh, crore) for INR; international for other currencies.
export function amountInWords(amount: number, currency: string): string {
  const n = Math.round(amount);
  if (n === 0) return "Zero";
  const parts: string[] = [];
  if (currency === "INR") {
    const crore = Math.floor(n / 1e7), lakh = Math.floor((n % 1e7) / 1e5), thousand = Math.floor((n % 1e5) / 1e3), rest = n % 1e3;
    if (crore) parts.push(`${threeDigits(crore)} Crore`);
    if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
    if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
    if (rest) parts.push(threeDigits(rest));
    return `Rupees ${parts.join(" ")} Only`;
  }
  const million = Math.floor(n / 1e6), thousand = Math.floor((n % 1e6) / 1e3), rest = n % 1e3;
  if (million) parts.push(`${threeDigits(million)} Million`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (rest) parts.push(threeDigits(rest));
  return `${currency === "USD" ? "US Dollars" : currency} ${parts.join(" ")} Only`;
}

const money = (n: number, currency: string) =>
  `${currency === "USD" ? "USD" : "INR"} ${n.toLocaleString(currency === "USD" ? "en-US" : "en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const NAVY = rgb(0, 33 / 255, 71 / 255);
const GOLD = rgb(1, 184 / 255, 28 / 255);
const INK = rgb(0.12, 0.16, 0.23);
const MUTED = rgb(0.4, 0.45, 0.52);

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  for (const para of toWinAnsi(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > width && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    out.push(line);
  }
  return out;
}

export async function renderInvoicePdf(inv: InvoiceRow, tpl: InvoiceTemplate): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Invoice ${inv.number}`);
  doc.setCreator("ic-ETITE'28");
  const page: PDFPage = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const M = 48;
  const text = (s: string, x: number, y: number, size = 10, f = font, color = INK) => page.drawText(toWinAnsi(s), { x, y, size, font: f, color });
  const right = (s: string, xr: number, y: number, size = 10, f = font, color = INK) =>
    page.drawText(toWinAnsi(s), { x: xr - f.widthOfTextAtSize(toWinAnsi(s), size), y, size, font: f, color });

  // Header band with logo
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 114, width, height: 4, color: GOLD });
  try {
    const logo = await doc.embedPng(await readFile(join(process.cwd(), "public/logos/ic-etite28-cropped-transparent.png")));
    const h = 34;
    page.drawImage(logo, { x: M, y: height - 72, width: (logo.width / logo.height) * h, height: h });
  } catch {
    text("ic-ETITE'28", M, height - 64, 24, bold, rgb(1, 1, 1));
  }
  text("Third International Conference on Emerging Trends in IT & Engineering", M, height - 92, 8.5, font, rgb(0.85, 0.88, 0.93));
  right(tpl.title || "Invoice", width - M, height - 52, 16, bold, GOLD);
  right(inv.number, width - M, height - 72, 11, bold, rgb(1, 1, 1));
  right(`Date: ${new Date(inv.issued_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}`, width - M, height - 90, 9, font, rgb(0.85, 0.88, 0.93));

  // Issuer and bill-to
  let y = height - 150;
  text("FROM", M, y, 8, bold, MUTED);
  text("BILL TO", width / 2 + 10, y, 8, bold, MUTED);
  y -= 15;
  const colW = width / 2 - M - 10;
  const fromLines = [
    ...wrap(tpl.orgName, bold, 10, colW).map((l) => ({ l, b: true })),
    ...wrap(tpl.orgAddress, font, 9, colW).map((l) => ({ l, b: false })),
    ...(tpl.gstin ? [{ l: `GSTIN: ${tpl.gstin}`, b: false }] : []),
    ...(tpl.pan ? [{ l: `PAN: ${tpl.pan}`, b: false }] : []),
    ...([tpl.email, tpl.phone].filter(Boolean).length ? [{ l: [tpl.email, tpl.phone].filter(Boolean).join(" | "), b: false }] : []),
  ];
  const toLines = [
    ...wrap(inv.bill_name, bold, 10, colW).map((l) => ({ l, b: true })),
    ...(inv.bill_org ? wrap(inv.bill_org, font, 9, colW).map((l) => ({ l, b: false })) : []),
    ...(inv.bill_address ? wrap(inv.bill_address, font, 9, colW).map((l) => ({ l, b: false })) : []),
    { l: inv.bill_email, b: false },
    ...(inv.bill_gstin ? [{ l: `GSTIN: ${inv.bill_gstin}`, b: false }] : []),
  ];
  for (let i = 0; i < Math.max(fromLines.length, toLines.length); i++) {
    const f = fromLines[i], t = toLines[i];
    if (f) text(f.l, M, y, f.b ? 10 : 9, f.b ? bold : font);
    if (t) text(t.l, width / 2 + 10, y, t.b ? 10 : 9, t.b ? bold : font);
    y -= 13;
  }

  // Items table
  y -= 18;
  page.drawRectangle({ x: M, y: y - 6, width: width - 2 * M, height: 22, color: rgb(0.95, 0.96, 0.98) });
  text("#", M + 8, y, 9, bold, MUTED);
  text("DESCRIPTION", M + 30, y, 9, bold, MUTED);
  right("AMOUNT", width - M - 8, y, 9, bold, MUTED);
  y -= 26;
  const items = parseJson<InvoiceItem[]>(inv.items, []);
  items.forEach((it, i) => {
    const lines = wrap(it.description, font, 10, width - 2 * M - 160);
    text(String(i + 1), M + 8, y, 10);
    lines.forEach((l, j) => text(l, M + 30, y - j * 13, 10));
    right(money(it.amount, inv.currency), width - M - 8, y, 10);
    y -= Math.max(1, lines.length) * 13 + 10;
    page.drawLine({ start: { x: M, y: y + 4 }, end: { x: width - M, y: y + 4 }, thickness: 0.5, color: rgb(0.88, 0.9, 0.93) });
  });

  // Totals (amounts are GST-inclusive; show the split when a rate is set)
  y -= 8;
  const tx = width - M - 200;
  if (tpl.gstPercent > 0) {
    const taxable = inv.amount / (1 + tpl.gstPercent / 100);
    text("Taxable value", tx, y, 9, font, MUTED);
    right(money(taxable, inv.currency), width - M - 8, y, 9, font, MUTED);
    y -= 14;
    text(`GST @ ${tpl.gstPercent}% (included)`, tx, y, 9, font, MUTED);
    right(money(inv.amount - taxable, inv.currency), width - M - 8, y, 9, font, MUTED);
    y -= 28;
  }
  page.drawRectangle({ x: tx - 8, y: y - 8, width: width - M - tx + 8, height: 26, color: NAVY });
  text("TOTAL PAID", tx, y, 10, bold, GOLD);
  right(money(inv.amount, inv.currency), width - M - 8, y, 11, bold, rgb(1, 1, 1));
  y -= 30;
  for (const l of wrap(amountInWords(inv.amount, inv.currency), font, 9, width - 2 * M)) {
    text(l, M, y, 9, font, MUTED);
    y -= 12;
  }

  // Payment details
  y -= 10;
  text("PAYMENT", M, y, 8, bold, MUTED);
  y -= 14;
  text(`Status: Paid${inv.payment_ref ? `   |   Reference: ${inv.payment_ref}` : ""}`, M, y, 9.5);

  // Footer
  let fy = 120;
  for (const l of wrap(tpl.notes, font, 8.5, width - 2 * M)) {
    text(l, M, fy, 8.5, font, MUTED);
    fy -= 11;
  }
  page.drawLine({ start: { x: width - M - 180, y: 78 }, end: { x: width - M, y: 78 }, thickness: 0.6, color: rgb(0.7, 0.72, 0.76) });
  right(tpl.signatory || "Authorised Signatory", width - M, 64, 9, bold);
  right("Authorised Signatory", width - M, 52, 8, font, MUTED);
  page.drawRectangle({ x: 0, y: 0, width, height: 26, color: NAVY });
  text(`Invoice ${inv.number}  |  ${tpl.email || "ic-ETITE'28, VIT Vellore"}`, M, 9, 8, font, rgb(0.85, 0.88, 0.93));
  return doc.save();
}

export async function invoicePdf(inv: InvoiceRow) {
  const { invoice } = await getSettings();
  return { bytes: await renderInvoicePdf(inv, invoice), filename: `invoice-${inv.number.replace(/[^\w-]+/g, "-")}.pdf` };
}

export const SAMPLE_INVOICE: InvoiceRow = {
  id: "sample",
  seq: 1,
  number: "PREVIEW/0000-00/00001",
  purpose: "conference",
  ref_id: "sample",
  user_id: null,
  bill_name: "Dr. Priya Sharma",
  bill_email: "priya.sharma@example.edu",
  bill_org: "Indian Institute of Technology Madras",
  bill_address: "Chennai, Tamil Nadu, India",
  bill_gstin: null,
  items: JSON.stringify([{ description: "ic-ETITE'28 registration - Faculty / Academicians, Indian delegate (Paper ID: 123)", amount: 14000 }]),
  amount: 14000,
  currency: "INR",
  payment_ref: "UTR123456789",
  issued_at: new Date().toISOString(),
};
