import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { first } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { isSmtpConfigured } from "@/lib/email/mailer";
import { Card, PortalPage, Stat, StatusBadge } from "@/components/portal/ui";

export default async function AdminHome() {
  const [s, c, smtp] = await Promise.all([
    getSettings(),
    first<{ users: number; events: number; regs: number; technext: number; technext_pending: number; conf: number; conf_due: number; queued: number }>(
      `SELECT (SELECT COUNT(*) FROM users) AS users,
              (SELECT COUNT(*) FROM events WHERE status = 'active') AS events,
              (SELECT COUNT(*) FROM registrations) AS regs,
              (SELECT COUNT(*) FROM technext_bookings WHERE status != 'cancelled') AS technext,
              (SELECT COUNT(*) FROM technext_bookings WHERE status = 'pending') AS technext_pending,
              (SELECT COUNT(*) FROM conference_registrations) AS conf,
              (SELECT COUNT(*) FROM conference_registrations WHERE payment_status IN ('unpaid','pending')) AS conf_due,
              (SELECT COUNT(*) FROM email_outbox WHERE status = 'queued') AS queued`
    ),
    isSmtpConfigured(),
  ]);

  const tile = (href: string, title: string, body: React.ReactNode) => (
    <Link href={href} className="group flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="font-bold text-[#002147]">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{body}</div>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-[#002147]" />
    </Link>
  );

  return (
    <PortalPage title="Admin portal" subtitle="Manage site content, events, registrations, emails and certificates." width="max-w-7xl">
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Accounts" value={c?.users ?? 0} />
        <Stat label="Event registrations" value={c?.regs ?? 0} hint={`${c?.events ?? 0} active event(s)`} />
        <Stat label="Conference" value={c?.conf ?? 0} hint={`${c?.conf_due ?? 0} payment(s) due`} />
        <Stat label="TechNext stalls" value={c?.technext ?? 0} hint={`${c?.technext_pending ?? 0} awaiting review`} />
      </div>
      {!smtp && (
        <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          SMTP is not configured, so verification codes and emails cannot be sent.{" "}
          <Link href="/admin/email" className="font-bold underline">
            Set up Gmail SMTP
          </Link>
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tile("/admin/settings", "Site content (CMS)", "Important dates, registration fees, BOLT/TechNext visibility, stall prices and payment links.")}
        {tile("/admin/events", "Events & BOLT", "Create events, invite lists, teams, rounds, scoring, results, emails, certificates and exports.")}
        {tile("/admin/technext", "TechNext stalls", `${c?.technext_pending ?? 0} booking(s) awaiting review.`)}
        {tile("/admin/conference", "Conference registrations", `${c?.conf_due ?? 0} registration(s) with payment due.`)}
        {tile("/admin/users", "Users & evaluators", "Roles, evaluator invitations and manual email verification.")}
        {tile("/admin/email", "Email & SMTP", `${c?.queued ?? 0} email(s) queued.`)}
      </div>
      <Card title="Public visibility" className="mt-6">
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="flex items-center gap-2">BOLT <StatusBadge status={s.visibility.bolt ? "public" : "hidden"} /></span>
          <span className="flex items-center gap-2">TechNext <StatusBadge status={s.visibility.technext ? "public" : "hidden"} /></span>
          <span className="flex items-center gap-2">Conference registration <StatusBadge status={s.visibility.conferenceRegistration ? "open" : "closed"} /></span>
          <span className="flex items-center gap-2">Stall booking <StatusBadge status={s.visibility.technextRegistration ? "open" : "closed"} /></span>
        </div>
      </Card>
    </PortalPage>
  );
}
