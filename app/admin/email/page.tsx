import { all, first } from "@/lib/db";
import { getSmtpSettings, sentInLast24h } from "@/lib/email/mailer";
import { clearOutboxAction, retryFailedAction, saveSmtpAction, sendTestEmailAction } from "@/app/actions/admin-email";
import { fmtIst } from "@/lib/portal/actions";
import OutboxRunner from "@/components/admin/OutboxRunner";
import { NOTIFICATION_DEFS, NOTIFICATION_KEYS, getNotificationTemplates } from "@/lib/notifications";
import { saveNotificationsAction } from "@/app/actions/admin-settings";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Field, Flash, PortalPage, Stat, StatusBadge, Table, Td, btnDanger, btnSecondary, inputCls } from "@/components/portal/ui";

export default async function AdminEmailPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const [smtp, sent24, counts, recent, notices] = await Promise.all([
    getSmtpSettings(),
    sentInLast24h(),
    first<{ queued: number; failed: number; sent: number }>(
      "SELECT SUM(status = 'queued') AS queued, SUM(status = 'failed') AS failed, SUM(status = 'sent') AS sent FROM email_outbox"
    ),
    all<{ id: string; to_email: string; subject: string; status: string; error: string | null; created_at: string; sent_at: string | null; attachment: string | null }>(
      "SELECT id, to_email, subject, status, error, created_at, sent_at, attachment FROM email_outbox ORDER BY created_at DESC LIMIT 60"
    ),
    getNotificationTemplates(),
  ]);
  const envOverride = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const configured = envOverride || Boolean(smtp.user && smtp.passEnc);
  const limit = Number(process.env.EMAIL_DAILY_LIMIT || smtp.dailyLimit);

  return (
    <PortalPage title="Email & SMTP" subtitle="All portal emails go through this queue so they stay within your Gmail sending limit." width="max-w-7xl">
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Queued" value={counts?.queued ?? 0} />
        <Stat label="Sent (24h)" value={`${sent24} / ${limit}`} hint="daily limit" />
        <Stat label="Failed" value={counts?.failed ?? 0} />
        <Stat label="SMTP" value={configured ? "Ready" : "Not set"} hint={envOverride ? "from environment" : smtp.user || undefined} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Send queue">
          <OutboxRunner queued={counts?.queued ?? 0} />
          <p className="mt-3 text-sm text-slate-500">
            Verification codes and password resets are sent instantly. Bulk emails (qualification, results, certificates) wait here until you send them; anything over the daily limit goes out automatically the next day.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <form action={retryFailedAction}>
              <SubmitButton className={btnSecondary}>Retry failed</SubmitButton>
            </form>
            <form action={clearOutboxAction}>
              <input type="hidden" name="which" value="old" />
              <SubmitButton className={btnSecondary}>Delete old records</SubmitButton>
            </form>
            <form action={clearOutboxAction}>
              <input type="hidden" name="which" value="queued" />
              <SubmitButton className={btnDanger} confirm="Cancel every queued email?">
                Cancel queued
              </SubmitButton>
            </form>
          </div>
        </Card>

        <Card title="SMTP settings">
          {envOverride && <p className="mb-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">SMTP_USER / SMTP_PASS are set in the environment and take priority over these fields.</p>}
          <form action={saveSmtpAction} className="grid gap-3 sm:grid-cols-2">
            <Field label="Host">
              <input name="host" defaultValue={smtp.host} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Port">
                <input name="port" type="number" defaultValue={smtp.port} className={inputCls} />
              </Field>
              <label className="flex items-center gap-2 pt-7 text-sm font-semibold">
                <input type="checkbox" name="secure" defaultChecked={smtp.secure} className="accent-brand-primary" /> SSL (465)
              </label>
            </div>
            <Field label="Username (Gmail address)">
              <input name="user" type="email" defaultValue={smtp.user} className={inputCls} />
            </Field>
            <Field label="App password" hint={smtp.passEnc ? "Saved (encrypted). Leave blank to keep it." : "Google Account → Security → App passwords"}>
              <input name="pass" type="password" autoComplete="new-password" placeholder={smtp.passEnc ? "••••••••••••••••" : ""} className={inputCls} />
            </Field>
            <Field label="From name">
              <input name="fromName" defaultValue={smtp.fromName} className={inputCls} />
            </Field>
            <Field label="From address" hint="Defaults to the username.">
              <input name="fromEmail" type="email" defaultValue={smtp.fromEmail} className={inputCls} />
            </Field>
            <Field label="Daily sending limit" hint="Gmail: about 500/day; Google Workspace: about 2,000/day.">
              <input name="dailyLimit" type="number" min={1} defaultValue={smtp.dailyLimit} className={inputCls} />
            </Field>
            <div className="flex items-end">
              <SubmitButton pendingText="Saving…">Save SMTP</SubmitButton>
            </div>
          </form>
          <form action={sendTestEmailAction} className="mt-4 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-4">
            <Field label="Send a test email to">
              <input name="to" type="email" placeholder="you@example.com" className={`${inputCls} !w-64`} />
            </Field>
            <SubmitButton className={btnSecondary} pendingText="Sending…">
              Send test
            </SubmitButton>
          </form>
        </Card>
      </div>

      <Card title="Automatic notices" className="mt-6">
        <form id="notices" action={saveNotificationsAction} className="space-y-4 scroll-mt-28">
          <p className="text-sm text-slate-500">
            Sent automatically as soon as the event happens. Use the placeholders listed for each notice; untick to stop sending it.
          </p>
          {NOTIFICATION_KEYS.map((k) => {
            const def = NOTIFICATION_DEFS[k];
            const t = notices[k];
            return (
              <details key={k} className="rounded-xl border border-slate-200">
                <summary className="flex cursor-pointer flex-wrap items-center gap-2 px-4 py-3">
                  <span className="font-bold text-brand-primary">{def.label}</span>
                  <StatusBadge status={t.enabled ? "sent" : "hidden"} />
                  <span className="text-xs text-slate-500">{def.when}</span>
                </summary>
                <div className="space-y-2 border-t border-slate-100 p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name={`${k}_enabled`} defaultChecked={t.enabled} className="accent-brand-primary" /> Send this notice
                  </label>
                  <input name={`${k}_subject`} defaultValue={t.subject} required className={inputCls} />
                  <textarea name={`${k}_body`} defaultValue={t.body} required rows={7} className={`${inputCls} font-mono text-sm`} />
                  <p className="text-xs text-slate-500">Placeholders: {def.placeholders.map((p) => `{{${p}}}`).join("  ")}</p>
                </div>
              </details>
            );
          })}
          <SubmitButton pendingText="Saving…">Save notices</SubmitButton>
        </form>
      </Card>

      <Card title="Recent emails" className="mt-6">
        {recent.length === 0 ? (
          <Empty>No emails yet.</Empty>
        ) : (
          <Table head={["To", "Subject", "Status", "Queued", "Sent"]}>
            {recent.map((m) => (
              <tr key={m.id}>
                <Td>{m.to_email}</Td>
                <Td>
                  {m.subject}
                  {m.attachment && <span className="ml-1 text-xs text-slate-400">(certificate)</span>}
                  {m.error && <div className="text-xs text-red-600">{m.error}</div>}
                </Td>
                <Td>
                  <StatusBadge status={m.status} />
                </Td>
                <Td className="whitespace-nowrap text-xs">{fmtIst(m.created_at)}</Td>
                <Td className="whitespace-nowrap text-xs">{m.sent_at ? fmtIst(m.sent_at) : "—"}</Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </PortalPage>
  );
}
