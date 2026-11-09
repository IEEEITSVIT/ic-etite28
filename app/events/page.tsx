import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { all } from "@/lib/db";
import { fmtIst } from "@/lib/portal/actions";
import { registrationWindow, type EventRow } from "@/lib/portal/events";
import { Empty, PortalPage, StatusBadge } from "@/components/portal/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/events", {
  title: "Events & Hackathons | ic-ETITE'28",
  description: "Register for hackathons, competitions and co-located events of ic-ETITE'28 at VIT Vellore.",
});

export const revalidate = 60;

export default async function EventsPage() {
  const events = await all<EventRow>("SELECT * FROM events WHERE visibility = 'public' AND status = 'active' ORDER BY starts_at IS NULL, starts_at").catch(() => []);
  return (
    <PortalPage title="Events & Hackathons" subtitle="Co-located events of ic-ETITE'28 at VIT Vellore.">
      {events.length === 0 ? (
        <Empty>No events are open right now. Check back soon.</Empty>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {events.map((e) => {
            const w = registrationWindow(e);
            return (
              <Link key={e.id} href={`/events/${e.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-brand-primary group-hover:text-brand-secondary">{e.title}</h2>
                  <StatusBadge status={w === "open" ? "registration open" : w === "not_open" ? "opens soon" : "closed"} />
                </div>
                {e.tagline && <p className="mb-4 text-slate-600">{e.tagline}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  {e.starts_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {fmtIst(e.starts_at)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> {e.participation === "solo" ? "Individual" : `Teams of ${e.min_team_size}–${e.max_team_size}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PortalPage>
  );
}
