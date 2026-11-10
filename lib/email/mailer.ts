import "server-only";
import nodemailer from "nodemailer";
import { all, first, now, parseJson, run } from "@/lib/db";
import { decrypt } from "@/lib/portal/crypto";
import { newId } from "@/lib/portal/ids";
import { SITE_URL } from "@/lib/seo";

// ─── SMTP configuration ────────────────────────────────────────────────
// Two accounts, both set in /admin/email (passwords stored encrypted in D1):
//   main — notices, bulk emails, certificates, invoices        (SMTP_* env vars override)
//   otp  — verification codes and password-reset links only    (SMTP_OTP_* env vars override)
// Every empty OTP field falls back to the main account, so until it is filled in both use
// the same login. Each SMTP username has its own daily quota.

export type SmtpChannel = "main" | "otp";
const SETTING_KEY: Record<SmtpChannel, string> = { main: "smtp", otp: "smtp_otp" };

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

// Stored fields. For "otp", empty fields mean "same as the main account".
export const EMPTY_OTP_SMTP: SmtpSettings = { host: "", port: 0, secure: true, user: "", passEnc: "", fromName: "", fromEmail: "", dailyLimit: 0 };

export async function getSmtpSettings(channel: SmtpChannel = "main"): Promise<SmtpSettings> {
  const row = await first<{ value: string }>("SELECT value FROM settings WHERE key = ?", [SETTING_KEY[channel]]).catch(() => null);
  return { ...(channel === "main" ? DEFAULT_SMTP : EMPTY_OTP_SMTP), ...parseJson<Partial<SmtpSettings>>(row?.value, {}) };
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  dailyLimit: number;
  sharesMain: boolean; // otp channel only: same SMTP login as main (shared quota)
}

export async function smtpConfig(channel: SmtpChannel = "main"): Promise<SmtpConfig> {
  const env = process.env;
  const s = await getSmtpSettings("main");
  const user = env.SMTP_USER || s.user;
  const main: SmtpConfig = {
    host: env.SMTP_HOST || s.host,
    port: Number(env.SMTP_PORT || s.port),
    secure: String(env.SMTP_SECURE ?? s.secure) === "true",
    user,
    pass: env.SMTP_PASS || decrypt(s.passEnc),
    fromName: s.fromName || "ic-ETITE'28",
    fromEmail: s.fromEmail || user,
    dailyLimit: Number(env.EMAIL_DAILY_LIMIT || s.dailyLimit) || DEFAULT_SMTP.dailyLimit,
    sharesMain: false,
  };
  if (channel === "main") return main;

  const o = await getSmtpSettings("otp");
  const otpUser = env.SMTP_OTP_USER || o.user || main.user;
  const ownLogin = otpUser.toLowerCase() !== main.user.toLowerCase();
  return {
    host: env.SMTP_OTP_HOST || o.host || main.host,
    port: Number(env.SMTP_OTP_PORT || o.port || main.port),
    secure: env.SMTP_OTP_SECURE != null ? env.SMTP_OTP_SECURE === "true" : o.host ? o.secure : main.secure,
    user: otpUser,
    pass: env.SMTP_OTP_PASS || (o.passEnc ? decrypt(o.passEnc) : main.pass),
    fromName: o.fromName || main.fromName,
    fromEmail: o.fromEmail || (ownLogin ? otpUser : main.fromEmail),
    dailyLimit: Number(env.EMAIL_OTP_DAILY_LIMIT || o.dailyLimit) || main.dailyLimit,
    sharesMain: !ownLogin,
  };
}

export async function isSmtpConfigured(channel: SmtpChannel = "main") {
  const c = await smtpConfig(channel);
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
  channel?: SmtpChannel;
}

