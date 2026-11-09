import Link from "next/link";
import { all, parseJson } from "@/lib/db";
import { formatInr, getSettings } from "@/lib/settings";
import { fmtIst } from "@/lib/portal/actions";
import { PAYMENT_STATUSES } from "@/lib/payments";
import { updateTechnextBookingAction } from "@/app/actions/admin-records";
import ScopeTools from "@/components/admin/ScopeTools";
import SubmitButton from "@/components/portal/SubmitButton";
import { Card, Empty, Field, Flash, PortalPage, Stat, StatusBadge, inputCls } from "@/components/portal/ui";

interface Booking {
  id: string;
  organization_name: string;
  organization_type: string;
  sector: string;
  contact_name: string;
  designation: string | null;
  email: string;
  phone: string;
  city: string;
  state: string | null;
  website: string | null;
  stall_type: string;
  representatives: string;
  exhibit_description: string;
  power_required: number;
  special_requirements: string | null;
  gst_number: string | null;
  status: string;
  admin_notes: string | null;
  payment_status: string;
  payment_amount: number;
  payment_ref: string | null;
  payment_link: string | null;
  created_at: string;
}

const small = `${inputCls} !py-1.5 !text-sm`;

export default async function AdminTechnextPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; status?: string }> }) {
  const { ok, error, status = "all" } = await searchParams;
  const settings = await getSettings();
  const stallLabel = new Map(settings.technext.stallTypes.map((s) => [s.key, s.label]));
  const bookings = await all<Booking>(`SELECT * FROM technext_bookings ${status !== "all" ? "WHERE status = ?" : ""} ORDER BY created_at DESC`, status !== "all" ? [status] : []);
  const stats = await all<{ status: string; n: number }>("SELECT status, COUNT(*) AS n FROM technext_bookings GROUP BY status");
  const count = (s: string) => stats.find((x) => x.status === s)?.n ?? 0;

  return (
    <PortalPage title="TechNext '28 stalls" subtitle="Review stall bookings, confirm payments and send updates to exhibitors." width="max-w-7xl">
      <Flash ok={ok} error={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Pending review" value={count("pending")} />
        <Stat label="Approved" value={count("approved")} />
        <Stat label="Rejected" value={count("rejected")} />
        <Stat label="Cancelled" value={count("cancelled")} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "approved", "rejected", "cancelled"].map((s) => (
          <Link key={s} href={`/admin/technext?status=${s}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${s === status ? "bg-[#002147] text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
            {s}
          </Link>
        ))}
      </div>
      {bookings.length === 0 ? (
        <Empty>No bookings{status !== "all" ? ` with status ${status}` : " yet"}.</Empty>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <details key={b.id} id={`b-${b.id}`} className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                <span className="font-bold text-[#002147]">{b.organization_name}</span>
                <span className="text-sm text-slate-500">
                  {stallLabel.get(b.stall_type) ?? b.stall_type} · {b.organization_type} · {b.city}
                </span>
                <StatusBadge status={b.status} />
                <StatusBadge status={b.payment_status} />
                <span className="ml-auto text-xs text-slate-400">{fmtIst(b.created_at)}</span>
              </summary>
              <div className="grid gap-6 border-t border-slate-100 px-5 py-5 lg:grid-cols-2">
                <dl className="grid grid-cols-[140px_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-slate-500">Contact</dt>
                  <dd>
                    {b.contact_name}
                    {b.designation && `, ${b.designation}`}
                  </dd>
                  <dt className="text-slate-500">Email / phone</dt>
                  <dd>
                    {b.email} · {b.phone}
                  </dd>
                  <dt className="text-slate-500">Sector</dt>
                  <dd>{b.sector}</dd>
                  <dt className="text-slate-500">Location</dt>
                  <dd>
                    {b.city}
                    {b.state && `, ${b.state}`}
                  </dd>
                  {b.website && (
                    <>
                      <dt className="text-slate-500">Website</dt>
                      <dd>
                        <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-[#004B87] underline">
                          {b.website}
                        </a>
                      </dd>
                    </>
                  )}
                  <dt className="text-slate-500">Representatives</dt>
                  <dd>{parseJson<string[]>(b.representatives, []).join(", ")}</dd>
                  <dt className="text-slate-500">Power</dt>
                  <dd>{b.power_required ? "Required" : "Not required"}</dd>
                  {b.gst_number && (
                    <>
                      <dt className="text-slate-500">GSTIN</dt>
                      <dd>{b.gst_number}</dd>
                    </>
                  )}
                  <dt className="text-slate-500">Exhibit</dt>
                  <dd className="whitespace-pre-line">{b.exhibit_description}</dd>
                  {b.special_requirements && (
                    <>
                      <dt className="text-slate-500">Requirements</dt>
                      <dd className="whitespace-pre-line">{b.special_requirements}</dd>
                    </>
                  )}
                </dl>
                <form action={updateTechnextBookingAction} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="filter" value={status} />
                  <Field label="Booking status" hint="Approving or rejecting emails the exhibitor.">
                    <select name="status" defaultValue={b.status} className={small}>
                      {["pending", "approved", "rejected", "cancelled"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={`Amount (${formatInr(b.payment_amount)})`}>
                    <input name="payment_amount" type="number" min={0} defaultValue={b.payment_amount} className={small} />
                  </Field>
                  <Field label="Payment status">
                    <select name="payment_status" defaultValue={b.payment_status} className={small}>
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Payment reference / UTR">
                    <input name="payment_ref" defaultValue={b.payment_ref ?? ""} className={small} />
                  </Field>
                  <Field label="Payment link for this booking" className="sm:col-span-2" hint="Overrides the global TechNext payment link.">
                    <input name="payment_link" type="url" defaultValue={b.payment_link ?? ""} placeholder="https://" className={small} />
                  </Field>
                  <Field label="Note to exhibitor (shown on their booking page)" className="sm:col-span-2">
                    <textarea name="admin_notes" rows={2} defaultValue={b.admin_notes ?? ""} className={small} />
                  </Field>
                  <div className="sm:col-span-2">
                    <SubmitButton pendingText="Saving…">Save</SubmitButton>
                  </div>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
      <ScopeTools scope="technext" back={`/admin/technext?status=${status}`} label="exhibitors" />
    </PortalPage>
  );
}
