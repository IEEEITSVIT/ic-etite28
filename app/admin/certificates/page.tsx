import Link from "next/link";
import { all } from "@/lib/db";
import { fmtIst } from "@/lib/portal/actions";
import { createBatchAction } from "@/app/actions/admin-batches";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Field, Flash, PortalPage, StatusBadge, Table, Td, inputCls } from "@/components/portal/ui";

export default async function CertificateBatchesPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const batches = await all<{ id: string; title: string; event_label: string | null; created_at: string; recipients: number; emailed: number; released: number | null }>(
    `SELECT b.id, b.title, b.event_label, b.created_at,
            (SELECT COUNT(*) FROM certificate_batch_recipients r WHERE r.batch_id = b.id) AS recipients,
            (SELECT COUNT(*) FROM certificate_batch_recipients r WHERE r.batch_id = b.id AND r.emailed_at IS NOT NULL) AS emailed,
            (SELECT released FROM certificate_templates t WHERE t.scope = 'batch:' || b.id) AS released
       FROM certificate_batches b ORDER BY b.created_at DESC`
  );
  return (
    <PortalPage
      title="Certificates from Excel"
      subtitle="For workshops, sessions, volunteers, judges — any list. Import a sheet, design the certificate, then email it or release it to each person's portal login (matched by email)."
      width="max-w-7xl"
    >
      <Flash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card title="Batches">
          {batches.length === 0 ? (
            <Empty>No certificate batches yet.</Empty>
          ) : (
            <Table head={["Batch", "Recipients", "Emailed", "Portal", "Created", ""]}>
              {batches.map((b) => (
                <tr key={b.id}>
                  <Td>
                    <div className="font-bold text-[#002147]">{b.title}</div>
                    {b.event_label && <div className="text-xs text-slate-500">{b.event_label}</div>}
                  </Td>
                  <Td>{b.recipients}</Td>
                  <Td>{b.emailed}</Td>
                  <Td>
                    <StatusBadge status={b.released ? "released" : b.released === 0 ? "draft" : "no template"} />
                  </Td>
                  <Td className="whitespace-nowrap text-xs">{fmtIst(b.created_at)}</Td>
                  <Td className="text-right">
                    <Link href={`/admin/certificates/${b.id}`} className="font-semibold text-[#004B87] hover:underline">
                      Open →
                    </Link>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
        <Card title="New batch">
          <form action={createBatchAction} className="space-y-3">
            <Field label="Title">
              <input name="title" required placeholder="Pre-conference workshop — participants" className={inputCls} />
            </Field>
            <Field label="Event name printed on certificates" hint="Optional; a column named 'event' in the sheet overrides it per row.">
              <input name="event_label" placeholder="Workshop on Quantum Machine Learning" className={inputCls} />
            </Field>
            <Field label="Date printed on certificates">
              <input name="issue_date" type="date" className={inputCls} />
            </Field>
            <SubmitButton pendingText="Creating…">Create batch</SubmitButton>
          </form>
        </Card>
      </div>
    </PortalPage>
  );
}
