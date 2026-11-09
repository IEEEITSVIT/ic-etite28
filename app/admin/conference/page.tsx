import { all } from "@/lib/db";
import { formatMoney } from "@/lib/settings";
import { fmtIst } from "@/lib/portal/actions";
import { PAYMENT_STATUSES } from "@/lib/payments";
import { updateConferenceRegistrationAction } from "@/app/actions/admin-records";
import ScopeTools from "@/components/admin/ScopeTools";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Flash, PortalPage, Stat, StatusBadge, Table, Td, btnSecondary, inputCls } from "@/components/portal/ui";

const small = `${inputCls} !py-1.5 !text-sm`;

export default async function AdminConferencePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; q?: string }> }) {
  const { ok, error, q } = await searchParams;
  const like = q ? `%${q}%` : null;
  const rows = await all<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    category_label: string;
    residency: string;
    ieee_member: number;
    ieee_number: string | null;
    affiliation: string;
    country: string;
    paper_ids: string | null;
    presenting_author: number;
    status: string;
    payment_status: string;
    payment_amount: number;
    payment_currency: string;
    payment_ref: string | null;
    payment_link: string | null;
    admin_notes: string | null;
    created_at: string;
  }>(
    `SELECT c.*, u.name, u.email, u.phone FROM conference_registrations c JOIN users u ON u.id = c.user_id
      ${like ? "WHERE u.name LIKE ? OR u.email LIKE ? OR c.paper_ids LIKE ? OR c.affiliation LIKE ?" : ""} ORDER BY c.created_at DESC`,
    like ? [like, like, like, like] : []
  );
  const totals = await all<{ status: string; payment_status: string; n: number }>("SELECT status, payment_status, COUNT(*) AS n FROM conference_registrations GROUP BY status, payment_status");
  const sum = (f: (t: (typeof totals)[number]) => boolean) => totals.filter(f).reduce((a, t) => a + t.n, 0);

  return (
    <PortalPage title="Conference registrations" subtitle="Confirm delegates once payment is reconciled." width="max-w-7xl">
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Registrations" value={sum(() => true)} />
        <Stat label="Confirmed" value={sum((t) => t.status === "confirmed")} />
        <Stat label="Payment due" value={sum((t) => t.payment_status === "unpaid" || t.payment_status === "pending")} />
        <Stat label="Paid" value={sum((t) => t.payment_status === "paid")} />
      </div>
      <Card
        title="Registrations"
        actions={
          <form className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Name, email, paper ID, affiliation" className={`${small} !w-72`} />
            <button className={btnSecondary}>Search</button>
          </form>
        }
      >
        {rows.length === 0 ? (
          <Empty>No registrations{q ? " match that search" : " yet"}.</Empty>
        ) : (
          <Table head={["Delegate", "Category", "Paper", "Amount", "Update"]}>
            {rows.map((r) => (
              <tr key={r.id} id={`r-${r.id}`} className="scroll-mt-28">
                <Td>
                  <div className="font-semibold text-slate-800">{r.name}</div>
                  <div className="text-xs text-slate-500">
                    {r.email}
                    {r.phone && ` · ${r.phone}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.affiliation}, {r.country}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{fmtIst(r.created_at)}</div>
                </Td>
                <Td>
                  {r.category_label}
                  <div className="text-xs text-slate-500">
                    {r.residency === "foreign" ? "Foreign" : "Indian"}
                    {r.ieee_member ? ` · IEEE ${r.ieee_number ?? ""}` : ""}
                  </div>
                </Td>
                <Td>
                  {r.paper_ids ?? "—"}
                  {r.presenting_author ? <div className="text-xs text-slate-500">Presenting author</div> : null}
                </Td>
                <Td className="whitespace-nowrap font-semibold">{formatMoney(r.payment_amount, r.payment_currency)}</Td>
                <Td>
                  <form action={updateConferenceRegistrationAction} className="grid min-w-[300px] grid-cols-2 gap-1.5">
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} className={small} aria-label="Registration status">
                      {["pending", "confirmed", "cancelled"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <select name="payment_status" defaultValue={r.payment_status} className={small} aria-label="Payment status">
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    <input name="payment_ref" defaultValue={r.payment_ref ?? ""} placeholder="Ref / UTR" className={small} />
                    <input name="payment_link" type="url" defaultValue={r.payment_link ?? ""} placeholder="Payment link" className={small} />
                    <input name="admin_notes" defaultValue={r.admin_notes ?? ""} placeholder="Internal note" className={`${small} col-span-2`} />
                    <div className="col-span-2 flex items-center gap-2">
                      <SubmitButton className={btnSecondary} pendingText="…">
                        Save
                      </SubmitButton>
                      <StatusBadge status={r.status} />
                      <StatusBadge status={r.payment_status} />
                    </div>
                  </form>
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <ScopeTools scope="conference" back="/admin/conference" label="delegates" />
    </PortalPage>
  );
}