export const outboxInsert = (m: QueuedEmail) => ({
  sql: `INSERT INTO email_outbox (id, scope, to_email, to_name, subject, html, attachment, priority, status, attempts, created_at, channel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', 0, ?, ?)`,
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
    m.channel ?? "main",
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

// Emails sent in the last 24h by one SMTP login (rows from before per-login tracking count
// against every login, to stay on the safe side).
export async function sentInLast24h(smtpUser?: string): Promise<number> {
  const since = new Date(Date.now() - 864e5).toISOString();
  const row = smtpUser
    ? await first<{ n: number }>("SELECT COUNT(*) AS n FROM email_outbox WHERE status = 'sent' AND sent_at > ? AND (smtp_user = ? OR smtp_user IS NULL)", [
        since,
        smtpUser.toLowerCase(),
      ])
    : await first<{ n: number }>("SELECT COUNT(*) AS n FROM email_outbox WHERE status = 'sent' AND sent_at > ?", [since]);
  return row?.n ?? 0;
}

export interface ProcessResult {
  sent: number;
  failed: number;
  remainingQueued: number;
  dailyRemaining: number; // main account
  otpDailyRemaining: number;
  smtpConfigured: boolean;
  lastError?: string;
}

const MAX_ATTEMPTS = 3;
// A code (15 min) or reset link (30 min) that could not go out in time is useless later.
const OTP_MAX_AGE_MS = 30 * 60e3;

// Sends up to `limit` queued emails per SMTP account, never exceeding each account's 24h
// quota. Safe to call concurrently: each row is claimed with a conditional UPDATE first.
export async function processOutbox(limit = 20, onlyId?: string): Promise<ProcessResult> {
  const result: ProcessResult = { sent: 0, failed: 0, remainingQueued: 0, dailyRemaining: 0, otpDailyRemaining: 0, smtpConfigured: false };

  await run("UPDATE email_outbox SET status = 'failed', error = ? WHERE channel = 'otp' AND status = 'queued' AND created_at < ?", [
    "Not sent within 30 minutes (daily limit or SMTP error), so the code/link had expired. The user can request a new one.",
    new Date(Date.now() - OTP_MAX_AGE_MS).toISOString(),
  ]);

  for (const channel of ["otp", "main"] as const) {
    const cfg = await smtpConfig(channel);
    const configured = Boolean(cfg.host && cfg.user && cfg.pass);
    if (channel === "main") result.smtpConfigured = configured;
    const used = await sentInLast24h(cfg.user);
    let remaining = cfg.dailyLimit - used;
    const budget = Math.max(0, Math.min(limit, remaining));

    if (configured && budget > 0) {
      const rows = await all<OutboxRow>(
        `SELECT id, to_email, to_name, subject, html, attachment, attempts FROM email_outbox
          WHERE status = 'queued' AND channel = ? ${onlyId ? "AND id = ?" : ""} ORDER BY priority, created_at LIMIT ?`,
        onlyId ? [channel, onlyId, budget] : [channel, budget]
      );
      if (rows.length) {
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
          if (await sendRow(transport, cfg, row, result)) remaining--;
        }
      }
    }
    if (channel === "main") result.dailyRemaining = remaining;
    else result.otpDailyRemaining = remaining;
  }

  const q = await first<{ n: number }>("SELECT COUNT(*) AS n FROM email_outbox WHERE status = 'queued'");
  result.remainingQueued = q?.n ?? 0;
  return result;
}

async function sendRow(transport: nodemailer.Transporter, cfg: SmtpConfig, row: OutboxRow, result: ProcessResult): Promise<boolean> {
  const claim = await run("UPDATE email_outbox SET attempts = attempts + 1 WHERE id = ? AND status = 'queued' AND attempts = ?", [row.id, row.attempts]);
  if (claim.changes === 0) return false;
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
    await run("UPDATE email_outbox SET status = 'sent', sent_at = ?, error = NULL, smtp_user = ? WHERE id = ?", [now(), cfg.user.toLowerCase(), row.id]);
    result.sent++;
    return true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    result.lastError = message;
    result.failed++;
    await run("UPDATE email_outbox SET status = CASE WHEN attempts >= ? THEN 'failed' ELSE 'queued' END, error = ? WHERE id = ?", [
      MAX_ATTEMPTS,
      message.slice(0, 500),
      row.id,
    ]);
    return false;
  }
}

// Transactional mail (verification codes, password resets): sent immediately through the
// OTP account (channel "otp"), so bulk emails can never use up its quota. If it cannot go
// out within 30 minutes it is dropped rather than delivered stale. Without SMTP in
// development the message is printed to the server console so flows can still be tested.
export async function sendNow(m: QueuedEmail): Promise<boolean> {
  const insert = outboxInsert({ channel: "otp", ...m, priority: 0 });
  await run(insert.sql, insert.params);
  const id = insert.params[0] as string;
  const res = await processOutbox(1, id);
  if (!res.smtpConfigured && process.env.NODE_ENV !== "production") {
    console.log(`\n[mail:dev] To: ${m.to}\nSubject: ${m.subject}\n${m.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600)}\n`);
  }
  return res.sent === 1;
}
