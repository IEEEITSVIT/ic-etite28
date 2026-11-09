import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { all, first, parseJson } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { getEventById, getRounds, roundCriteria, roundFields } from "@/lib/portal/events";
import SubmissionValue from "@/components/portal/SubmissionValue";
import { evaluatorQualifyAction, saveScoreAction } from "@/app/actions/evaluate";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, Empty, Flash, PortalPage, btnSecondary, inputCls } from "@/components/portal/ui";
import { portalMetadata } from "@/lib/seo";

export const metadata = portalMetadata("Evaluate");

type SP = Promise<{ round?: string; q?: string; filter?: string; ok?: string; error?: string }>;

export default async function EvaluateEventPage({ params, searchParams }: { params: Promise<{ eventId: string }>; searchParams: SP }) {
  const { eventId } = await params;
  const sp = await searchParams;
  const user = await requireRole(["evaluator", "admin"], `/evaluate/${eventId}`);
  const event = await getEventById(eventId);
  if (!event) notFound();
  if (user.role !== "admin" && !(await first("SELECT 1 FROM event_evaluators WHERE event_id = ? AND user_id = ?", [eventId, user.id]))) {
    redirect("/evaluate?error=" + encodeURIComponent("You are not assigned to that event."));
  }
  const rounds = await getRounds(eventId);
  const round = rounds.find((r) => r.id === sp.round) ?? rounds[0];
  if (!round) {
    return (
      <PortalPage title={event.title}>
        <Empty>No rounds have been set up yet.</Empty>
      </PortalPage>
    );
  }
  const criteria = roundCriteria(round);
  const fields = roundFields(round, event);
  const like = sp.q ? `%${sp.q}%` : null;

  // Round 1 shows every team; later rounds only teams qualified in the previous round.
  const prev = rounds.find((r) => r.seq === round.seq - 1);
  const teams = await all<{ id: string; name: string; members: number }>(
    `SELECT t.id, t.name, (SELECT COUNT(*) FROM registrations r WHERE r.team_id = t.id) AS members FROM teams t
      WHERE t.event_id = ? ${prev ? "AND EXISTS (SELECT 1 FROM round_results rr WHERE rr.round_id = ? AND rr.team_id = t.id AND rr.qualified = 1)" : ""}
      ${like ? "AND (t.name LIKE ? OR t.code LIKE ?)" : ""} ORDER BY t.name`,
    [eventId, ...(prev ? [prev.id] : []), ...(like ? [like, like] : [])]
  );
  const [subs, mine, results, counts] = await Promise.all([
    all<{ team_id: string; data: string }>("SELECT team_id, data FROM submissions WHERE round_id = ?", [round.id]),
    all<{ team_id: string; scores: string; comment: string | null }>("SELECT team_id, scores, comment FROM scores WHERE round_id = ? AND evaluator_id = ?", [round.id, user.id]),
    all<{ team_id: string; qualified: number }>("SELECT team_id, qualified FROM round_results WHERE round_id = ?", [round.id]),
    all<{ team_id: string; n: number }>("SELECT team_id, COUNT(*) AS n FROM scores WHERE round_id = ? GROUP BY team_id", [round.id]),
  ]);
  const subMap = new Map(subs.map((s) => [s.team_id, parseJson<Record<string, string>>(s.data, {})]));
  const myMap = new Map(mine.map((m) => [m.team_id, { scores: parseJson<Record<string, number>>(m.scores, {}), comment: m.comment }]));
  const qualMap = new Map(results.map((r) => [r.team_id, r.qualified]));
  const countMap = new Map(counts.map((c) => [c.team_id, c.n]));
  const filter = sp.filter ?? "all";
  const shown = teams.filter((t) => (filter === "todo" ? !myMap.has(t.id) : filter === "done" ? myMap.has(t.id) : filter === "submitted" ? subMap.has(t.id) : true));
  const maxTotal = criteria.reduce((a, c) => a + c.max, 0);
  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ round: round.id, ...(sp.q ? { q: sp.q } : {}), filter, ...patch });
    return `/evaluate/${eventId}?${p}`;
  };

  return (
    <PortalPage
      title={event.title}
      subtitle={`${myMap.size} of ${teams.length} teams scored by you in ${round.name}`}
      width="max-w-6xl"
      actions={
        <Link href="/evaluate" className={btnSecondary}>
          All events
        </Link>
      }
    >
      <Flash ok={sp.ok} error={sp.error} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {rounds.map((r) => (
          <Link key={r.id} href={`/evaluate/${eventId}?round=${r.id}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${r.id === round.id ? "bg-[#002147] text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
            Round {r.seq}: {r.name}
          </Link>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {[
          ["all", "All"],
          ["todo", "Not scored by me"],
          ["done", "Scored by me"],
          ["submitted", "Has submission"],
        ].map(([k, label]) => (
          <Link key={k} href={qs({ filter: k })} className={`rounded-full px-3 py-1 text-sm ${filter === k ? "bg-[#FFB81C] font-bold text-[#002147]" : "bg-white text-slate-600 border border-slate-200"}`}>
            {label}
          </Link>
        ))}
        <form className="ml-auto flex gap-2">
          <input type="hidden" name="round" value={round.id} />
          <input type="hidden" name="filter" value={filter} />
          <input name="q" defaultValue={sp.q} placeholder="Search team or code" className={`${inputCls} !w-56 !py-2 !text-sm`} />
          <button className={btnSecondary}>Search</button>
        </form>
      </div>

      {shown.length === 0 ? (
        <Empty>{prev ? `No teams have qualified from ${prev.name} yet.` : "No teams match."}</Empty>
      ) : (
        <div className="space-y-3">
          {shown.map((t) => {
            const sub = subMap.get(t.id);
            const my = myMap.get(t.id);
            const myTotal = my ? criteria.reduce((a, c) => a + (my.scores[c.key] ?? 0), 0) : null;
            const qualified = qualMap.get(t.id) === 1;
            return (
              <details key={t.id} id={`team-${t.id}`} className="group scroll-mt-28 rounded-2xl border border-slate-200 bg-white shadow-sm" open={!my && filter === "todo"}>
                <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4">
                  <span className="text-lg font-bold text-[#002147]">{t.name}</span>
                  <span className="text-sm text-slate-500">{t.members} member(s)</span>
                  {sub ? <Badge tone="blue">Submitted</Badge> : <Badge>No submission</Badge>}
                  {my ? <Badge tone="green">Your score {Math.round(myTotal! * 100) / 100}/{maxTotal}</Badge> : <Badge tone="amber">Not scored</Badge>}
                  {qualified && <Badge tone="navy">Qualified</Badge>}
                  <span className="ml-auto text-xs text-slate-400">{countMap.get(t.id) ?? 0} evaluation(s)</span>
                </summary>
                <div className="grid gap-6 border-t border-slate-100 px-5 py-5 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">Submission</h3>
                    {sub ? (
                      <ul className="space-y-1.5 text-sm">
                        {fields.map((f) => (
                          <li key={f.key}>
                            <span className="font-semibold text-slate-700">{f.label}: </span>
                            <SubmissionValue field={f} value={sub[f.key]} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">This team has not submitted for this round.</p>
                    )}
                    <form action={evaluatorQualifyAction} className="mt-5">
                      <input type="hidden" name="event_id" value={eventId} />
                      <input type="hidden" name="round_id" value={round.id} />
                      <input type="hidden" name="team_id" value={t.id} />
                      <input type="hidden" name="qualified" value={qualified ? "0" : "1"} />
                      <SubmitButton className={qualified ? btnSecondary : "rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"}>
                        {qualified ? "Remove qualification" : `Qualify for ${rounds.find((r) => r.seq === round.seq + 1)?.name ?? "next round"}`}
                      </SubmitButton>
                    </form>
                  </div>
                  <form action={saveScoreAction} className="space-y-3">
                    <input type="hidden" name="event_id" value={eventId} />
                    <input type="hidden" name="round_id" value={round.id} />
                    <input type="hidden" name="team_id" value={t.id} />
                    {sp.q && <input type="hidden" name="q" value={sp.q} />}
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Your scores</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {criteria.map((c) => (
                        <label key={c.key} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                          <span className="text-slate-700">{c.label}</span>
                          <span className="flex items-center gap-1">
                            <input
                              name={`crit_${c.key}`}
                              type="number"
                              step="0.5"
                              min={0}
                              max={c.max}
                              required
                              defaultValue={my?.scores[c.key] ?? ""}
                              className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-right"
                            />
                            <span className="text-slate-400">/{c.max}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <textarea name="comment" rows={2} defaultValue={my?.comment ?? ""} placeholder="Comments (visible to organisers only)" className={`${inputCls} !text-sm`} />
                    <SubmitButton pendingText="Saving…">{my ? "Update score" : "Save score"}</SubmitButton>
                  </form>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </PortalPage>
  );
}
