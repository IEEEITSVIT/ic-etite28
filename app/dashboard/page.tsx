import Link from "next/link";
import { ArrowRight, Award, ClipboardCheck, Settings2, Store, Ticket, Trophy } from "lucide-react";
import { all, first } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { formatMoney, getSettings } from "@/lib/settings";
import { registrationWindow, type EventRow } from "@/lib/portal/events";
import { logoutAction } from "@/app/actions/auth";
import PaymentCard from "@/components/portal/PaymentCard";
import { Badge, Card, Empty, Flash, PortalPage, StatusBadge, btnGold, btnPrimary, btnSecondary } from "@/components/portal/ui";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Dashboard");

type SP = Promise<{ ok?: string; error?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const { ok, error } = await searchParams;
  const user = await requireUser("/dashboard");
  const settings = await getSettings();

  const [myEvents, openEvents, conference, booking, releasedCerts] = await Promise.all([
    all<EventRow & { team_name: string | null; member_role: string; payment_status: string }>(
      `SELECT e.*, t.name AS team_name, r.member_role, r.payment_status
         FROM registrations r JOIN events e ON e.id = r.event_id LEFT JOIN teams t ON t.id = r.team_id
        WHERE r.user_id = ? ORDER BY r.registered_at DESC`,
      [user.id]
    ),
    all<EventRow>(
      `SELECT * FROM events WHERE visibility = 'public' AND status = 'active'
         AND id NOT IN (SELECT event_id FROM registrations WHERE user_id = ?) ORDER BY starts_at`,
      [user.id]
    ),
    first<{ id: string; category_label: string; status: string; payment_status: string; payment_amount: number; payment_currency: string }>(
      "SELECT id, category_label, status, payment_status, payment_amount, payment_currency FROM conference_registrations WHERE user_id = ?",
      [user.id]
    ),
    first<{ id: string; organization_name: string; stall_type: string; status: string; payment_status: string; payment_amount: number; payment_currency: string }>(
      "SELECT id, organization_name, stall_type, status, payment_status, payment_amount, payment_currency FROM technext_bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [user.id]
    ),
    all<{ scope: string; kind: string }>("SELECT scope, kind FROM certificate_templates WHERE released = 1 AND scope IN ('technext','conference')"),
  ]);
  const invoices = await all<{ id: string; number: string; amount: number; currency: string; issued_at: string; items: string }>(
    "SELECT id, number, amount, currency, issued_at, items FROM invoices WHERE user_id = ? ORDER BY seq DESC",
    [user.id]
  );

  const certLinks = releasedCerts.filter(
    (c) => (c.scope === "conference" && conference?.status === "confirmed") || (c.scope === "technext" && booking?.status === "approved")
  );
  const openToJoin = openEvents.filter((e) => registrationWindow(e) === "open");

  return (
    <PortalPage
      title={`Welcome, ${user.name.split(" ")[0]}`}
      subtitle={user.email}
      actions={
        <>
          {user.role === "admin" && (
            <Link href="/admin" className={btnPrimary}>
              <Settings2 className="h-4 w-4" /> Admin portal
            </Link>
          )}
          {(user.role === "evaluator" || user.role === "admin") && (
            <Link href="/evaluate" className={btnSecondary}>
              <ClipboardCheck className="h-4 w-4" /> Evaluate
            </Link>
          )}
          <Link href="/dashboard/profile" className={btnSecondary}>
            Profile
          </Link>
          <form action={logoutAction}>
            <button className={btnSecondary}>Log out</button>
          </form>
        </>
      }
    >
      <Flash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conference registration */}
        <Card title={<span className="flex items-center gap-2"><Ticket className="h-5 w-5 text-[#004B87]" /> ic-ETITE&apos;28 registration</span>}>
          {conference ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-800">{conference.category_label}</span>
                <StatusBadge status={conference.status} />
              </div>
              <PaymentCard
                purpose="conference"
                refId={conference.id}
                amount={conference.payment_amount}
                currency={conference.payment_currency}
                status={conference.payment_status}
                back="/dashboard"
              />
              <Link href="/registration/apply" className="text-sm font-semibold text-[#004B87] hover:underline">
                View or edit registration
              </Link>
            </div>
          ) : settings.visibility.conferenceRegistration ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-slate-600">Register as an author, delegate or participant.</p>
              <Link href="/registration/apply" className={btnGold}>
                Register <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <Empty>Conference registration will open soon.</Empty>
          )}
        </Card>

        {/* TechNext */}
        {(settings.visibility.technext || booking) && (
          <Card title={<span className="flex items-center gap-2"><Store className="h-5 w-5 text-[#F37021]" /> TechNext &apos;28 stall</span>}>
            {booking ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800">{booking.organization_name}</span>
                  <StatusBadge status={booking.status} />
                </div>
                {booking.status === "pending" && <p className="text-sm text-slate-600">Under review — payment opens once approved.</p>}
                {booking.status === "approved" && (
                  <PaymentCard
                    purpose="technext"
                    refId={booking.id}
                    amount={booking.payment_amount}
                    currency={booking.payment_currency}
                    status={booking.payment_status}
                    back="/dashboard"
                  />
                )}
                <Link href="/technext/register" className="text-sm font-semibold text-[#004B87] hover:underline">
                  View or edit booking
                </Link>
              </div>
            ) : settings.visibility.technextRegistration ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-slate-600">Exhibit your product or project at the industrial expo.</p>
                <Link href="/technext/register" className={btnGold}>
                  Book a stall <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <Empty>Stall bookings will open soon.</Empty>
            )}
          </Card>
        )}

        {/* Events */}
        <Card title={<span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-[#B45309]" /> My events</span>} className="lg:col-span-2">
          {myEvents.length === 0 ? (
            <Empty>You haven&apos;t registered for any events yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myEvents.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/events/${e.slug}`} className="font-bold text-[#002147] hover:underline">
                      {e.title}
                    </Link>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      {e.participation === "team" ? (e.team_name ? <>Team {e.team_name}{e.member_role === "lead" && <Badge tone="navy">Lead</Badge>}</> : <Badge tone="amber">No team yet</Badge>) : "Individual"}
                      {(e.payment_status === "unpaid" || e.payment_status === "pending") && <StatusBadge status={e.payment_status} />}
                    </div>
                  </div>
                  <Link href={`/events/${e.slug}`} className={btnSecondary}>
                    Open <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {openToJoin.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Open for registration</h3>
              <div className="flex flex-wrap gap-2">
                {openToJoin.map((e) => (
                  <Link key={e.id} href={`/events/${e.slug}`} className={btnGold}>
                    {e.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>

        {invoices.length > 0 && (
          <Card title="Invoices" className="lg:col-span-2">
            <ul className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                  <div>
                    <div className="font-mono text-sm font-bold text-[#002147]">{inv.number}</div>
                    <div className="text-xs text-slate-500">
                      {(JSON.parse(inv.items) as { description: string }[]).map((i) => i.description).join("; ")} · {formatMoney(inv.amount, inv.currency)}
                    </div>
                  </div>
                  <a href={`/api/invoices?id=${inv.id}`} className={btnSecondary}>
                    Download PDF
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {certLinks.length > 0 && (
          <Card title={<span className="flex items-center gap-2"><Award className="h-5 w-5 text-[#B45309]" /> Certificates</span>} className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {certLinks.map((c) => (
                <a key={`${c.scope}-${c.kind}`} href={`/api/certificates?scope=${c.scope}&kind=${c.kind}`} className={btnPrimary}>
                  {c.scope === "conference" ? "ic-ETITE'28" : "TechNext '28"} {c.kind} certificate
                </a>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-500">Event certificates are on each event&apos;s page.</p>
          </Card>
        )}
      </div>
    </PortalPage>
  );
}
