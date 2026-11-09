import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { all } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import type { EventRow } from "@/lib/portal/events";
import { Empty, Flash, PortalPage, StatusBadge, btnSecondary } from "@/components/portal/ui";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Evaluate");

export default async function EvaluatePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const user = await requireRole(["evaluator", "admin"], "/evaluate");
  const events =
    user.role === "admin"
      ? await all<EventRow & { teams: number }>("SELECT e.*, (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS teams FROM events e WHERE status = 'active' ORDER BY created_at DESC")
      : await all<EventRow & { teams: number }>(
          `SELECT e.*, (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS teams FROM events e
             JOIN event_evaluators ev ON ev.event_id = e.id WHERE ev.user_id = ? AND e.status = 'active' ORDER BY e.created_at DESC`,
          [user.id]
        );
  return (
    <PortalPage
      title="Evaluation"
      subtitle="Score teams round by round and mark who qualifies for the next round."
      actions={
        <Link href="/dashboard" className={btnSecondary}>
          Dashboard
        </Link>
      }
    >
      <Flash ok={ok} error={error} />
      {events.length === 0 ? (
        <Empty>No events are assigned to you yet. The organisers will assign you to an event.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} href={`/evaluate/${e.id}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
              <div>
                <div className="text-lg font-extrabold text-brand-primary">{e.title}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  {e.teams} {e.participation === "team" ? "teams" : "participants"} <StatusBadge status={e.visibility} />
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </Link>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
