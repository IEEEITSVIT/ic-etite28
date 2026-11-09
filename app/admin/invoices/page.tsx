import { listInvoices } from "@/lib/invoices";
import { formatMoney } from "@/lib/settings";
import { fmtIst } from "@/lib/portal/actions";
import { resendInvoiceAction } from "@/app/actions/admin-records";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Flash, PortalPage, Stat, Table, Td, btnSecondary } from "@/components/portal/ui";

const PURPOSE = { conference: "Conference", technext: "TechNext", event: "Event" } as const;

export default async function AdminInvoicesPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const invoices = await listInvoices();
  const totals = invoices.reduce<Record<string, number>>((acc, i) => ({ ...acc, [i.currency]: (acc[i.currency] ?? 0) + i.amount }), {});
  return (
    <PortalPage
      title="Invoices"
      subtitle="Issued automatically with a unique number when a payment is marked paid or confirmed by the gateway. Edit the layout under Site content → Invoice template."
      width="max-w-7xl"
    >
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Invoices" value={invoices.length} />
        {Object.entries(totals).map(([cur, sum]) => (
          <Stat key={cur} label={`Collected (${cur})`} value={formatMoney(sum, cur)} />
        ))}
      </div>
      <Card title="All invoices">
        {invoices.length === 0 ? (
          <Empty>No invoices yet. They appear here when a registration is paid.</Empty>
        ) : (
          <Table head={["Number", "Date", "Billed to", "For", "Amount", ""]}>
            {invoices.map((i) => (
              <tr key={i.id}>
                <Td className="font-mono text-xs font-bold text-brand-primary">{i.number}</Td>
                <Td className="whitespace-nowrap text-xs">{fmtIst(i.issued_at)}</Td>
                <Td>
                  <div className="font-semibold">{i.bill_name}</div>
                  <div className="text-xs text-slate-500">{i.bill_email}</div>
                </Td>
                <Td>{PURPOSE[i.purpose]}</Td>
                <Td className="whitespace-nowrap font-semibold">{formatMoney(i.amount, i.currency)}</Td>
                <Td className="text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/api/invoices?id=${i.id}&inline=1`} target="_blank" className={btnSecondary}>
                      PDF
                    </a>
                    <form action={resendInvoiceAction}>
                      <input type="hidden" name="id" value={i.id} />
                      <SubmitButton className={btnSecondary} pendingText="…" confirm={`Email invoice ${i.number} to ${i.bill_email} again?`}>
                        Resend
                      </SubmitButton>
                    </form>
                  </div>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </PortalPage>
  );
}
