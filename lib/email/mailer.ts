import "server-only";
import nodemailer from "nodemailer";
import { all, first, now, parseJson, run } from "@/lib/db";
import { decrypt } from "@/lib/portal/crypto";
import { newId } from "@/lib/portal/ids";
import { SITE_URL } from "@/lib/seo";

// ─── SMTP configuration ────────────────────────────────────────────────
// Set in /admin/email (password stored encrypted in D1); SMTP_* env vars override.

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  passEnc: string;
  fromName: string;
  fromEmail: string;
  dailyLimit: number; // Gmail: ~500/day personal, ~2000/day Workspace
}

export const DEFAULT_SMTP: SmtpSettings = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  user: "",
  passEnc: "",
  fromName: "ic-ETITE'28",
  fromEmail: "",
  dailyLimit: 450,
};

export async function getSmtpSettings(): Promise<SmtpSettings> {
  const row = await first<{ value: string }>("SELECT value FROM settings WHERE key = 'smtp'").catch(() => null);
  return { ...DEFAULT_SMTP, ...parseJson<Partial<SmtpSettings>>(row?.value, {}) };
}

async function smtpConfig() {
  const s = await getSmtpSettings();
  const user = process.env.SMTP_USER || s.user;
  return {
    host: process.env.SMTP_HOST || s.host,
    port: Number(process.env.SMTP_PORT || s.port),
    secure: String(process.env.SMTP_SECURE ?? s.secure) === "true",
    user,
    pass: process.env.SMTP_PASS || decrypt(s.passEnc),
    fromName: s.fromName || "ic-ETITE'28",
    fromEmail: s.fromEmail || user,
    dailyLimit: Number(process.env.EMAIL_DAILY_LIMIT || s.dailyLimit) || DEFAULT_SMTP.dailyLimit,
  };
}

export async function isSmtpConfigured() {
  const c = await smtpConfig();
  return Boolean(c.host && c.user && c.pass);
}

// ─── Templates ─────────────────────────────────────────────────────────

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type TemplateVars = Record<string, string | number | null | undefined>;

// {{placeholder}} substitution; unknown placeholders are left empty.
export function fillTemplate(text: string, vars: TemplateVars): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => String(vars[k] ?? ""));
}

