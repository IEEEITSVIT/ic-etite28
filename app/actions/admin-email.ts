"use server";

import { requireAdmin } from "@/lib/auth/session";
import { now, run } from "@/lib/db";
import { encrypt } from "@/lib/portal/crypto";
import { emailLayout, getSmtpSettings, sendNow, textToHtml } from "@/lib/email/mailer";
import { bool, guarded, isEmail, num, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";

const BACK = "/admin/email";

export async function saveSmtpAction(fd: FormData) {
  const admin = await requireAdmin();
  await guarded(BACK, async () => {
    const current = await getSmtpSettings();
    const pass = String(fd.get("pass") ?? "").replace(/\s+/g, ""); // Gmail app passwords are shown with spaces
    const fromEmail = str(fd, "fromEmail", 200);
    if (fromEmail && !isEmail(fromEmail)) throw new PortalError("From address is not a valid email.");
    const value = {
      host: str(fd, "host", 120) || "smtp.gmail.com",
      port: num(fd, "port", 465),
      secure: bool(fd, "secure"),
      user: str(fd, "user", 200),
      passEnc: pass ? encrypt(pass) : current.passEnc,
      fromName: str(fd, "fromName", 80) || "ic-ETITE'28",
      fromEmail,
      dailyLimit: Math.max(1, Math.min(10000, num(fd, "dailyLimit", 450))),
    };
    await run(
      `INSERT INTO settings (key, value, updated_at, updated_by) VALUES ('smtp', ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
      [JSON.stringify(value), now(), admin.id]
    );
    return "SMTP settings saved.";
  });
}

export async function sendTestEmailAction(fd: FormData) {
  const admin = await requireAdmin();
  await guarded(BACK, async () => {
    const to = str(fd, "to", 200) || admin.email;
    if (!isEmail(to)) throw new PortalError("Enter a valid email.");
    const ok = await sendNow({
      to,
      subject: "ic-ETITE'28 portal test email",
      html: emailLayout("Test email", textToHtml("This is a test email from the ic-ETITE'28 portal. SMTP is working.")),
    });
    if (!ok) throw new PortalError("The test email could not be sent. Check the SMTP settings and the outbox error below.");
    return `Test email sent to ${to}.`;
  });
}

export async function retryFailedAction() {
  await requireAdmin();
  await guarded(BACK, async () => {
    const res = await run("UPDATE email_outbox SET status = 'queued', attempts = 0, error = NULL WHERE status = 'failed'");
    return `${res.changes} failed email(s) re-queued.`;
  });
}

export async function clearOutboxAction(fd: FormData) {
  await requireAdmin();
  await guarded(BACK, async () => {
    const which = str(fd, "which", 10);
    if (which === "queued") {
      const res = await run("DELETE FROM email_outbox WHERE status = 'queued'");
      return `${res.changes} queued email(s) cancelled.`;
    }
    // Keep the last 24h of sent mail so the daily quota stays accurate.
    const res = await run("DELETE FROM email_outbox WHERE status IN ('sent','failed') AND created_at < ?", [new Date(Date.now() - 864e5).toISOString()]);
    return `${res.changes} old email record(s) deleted.`;
  });
}
