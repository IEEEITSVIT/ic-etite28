import Link from "next/link";
import { all } from "@/lib/db";
import { registrationWindow, type EventRow } from "@/lib/portal/events";
import EventForm from "@/components/admin/EventForm";
import { Card, Empty, Flash, PortalPage, StatusBadge, Table, Td } from "@/components/portal/ui";

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string; new?: string }> }) {
  const { ok, error, new: showNew } = await searchParams;
  const events = await all<EventRow & { regs: number; teams: number }>(
    `SELECT e.*, (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) AS regs,
            (SELECT COUNT(*) FROM teams t WHERE t.event_id = e.id) AS teams
       FROM events e ORDER BY e.created_at DESC`
  );
  return (
    <PortalPage title="Events & BOLT" subtitle="Hackathons and competitions with registration, teams, rounds, scoring, results and certificates." width="max-w-7xl">
      <Flash ok={ok} error={error} />
      <div className="space-y-6">
        <Card title="Events">
          {events.length === 0 ? (
            <Empty>No events yet. Create BOLT 3.0 below.</Empty>
          ) : (
            <Table head={["Event", "Visibility", "Registration", "Participants", "Teams", ""]}>
              {events.map((e) => (
                <tr key={e.id}>
                  <Td>
                    <div className="font-bold text-[#002147]">{e.title}</div>
                    <div className="text-xs text-slate-500">/events/{e.slug}</div>
                  </Td>
                  <Td>
                    <StatusBadge status={e.status === "archived" ? "archived" : e.visibility} />
                  </Td>
                  <Td>
                    <StatusBadge status={{ open: "open", not_open: "not open", closed: "closed" }[registrationWindow(e)]} />
                  </Td>
                  <Td>{e.regs}</Td>
                  <Td>{e.participation === "team" ? e.teams : "—"}</Td>
                  <Td className="text-right">
                    <Link href={`/admin/events/${e.id}`} className="font-semibold text-[#004B87] hover:underline">
                      Manage →
                    </Link>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
        <details open={showNew === "1" || events.length === 0} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <summary className="cursor-pointer text-lg font-bold text-[#002147]">Create a new event</summary>
          <div className="mt-5">
            <EventForm />
          </div>
        </details>
      </div>
    </PortalPage>
  );
}