// Admin-written plain text → safe HTML (escaped, links clickable, paragraphs kept).
export function textToHtml(text: string): string {
  return esc(text.replace(/\r\n?/g, "\n"))
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#004B87">$1</a>')
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function emailLayout(subject: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F4F6FA;padding:24px 12px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1e293b">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden">
    <div style="background:#002147;padding:18px 24px;color:#fff;font-weight:800;font-size:18px">ic-ETITE'28 <span style="color:#FFB81C">·</span> <span style="font-weight:600;font-size:14px;color:#cbd5e1">${esc(subject)}</span></div>
    <div style="padding:24px;font-size:15px">${bodyHtml}</div>
    <div style="padding:14px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:12px;color:#64748b">
      Third International Conference on Emerging Trends in Information Technology and Engineering · VIT Vellore<br>
      <a href="${SITE_URL}/dashboard" style="color:#004B87">Open your dashboard</a>
    </div>
  </div></body></html>`;
}

// ─── Outbox ────────────────────────────────────────────────────────────

export interface CertificateAttachment {
  type: "certificate";
  scope: string;
  kind: "participation" | "winner";
  userId: string;
}

export interface InvoiceAttachment {
  type: "invoice";
  invoiceId: string;
}

export type EmailAttachment = CertificateAttachment | InvoiceAttachment;

export interface QueuedEmail {
  to: string;
  toName?: string | null;
  subject: string;
  html: string;
  scope?: string;
  priority?: number;
  attachment?: EmailAttachment | null;
}

export const outboxInsert = (m: QueuedEmail) => ({
  sql: `INSERT INTO email_outbox (id, scope, to_email, to_name, subject, html, attachment, priority, status, attempts, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', 0, ?)`,
  params: [
    newId(),
    m.scope ?? "global",
    m.to,
    m.toName ?? null,
    m.subject,
    m.html,
    m.attachment ? JSON.stringify(m.attachment) : null,
    m.priority ?? 5,
    now(),
  ],
});

interface OutboxRow {
  id: string;
  to_email: string;
  to_name: string | null;
  subject: string;
  html: string;
  attachment: string | null;
  attempts: number;
}

export async function sentInLast24h(): Promise<number> {
  const row = await first<{ n: number }>("SELECT COUNT(*) AS n FROM email_outbox WHERE status = 'sent' AND sent_at > ?", [
    new Date(Date.now() - 864e5).toISOString(),
  ]);
  return row?.n ?? 0;
}

export interface ProcessResult {
  sent: number;
  failed: number;
  remainingQueued: number;
  dailyRemaining: number;
  smtpConfigured: boolean;
  lastError?: string;
}

const MAX_ATTEMPTS = 3;

// Sends up to `limit` queued emails, never exceeding the 24h SMTP quota. Safe to call
// concurrently: each row is claimed with a conditional UPDATE before sending.
export async function processOutbox(limit = 20, onlyId?: string): Promise<ProcessResult> {
  const cfg = await smtpConfig();
  const configured = Boolean(cfg.host && cfg.user && cfg.pass);
  const used = await sentInLast24h();
  const budget = Math.max(0, Math.min(limit, cfg.dailyLimit - used));

  const result: ProcessResult = { sent: 0, failed: 0, remainingQueued: 0, dailyRemaining: cfg.dailyLimit - used, smtpConfigured: configured };

  if (configured && budget > 0) {
    const rows = await all<OutboxRow>(
      `SELECT id, to_email, to_name, subject, html, attachment, attempts FROM email_outbox
        WHERE status = 'queued' ${onlyId ? "AND id = ?" : ""} ORDER BY priority, created_at LIMIT ?`,
      onlyId ? [onlyId, budget] : [budget]
    );
    const transport = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    });

    for (const row of rows) {
      const claim = await run("UPDATE email_outbox SET attempts = attempts + 1 WHERE id = ? AND status = 'queued' AND attempts = ?", [
        row.id,
        row.attempts,
      ]);
      if (claim.changes === 0) continue;
      try {
        const attachments = [];
        // Attachments are rendered at send time; nothing is stored.
        const att = parseJson<EmailAttachment | null>(row.attachment, null);
        if (att?.type === "certificate") {
          const { renderCertificateFor } = await import("@/lib/certificates/server");
          const pdf = await renderCertificateFor(att.scope, att.kind, att.userId);
          if (pdf) attachments.push({ filename: pdf.filename, content: Buffer.from(pdf.bytes), contentType: "application/pdf" });
        } else if (att?.type === "invoice") {
          const { invoicePdf } = await import("@/lib/invoices");
          const inv = await first<import("@/lib/invoices").InvoiceRow>("SELECT * FROM invoices WHERE id = ?", [att.invoiceId]);
          if (inv) {
            const pdf = await invoicePdf(inv);
            attachments.push({ filename: pdf.filename, content: Buffer.from(pdf.bytes), contentType: "application/pdf" });
          }
        }
        await transport.sendMail({
          from: `"${cfg.fromName.replace(/"/g, "")}" <${cfg.fromEmail}>`,
          to: row.to_name ? `"${row.to_name.replace(/"/g, "")}" <${row.to_email}>` : row.to_email,
          subject: row.subject,
          html: row.html,
          attachments,
        });
        await run("UPDATE email_outbox SET status = 'sent', sent_at = ?, error = NULL WHERE id = ?", [now(), row.id]);
        result.sent++;
        result.dailyRemaining--;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        result.lastError = message;
        result.failed++;
        await run("UPDATE email_outbox SET status = CASE WHEN attempts >= ? THEN 'failed' ELSE 'queued' END, error = ? WHERE id = ?", [
          MAX_ATTEMPTS,
          message.slice(0, 500),
          row.id,
        ]);
      }
    }
  }

  const q = await first<{ n: number }>("SELECT COUNT(*) AS n FROM email_outbox WHERE status = 'queued'");
  result.remainingQueued = q?.n ?? 0;
  return result;
}

// Transactional mail (verification codes, password resets): queued at top priority and
// sent immediately when SMTP is available. Without SMTP in development the message is
// printed to the server console so flows can still be tested.
export async function sendNow(m: QueuedEmail): Promise<boolean> {
  const insert = outboxInsert({ ...m, priority: 0 });
  await run(insert.sql, insert.params);
  const id = insert.params[0] as string;
  const res = await processOutbox(1, id);
  if (!res.smtpConfigured && process.env.NODE_ENV !== "production") {
    console.log(`\n[mail:dev] To: ${m.to}\nSubject: ${m.subject}\n${m.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600)}\n`);
  }
  return res.sent === 1;
}
