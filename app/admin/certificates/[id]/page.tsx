import Link from "next/link";
import { notFound } from "next/navigation";
import { all, first, parseJson } from "@/lib/db";
import { fmtIst } from "@/lib/portal/actions";
import { DEFAULT_LAYOUT, type CertLayout } from "@/lib/certificates/render";
import { deleteBatchAction, deleteRecipientAction, emailBatchAction, updateBatchAction } from "@/app/actions/admin-batches";
import ExcelImport from "@/components/admin/ExcelImport";
import CertificateManager, { type TemplateMeta } from "@/components/admin/CertificateManager";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, Card, Empty, Field, Flash, PortalPage, Stat, Table, Td, btnDanger, btnGold, btnSecondary, inputCls } from "@/components/portal/ui";

type SP = Promise<{ ok?: string; error?: string; q?: string }>;

export default async function CertificateBatchPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const { id } = await params;
  const { ok, error, q } = await searchParams;
  const b = await first<{ id: string; title: string; event_label: string | null; issue_date: string | null; columns: string }>("SELECT * FROM certificate_batches WHERE id = ?", [id]);
  if (!b) notFound();
  const scope = `batch:${id}`;
  const back = `/admin/certificates/${id}`;
  const like = q ? `%${q}%` : null;

  const [recipients, counts, tplRows] = await Promise.all([
    // `has_account` shows who will see the certificate in their dashboard right away.
    all<{ id: string; email: string; name: string; data: string; emailed_at: string | null; has_account: number }>(
      `SELECT r.id, r.email, r.name, r.data, r.emailed_at,
              EXISTS (SELECT 1 FROM users u WHERE u.email = r.email) AS has_account
         FROM certificate_batch_recipients r
        WHERE r.batch_id = ? ${like ? "AND (r.name LIKE ? OR r.email LIKE ?)" : ""}
        ORDER BY r.name LIMIT 1000`,
      like ? [id, like, like] : [id]
    ),
    first<{ total: number; emailed: number; accounts: number }>(
      `SELECT COUNT(*) AS total, SUM(emailed_at IS NOT NULL) AS emailed,
              SUM(EXISTS (SELECT 1 FROM users u WHERE u.email = r.email)) AS accounts
         FROM certificate_batch_recipients r WHERE r.batch_id = ?`,
      [id]
    ),
    all<{ kind: "participation" | "winner"; width: number; height: number; mime: string; layout: string; released: number; updated_at: string }>(
      "SELECT kind, width, height, mime, layout, released, updated_at FROM certificate_templates WHERE scope = ?",
      [scope]
    ),
  ]);
  const templates: TemplateMeta[] = tplRows.map((r) => ({ ...r, layout: parseJson<CertLayout>(r.layout, DEFAULT_LAYOUT) }));
  const columns = parseJson<string[]>(b.columns, []);
  const total = counts?.total ?? 0;

  return (
    <PortalPage
      title={b.title}
      subtitle={b.event_label ?? "Certificate batch"}
      width="max-w-7xl"
      actions={
        <Link href="/admin/certificates" className={btnSecondary}>
          All batches
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Recipients" value={total} />
        <Stat label="Have a portal login" value={counts?.accounts ?? 0} hint="see it in their dashboard" />
        <Stat label="Emailed" value={counts?.emailed ?? 0} />
        <Stat label="Portal access" value={templates[0]?.released ? "Released" : "Not released"} />
      </div>

      <div className="space-y-6">
        <Card title="1. Details">
          <form action={updateBatchAction} className="grid gap-3 md:grid-cols-4">
            <input type="hidden" name="id" value={id} />
            <Field label="Title" className="md:col-span-2">
              <input name="title" defaultValue={b.title} required className={inputCls} />
            </Field>
            <Field label="Event printed on certificates">
              <input name="event_label" defaultValue={b.event_label ?? ""} className={inputCls} />
            </Field>
            <Field label="Date printed">
              <input name="issue_date" type="date" defaultValue={b.issue_date ?? ""} className={inputCls} />
            </Field>
            <div className="md:col-span-4">
              <SubmitButton pendingText="Saving…">Save details</SubmitButton>
            </div>
          </form>
        </Card>

        <Card title="2. Import recipients from Excel / CSV">
          <ExcelImport batchId={id} hasRecipients={total > 0} />
        </Card>

        <Card
          title={`Recipients (${total})`}
          actions={
            <form className="flex gap-2">
              <input name="q" defaultValue={q} placeholder="Search name or email" className={`${inputCls} !w-56 !py-2 !text-sm`} />
              <button className={btnSecondary}>Search</button>
            </form>
          }
        >
          {recipients.length === 0 ? (
            <Empty>{q ? "No recipients match." : "Import a sheet to add recipients."}</Empty>
          ) : (
            <Table head={["Name", "Email", ...columns.slice(0, 3), "Portal", "Emailed", ""]}>
              {recipients.map((r) => {
                const d = parseJson<Record<string, string>>(r.data, {});
                return (
                  <tr key={r.id}>
                    <Td className="font-semibold">{r.name}</Td>
                    <Td className="text-xs">{r.email}</Td>
                    {columns.slice(0, 3).map((c) => (
                      <Td key={c} className="text-xs">
                        {d[c] ?? ""}
                      </Td>
                    ))}
                    <Td>{r.has_account ? <Badge tone="green">has login</Badge> : <Badge>on sign-up</Badge>}</Td>
                    <Td className="whitespace-nowrap text-xs">{r.emailed_at ? fmtIst(r.emailed_at) : "—"}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {templates.length > 0 && (
                          <a href={`/api/certificates?scope=${encodeURIComponent(scope)}&kind=participation&r=${r.id}`} className={btnSecondary}>
                            PDF
                          </a>
                        )}
                        <form action={deleteRecipientAction}>
                          <input type="hidden" name="batch_id" value={id} />
                          <input type="hidden" name="recipient_id" value={r.id} />
                          <SubmitButton className={btnDanger} confirm={`Remove ${r.name}?`}>
                            Remove
                          </SubmitButton>
                        </form>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
        </Card>

        <Card title="3. Design the certificate">
          <CertificateManager scope={scope} back={back} kinds={["participation"]} templates={templates} eligible={{ participation: total, winner: 0 }} />
          <p className="mt-3 text-sm text-slate-500">
            <strong>Release to recipients</strong> makes each certificate appear in the dashboard of whoever logs in with that email — including people who create an account later.
            {columns.length > 0 && <> Custom text can use {columns.map((c) => `{{${c}}}`).join(", ")}.</>}
          </p>
        </Card>

        <Card title="4. Email certificates">
          {templates.length === 0 ? (
            <Empty>Save a certificate template first.</Empty>
          ) : (
            <form action={emailBatchAction} className="space-y-3">
              <input type="hidden" name="id" value={id} />
              <input
                name="subject"
                required
                defaultValue={`Your certificate — ${b.event_label ?? b.title}`}
                className={inputCls}
              />
              <textarea
                name="body"
                required
                rows={6}
                defaultValue={`Dear {{name}},\n\nThank you for being part of {{event}}. Your certificate is attached.\n\nYou can also download it any time by logging in to the ic-ETITE'28 portal with this email address: {{portalUrl}}\n\nRegards,\nic-ETITE'28 Organising Committee`}
                className={`${inputCls} font-mono text-sm`}
              />
              <p className="text-xs text-slate-500">Placeholders: {"{{name}} {{email}} {{event}} {{portalUrl}}"} {columns.map((c) => `{{${c}}}`).join(" ")}. The PDF is generated when each email is sent.</p>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="only_new" value="1" defaultChecked className="accent-[#002147]" /> Only people not emailed yet
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="only_new" value="0" className="accent-[#002147]" /> Everyone
                </label>
                <SubmitButton className={btnGold} pendingText="Queuing…" confirm="Queue certificate emails?">
                  Queue certificate emails
                </SubmitButton>
              </div>
            </form>
          )}
        </Card>

        <Card title="Delete batch">
          <form action={deleteBatchAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={id} />
            <Field label='Type "DELETE" to remove this batch, its recipients and template'>
              <input name="confirm" required autoComplete="off" className={`${inputCls} !w-56`} />
            </Field>
            <SubmitButton className={btnDanger} confirm="Delete this batch permanently?">
              Delete batch
            </SubmitButton>
          </form>
        </Card>
      </div>
    </PortalPage>
  );
}
