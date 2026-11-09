import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { all, first, parseJson } from "@/lib/db";
import { fmtIst, isoToIstInput } from "@/lib/portal/actions";
import { getEventById, getRounds, registrationWindow, roundCriteria, roundFields, roundLeaderboard, submissionFields } from "@/lib/portal/events";
import { PAYMENT_STATUSES } from "@/lib/payments";
import { audienceOptions, PLACEHOLDERS } from "@/lib/portal/audience";
import { certificateRecipients } from "@/lib/certificates/server";
import { DEFAULT_LAYOUT, rankLabel, type CertLayout } from "@/lib/certificates/render";
import {
  adminDeleteTeamAction,
  adminRemoveRegistrationAction,
  adminSetEventPaymentAction,
  assignEvaluatorsAction,
  autoRankAction,
  deleteEvaluationAction,
  deleteRoundAction,
  publishWinnersAction,
  purgeEventAction,
  qualifyTopAction,
  saveAllowlistAction,
  saveRanksAction,
  saveRoundAction,
  setRoundCountAction,
  setQualifiedAction,
  setRoundFlagAction,
} from "@/app/actions/admin-events";
import EventForm from "@/components/admin/EventForm";
import EmailComposer from "@/components/admin/EmailComposer";
import CertificateManager, { type TemplateMeta } from "@/components/admin/CertificateManager";
import SubmitButton from "@/components/portal/SubmitButton";
import { Badge, Card, Empty, Field, Flash, PortalPage, Stat, StatusBadge, Table, Tabs, Td, btnDanger, btnGold, btnPrimary, btnSecondary, inputCls } from "@/components/portal/ui";

type SP = Promise<{ tab?: string; ok?: string; error?: string; round?: string; q?: string }>;

const TABS = [
  ["settings", "Settings"],
  ["participants", "Participants & teams"],
  ["rounds", "Rounds & evaluators"],
  ["scores", "Scores & qualification"],
  ["results", "Results & winners"],
  ["emails", "Emails"],
  ["certificates", "Certificates"],
  ["export", "Export & purge"],
] as const;

const small = `${inputCls} !py-1.5 !text-sm`;

export default async function AdminEventPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = sp.tab ?? "settings";
  const event = await getEventById(id);
  if (!event) notFound();
  const base = `/admin/events/${id}`;
  const here = `${base}?tab=${tab}`;

  const [counts, rounds] = await Promise.all([
    first<{ regs: number; teams: number; unpaid: number; subs: number }>(
      `SELECT (SELECT COUNT(*) FROM registrations WHERE event_id = ?) AS regs,
              (SELECT COUNT(*) FROM teams WHERE event_id = ?) AS teams,
              (SELECT COUNT(*) FROM registrations WHERE event_id = ? AND payment_status IN ('unpaid','pending')) AS unpaid,
              (SELECT COUNT(*) FROM submissions s JOIN event_rounds r ON r.id = s.round_id WHERE r.event_id = ?) AS subs`,
      [id, id, id, id]
    ),
    getRounds(id),
  ]);

  return (
    <PortalPage
      title={event.title}
      subtitle={
        <span className="flex flex-wrap items-center gap-2">
          <StatusBadge status={event.status === "archived" ? "archived" : event.visibility} />
          <StatusBadge status={`registration ${registrationWindow(event).replace("_", " ")}`} />
          <Link href={`/events/${event.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary hover:underline">
            /events/{event.slug} <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </span>
      }
      width="max-w-7xl"
      actions={
        <Link href="/admin/events" className={btnSecondary}>
          All events
        </Link>
      }
    >
      <Flash ok={sp.ok} error={sp.error} />
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Registered" value={counts?.regs ?? 0} />
        <Stat label="Teams" value={event.participation === "team" ? (counts?.teams ?? 0) : "—"} />
        <Stat label="Payments due" value={counts?.unpaid ?? 0} />
        <Stat label="Submissions" value={counts?.subs ?? 0} hint={`${rounds.length} round(s)`} />
      </div>
      <Tabs items={TABS.map(([key, label]) => ({ key, label, href: `${base}?tab=${key}` }))} active={tab} />

      {tab === "settings" && (
        <Card title="Event settings">
          <EventForm event={event} />
        </Card>
      )}

      {tab === "participants" && <ParticipantsTab eventId={id} q={sp.q} />}
      {tab === "rounds" && <RoundsTab eventId={id} rounds={rounds} />}
      {tab === "scores" && <ScoresTab eventId={id} rounds={rounds} roundId={sp.round} />}
      {tab === "results" && <ResultsTab eventId={id} rounds={rounds} />}
      {tab === "emails" && <EmailsTab eventId={id} here={here} />}
      {tab === "certificates" && <CertificatesTab eventId={id} here={here} />}
      {tab === "export" && <ExportTab eventId={id} slug={event.slug} />}
    </PortalPage>
  );

  // ─── Tabs ───────────────────────────────────────────────────────────

  async function ParticipantsTab({ eventId, q }: { eventId: string; q?: string }) {
    const ev = event!;
    const like = q ? `%${q}%` : null;
    const rows = await all<{
      user_id: string;
      name: string;
      email: string;
      phone: string | null;
      institution: string | null;
      team_id: string | null;
      team: string | null;
      code: string | null;
      member_role: string;
      payment_status: string;
      payment_ref: string | null;
      registered_at: string;
    }>(
      `SELECT r.user_id, u.name, u.email, u.phone, u.institution, r.team_id, t.name AS team, t.code, r.member_role, r.payment_status, r.payment_ref, r.registered_at
         FROM registrations r JOIN users u ON u.id = r.user_id LEFT JOIN teams t ON t.id = r.team_id
        WHERE r.event_id = ? ${like ? "AND (u.name LIKE ? OR u.email LIKE ? OR t.name LIKE ? OR t.code LIKE ?)" : ""}
        ORDER BY t.name IS NULL, t.name, r.member_role = 'lead' DESC, u.name LIMIT 2000`,
      like ? [eventId, like, like, like, like] : [eventId]
    );
    const allowCount = await first<{ n: number }>("SELECT COUNT(*) AS n FROM event_allowlist WHERE event_id = ?", [eventId]);

    return (
      <div className="space-y-6">
        {ev.registration_mode === "allowlist" && (
          <Card title={`Invite list (${allowCount?.n ?? 0} emails)`}>
            <form action={saveAllowlistAction} className="space-y-3">
              <input type="hidden" name="event_id" value={eventId} />
              <textarea name="emails" rows={4} placeholder="Paste emails separated by commas, spaces or new lines" className={inputCls} />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="mode" value="append" defaultChecked className="accent-brand-primary" /> Add to list
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="mode" value="replace" className="accent-brand-primary" /> Replace list
                </label>
                <SubmitButton pendingText="Saving…">Save invite list</SubmitButton>
              </div>
            </form>
          </Card>
        )}
        <Card
          title={`Registrations (${rows.length})`}
          actions={
            <form className="flex gap-2">
              <input type="hidden" name="tab" value="participants" />
              <input name="q" defaultValue={q} placeholder="Search name, email, team, code" className={`${small} !w-64`} />
              <button className={btnSecondary}>Search</button>
            </form>
          }
        >
          {rows.length === 0 ? (
            <Empty>No registrations{q ? " match that search" : " yet"}.</Empty>
          ) : (
            <Table head={["Participant", "Team", "Payment", ""]}>
              {rows.map((r) => (
                <tr key={r.user_id}>
                  <Td>
                    <div className="font-semibold text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-500">
                      {r.email}
                      {r.phone && ` · ${r.phone}`}
                    </div>
                    {r.institution && <div className="text-xs text-slate-500">{r.institution}</div>}
                  </Td>
                  <Td>
                    {r.team ? (
                      <>
                        <span className="font-semibold">{r.team}</span> {r.member_role === "lead" && <Badge tone="navy">Lead</Badge>}
                        <div className="font-mono text-xs text-slate-500">{r.code}</div>
                      </>
                    ) : (
                      <Badge tone="amber">No team</Badge>
                    )}
                  </Td>
                  <Td>
                    <form action={adminSetEventPaymentAction} className="flex flex-wrap items-center gap-1.5">
                      <input type="hidden" name="event_id" value={eventId} />
                      <input type="hidden" name="user_id" value={r.user_id} />
                      <select name="status" defaultValue={r.payment_status} className={`${small} !w-32`}>
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <input name="payment_ref" defaultValue={r.payment_ref ?? ""} placeholder="Ref / UTR" className={`${small} !w-28`} />
                      <SubmitButton className={btnSecondary} pendingText="…">
                        Save
                      </SubmitButton>
                    </form>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {r.member_role === "lead" && r.team_id && ev.participation === "team" && (
                        <form action={adminDeleteTeamAction}>
                          <input type="hidden" name="event_id" value={eventId} />
                          <input type="hidden" name="team_id" value={r.team_id} />
                          <SubmitButton className={btnSecondary} confirm={`Delete team ${r.team}? Members stay registered.`}>
                            Delete team
                          </SubmitButton>
                        </form>
                      )}
                      <form action={adminRemoveRegistrationAction}>
                        <input type="hidden" name="event_id" value={eventId} />
                        <input type="hidden" name="user_id" value={r.user_id} />
                        <SubmitButton className={btnDanger} confirm={`Remove ${r.name} from this event?`}>
                          Remove
                        </SubmitButton>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          <p className="mt-3 text-xs text-slate-500">Showing up to 2,000 rows. Use Export for the complete data.</p>
        </Card>
      </div>
    );
  }

  async function RoundsTab({ eventId, rounds }: { eventId: string; rounds: Awaited<ReturnType<typeof getRounds>> }) {
    const [evaluators, assigned] = await Promise.all([
      all<{ id: string; name: string; email: string; role: string }>("SELECT id, name, email, role FROM users WHERE role IN ('evaluator','admin') ORDER BY role, name"),
      all<{ user_id: string }>("SELECT user_id FROM event_evaluators WHERE event_id = ?", [eventId]),
    ]);
    const assignedSet = new Set(assigned.map((a) => a.user_id));
    const eventDefaults = submissionFields(event!);
    const roundForm = (r?: (typeof rounds)[number]) => {
      const criteria = r ? roundCriteria(r) : [];
      const rows = [...criteria, ...Array.from({ length: Math.max(2, 6 - criteria.length) }, () => null)].slice(0, 10);
      const mode = !r || r.submission_fields == null ? "default" : r.submission_fields === "[]" ? "none" : "custom";
      const own = r && mode === "custom" ? roundFields(r, event!) : [];
      const subRows = [...own, ...Array.from({ length: 6 - own.length }, () => null)].slice(0, 6);
      return (
        <form action={saveRoundAction} className="space-y-3">
          <input type="hidden" name="event_id" value={eventId} />
          {r && <input type="hidden" name="round_id" value={r.id} />}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Round name">
              <input name="name" defaultValue={r?.name ?? ""} required placeholder="Online Ideathon" className={inputCls} />
            </Field>
            <Field label="Submission deadline (IST)" hint="Optional. Submissions also need to be opened.">
              <input name="deadline" type="datetime-local" defaultValue={isoToIstInput(r?.submission_deadline)} className={inputCls} />
            </Field>
            <Field label="Combine evaluators' scores" hint="How several evaluators' marks for the same team become the team's score.">
              <select name="aggregation" defaultValue={r?.aggregation ?? "average"} className={inputCls}>
                <option value="average">Average of evaluators</option>
                <option value="sum">Sum of evaluators</option>
              </select>
            </Field>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Scoring categories</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {rows.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input type="hidden" name={`crit_key_${i}`} defaultValue={c?.key ?? ""} />
                  <input name={`crit_label_${i}`} defaultValue={c?.label ?? ""} placeholder="Category (e.g. Innovation)" className={small} />
                  <input name={`crit_max_${i}`} type="number" min={1} max={1000} defaultValue={c?.max ?? 10} className={`${small} !w-24`} aria-label="Max score" />
                </div>
              ))}
            </div>
          </div>
          <fieldset className="space-y-2 rounded-xl border border-slate-200 p-3">
            <legend className="px-1 text-sm font-semibold text-slate-700">What teams submit in this round</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input type="radio" name="sub_mode" value="default" defaultChecked={mode === "default"} className="accent-brand-primary" /> Event default fields
                <span className="text-xs text-slate-500">({eventDefaults.map((f) => f.label).join(", ") || "none set"})</span>
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name="sub_mode" value="custom" defaultChecked={mode === "custom"} className="accent-brand-primary" /> Fields for this round only
              </label>
              <label className="flex items-center gap-1.5">
                <input type="radio" name="sub_mode" value="none" defaultChecked={mode === "none"} className="accent-brand-primary" /> No submission (e.g. on-site judging)
              </label>
            </div>
            <div className="grid gap-2">
              {subRows.map((f, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-12 sm:items-center">
                  <input type="hidden" name={`sub_key_${i}`} defaultValue={f?.key ?? ""} />
                  <input name={`sub_label_${i}`} defaultValue={f?.label ?? ""} placeholder={`Field ${i + 1} (e.g. ${["Idea PPT link", "Problem statement", "GitHub repository", "Demo video", "Approach", "Live demo"][i]})`} className={`${small} sm:col-span-6`} />
                  <select name={`sub_type_${i}`} defaultValue={f?.type ?? "url"} className={`${small} sm:col-span-3`}>
                    <option value="url">Link</option>
                    <option value="text">Short text</option>
                    <option value="long">Long text</option>
                  </select>
                  <label className="flex items-center gap-1.5 text-sm text-slate-600 sm:col-span-3">
                    <input type="checkbox" name={`sub_required_${i}`} defaultChecked={f?.required ?? false} className="accent-brand-primary" /> Required
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">These rows are used only when &quot;Fields for this round only&quot; is selected.</p>
          </fieldset>
          <SubmitButton pendingText="Saving…">{r ? "Save round" : "Add round"}</SubmitButton>
        </form>
      );
    };

    return (
      <div className="space-y-6">
        <Card title="Number of rounds">
          <form action={setRoundCountAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="event_id" value={eventId} />
            <Field label="Rounds in this event">
              <input name="count" type="number" min={Math.max(1, rounds.length)} max={10} defaultValue={Math.max(1, rounds.length)} className={`${small} !w-28`} />
            </Field>
            <SubmitButton pendingText="Saving…">Set</SubmitButton>
            <p className="text-sm text-slate-500">
              Currently {rounds.length}. Each round has its own scoring categories, submission fields, deadline and publish switch. Round 2 onwards is open only to teams that qualified in the previous round.
            </p>
          </form>
        </Card>
        {rounds.map((r) => (
          <Card
            key={r.id}
            title={`Round ${r.seq}: ${r.name}`}
            actions={
              <>
                <form action={setRoundFlagAction}>
                  <input type="hidden" name="event_id" value={eventId} />
                  <input type="hidden" name="round_id" value={r.id} />
                  <input type="hidden" name="flag" value="submissions_open" />
                  <input type="hidden" name="value" value={r.submissions_open ? "0" : "1"} />
                  <SubmitButton className={r.submissions_open ? btnSecondary : btnGold}>{r.submissions_open ? "Close submissions" : "Open submissions"}</SubmitButton>
                </form>
                <form action={deleteRoundAction}>
                  <input type="hidden" name="event_id" value={eventId} />
                  <input type="hidden" name="round_id" value={r.id} />
                  <SubmitButton className={btnDanger} confirm={`Delete ${r.name} and all its submissions and scores?`}>
                    Delete
                  </SubmitButton>
                </form>
              </>
            }
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge status={r.submissions_open ? "submissions open" : "submissions closed"} />
              <StatusBadge status={r.scores_published ? "scores published" : "scores hidden"} />
              {r.submission_deadline && <Badge>Deadline {fmtIst(r.submission_deadline)}</Badge>}
              {r.seq > 1 && <Badge tone="blue">Only teams qualified in round {r.seq - 1}</Badge>}
            </div>
            {roundForm(r)}
          </Card>
        ))}
        <Card title="Add a round">{roundForm()}</Card>
        <Card title="Evaluators">
          {evaluators.length === 0 ? (
            <Empty>
              No evaluators yet. Add them under{" "}
              <Link href="/admin/users" className="font-semibold text-brand-secondary underline">
                Users & evaluators
              </Link>
              .
            </Empty>
          ) : (
            <form action={assignEvaluatorsAction} className="space-y-3">
              <input type="hidden" name="event_id" value={eventId} />
              <p className="text-sm text-slate-500">Assigned evaluators see this event under Evaluate. Admins can always evaluate.</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {evaluators.map((u) => (
                  <label key={u.id} className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <input type="checkbox" name="evaluator" value={u.id} defaultChecked={assignedSet.has(u.id)} className="accent-brand-primary" />
                    <span>
                      <span className="font-semibold text-slate-800">{u.name}</span> {u.role === "admin" && <Badge>admin</Badge>}
                      <span className="block text-xs text-slate-500">{u.email}</span>
                    </span>
                  </label>
                ))}
              </div>
              <SubmitButton pendingText="Saving…">Save evaluators</SubmitButton>
            </form>
          )}
        </Card>
      </div>
    );
  }

  async function ScoresTab({ eventId, rounds, roundId }: { eventId: string; rounds: Awaited<ReturnType<typeof getRounds>>; roundId?: string }) {
    const round = rounds.find((r) => r.id === roundId) ?? rounds[0];
    if (!round) return <Empty>Add a round first.</Empty>;
    const [board, subs, evaluations] = await Promise.all([
      roundLeaderboard(round),
      all<{ team_id: string; data: string }>("SELECT team_id, data FROM submissions WHERE round_id = ?", [round.id]),
      all<{ team_id: string; evaluator_id: string; evaluator: string; scores: string; total: number; comment: string | null; updated_at: string }>(
        `SELECT s.team_id, s.evaluator_id, u.name AS evaluator, s.scores, s.total, s.comment, s.updated_at
           FROM scores s JOIN users u ON u.id = s.evaluator_id WHERE s.round_id = ? ORDER BY u.name`,
        [round.id]
      ),
    ]);
    const evalsByTeam = new Map<string, typeof evaluations>();
    for (const ev of evaluations) evalsByTeam.set(ev.team_id, [...(evalsByTeam.get(ev.team_id) ?? []), ev]);
    const criteria = roundCriteria(round);
    const fields = roundFields(round, event!);
    const subMap = new Map(subs.map((s) => [s.team_id, parseJson<Record<string, string>>(s.data, {})]));
    const maxTotal = criteria.reduce((a, c) => a + c.max, 0);
    const isSum = round.aggregation === "sum";
    const qualifiedCount = board.filter((b) => b.qualified === 1).length;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {rounds.map((r) => (
            <Link key={r.id} href={`${base}?tab=scores&round=${r.id}`} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${r.id === round.id ? "bg-brand-primary text-white" : "border border-slate-300 bg-white text-slate-700"}`}>
              Round {r.seq}: {r.name}
            </Link>
          ))}
        </div>
        <Card
          title={`${round.name} — leaderboard`}
          actions={
            <form action={setRoundFlagAction}>
              <input type="hidden" name="event_id" value={eventId} />
              <input type="hidden" name="round_id" value={round.id} />
              <input type="hidden" name="tab" value={`scores&round=${round.id}`} />
              <input type="hidden" name="flag" value="scores_published" />
              <input type="hidden" name="value" value={round.scores_published ? "0" : "1"} />
              <SubmitButton className={round.scores_published ? btnSecondary : btnGold} confirm={round.scores_published ? undefined : "Publish scores and qualification status to all teams?"}>
                {round.scores_published ? "Hide scores from teams" : "Publish scores to teams"}
              </SubmitButton>
            </form>
          }
        >
          <form action={qualifyTopAction} className="mb-5 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-4">
            <input type="hidden" name="event_id" value={eventId} />
            <input type="hidden" name="round_id" value={round.id} />
            <Field label="Qualify top N teams">
              <input name="top_n" type="number" min={0} placeholder="e.g. 50" className={`${small} !w-32`} />
            </Field>
            <Field label="…and/or minimum average">
              <input name="min_score" type="number" step="0.01" min={0} placeholder={`out of ${maxTotal}`} className={`${small} !w-36`} />
            </Field>
            <SubmitButton className={btnPrimary} confirm="This overwrites qualification for every scored team in this round. Continue?">
              Apply
            </SubmitButton>
            <span className="text-sm text-slate-600">{qualifiedCount} qualified so far</span>
          </form>
          {board.length === 0 ? (
            <Empty>No teams yet.</Empty>
          ) : (
            <Table head={["#", "Team", ...criteria.map((c) => (isSum ? `${c.label} (sum)` : `${c.label} /${c.max}`)), isSum ? "Total (sum)" : `Total /${maxTotal}`, "Evals", "Submission", "Qualified"]}>
              {board.map((b, i) => {
                const sub = subMap.get(b.team_id);
                return (
                  <tr key={b.team_id}>
                    <Td>{b.avg_total != null ? i + 1 : "—"}</Td>
                    <Td className="font-semibold">{b.team_name}</Td>
                    {criteria.map((c) => (
                      <Td key={c.key}>{b.criteria[c.key] ?? "—"}</Td>
                    ))}
                    <Td className="font-bold text-brand-primary">{b.avg_total ?? "—"}</Td>
                    <Td>{b.evaluations}</Td>
                    <Td>
                      {sub ? (
                        <div className="flex max-w-xs flex-col gap-0.5 text-xs">
                          {fields.map((f) =>
                            sub[f.key] ? (
                              (f.type ?? "url") === "url" ? (
                                <a key={f.key} href={sub[f.key]} target="_blank" rel="noopener noreferrer" className="text-brand-secondary underline">
                                  {f.label}
                                </a>
                              ) : (
                                <span key={f.key} title={sub[f.key]} className="truncate">
                                  <strong>{f.label}:</strong> {sub[f.key]}
                                </span>
                              )
                            ) : null
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">none</span>
                      )}
                    </Td>
                    <Td>
                      <form action={setQualifiedAction}>
                        <input type="hidden" name="event_id" value={eventId} />
                        <input type="hidden" name="round_id" value={round.id} />
                        <input type="hidden" name="team_id" value={b.team_id} />
                        <input type="hidden" name="qualified" value={b.qualified === 1 ? "0" : "1"} />
                        <SubmitButton className={b.qualified === 1 ? "rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white" : "rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"} pendingText="…">
                          {b.qualified === 1 ? "Qualified ✓" : "Mark qualified"}
                        </SubmitButton>
                      </form>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
          <p className="mt-3 text-sm text-slate-500">
            Scores are the {isSum ? "sum" : "average"} of all evaluators&apos; marks (change under Rounds &amp; evaluators). Next step: email qualified teams from the{" "}
            <Link href={`${base}?tab=emails`} className="font-semibold text-brand-secondary underline">
              Emails
            </Link>{" "}
            tab (audience &quot;Qualified in round {round.seq}&quot;).
          </p>
        </Card>
        <Card title={`Evaluations by evaluator (${evaluations.length})`}>
          {evaluations.length === 0 ? (
            <Empty>No evaluations yet.</Empty>
          ) : (
            <div className="space-y-2">
              {board
                .filter((b) => evalsByTeam.has(b.team_id))
                .map((b) => (
                  <details key={b.team_id} className="rounded-xl border border-slate-200">
                    <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-2.5">
                      <span className="font-semibold text-brand-primary">{b.team_name}</span>
                      <Badge>{evalsByTeam.get(b.team_id)!.length} evaluator(s)</Badge>
                      <span className="text-sm text-slate-600">
                        {isSum ? "Sum" : "Average"}: <strong>{b.avg_total}</strong>
                      </span>
                    </summary>
                    <div className="border-t border-slate-100 p-3">
                      <Table head={["Evaluator", ...criteria.map((c) => `${c.label} /${c.max}`), `Total /${maxTotal}`, "Comment", ""]}>
                        {evalsByTeam.get(b.team_id)!.map((ev) => {
                          const v = parseJson<Record<string, number>>(ev.scores, {});
                          return (
                            <tr key={ev.evaluator_id}>
                              <Td className="font-semibold">
                                {ev.evaluator}
                                <div className="text-xs font-normal text-slate-400">{fmtIst(ev.updated_at)}</div>
                              </Td>
                              {criteria.map((c) => (
                                <Td key={c.key}>{v[c.key] ?? "—"}</Td>
                              ))}
                              <Td className="font-bold">{ev.total}</Td>
                              <Td className="max-w-xs text-xs">{ev.comment ?? "—"}</Td>
                              <Td className="text-right">
                                <form action={deleteEvaluationAction}>
                                  <input type="hidden" name="event_id" value={eventId} />
                                  <input type="hidden" name="round_id" value={round.id} />
                                  <input type="hidden" name="team_id" value={b.team_id} />
                                  <input type="hidden" name="evaluator_id" value={ev.evaluator_id} />
                                  <SubmitButton className={btnDanger} confirm={`Remove ${ev.evaluator}'s evaluation of ${b.team_name}?`}>
                                    Remove
                                  </SubmitButton>
                                </form>
                              </Td>
                            </tr>
                          );
                        })}
                      </Table>
                    </div>
                  </details>
                ))}
            </div>
          )}
        </Card>
      </div>
    );
  }

  async function ResultsTab({ eventId, rounds }: { eventId: string; rounds: Awaited<ReturnType<typeof getRounds>> }) {
    const ev = event!;
    const finalRound = rounds.at(-1);
    const board = finalRound ? await roundLeaderboard(finalRound) : [];
    const teams = await all<{ id: string; name: string; final_rank: number | null }>("SELECT id, name, final_rank FROM teams WHERE event_id = ?", [eventId]);
    const avg = new Map(board.map((b) => [b.team_id, b.avg_total]));
    const sorted = [...teams].sort((a, b) => (a.final_rank ?? 999) - (b.final_rank ?? 999) || (avg.get(b.id) ?? -1) - (avg.get(a.id) ?? -1));
    const templates = await all<{ id: string; name: string; subject: string; body: string }>("SELECT id, name, subject, body FROM email_templates WHERE scope = ?", [`event:${eventId}`]);
    const winnerTpl = templates.find((t) => /winner/i.test(t.name));

    return (
      <div className="space-y-6">
        <Card
          title={`Final rankings (top ${ev.winners_count} are winners)`}
          actions={
            <form action={autoRankAction}>
              <input type="hidden" name="event_id" value={eventId} />
              <SubmitButton className={btnSecondary} confirm="Replace current ranks with the top teams from the final round?">
                Auto-rank from {finalRound?.name ?? "final round"}
              </SubmitButton>
            </form>
          }
        >
          {teams.length === 0 ? (
            <Empty>No teams yet.</Empty>
          ) : (
            <form action={saveRanksAction} className="space-y-3">
              <input type="hidden" name="event_id" value={eventId} />
              <Table head={["Team", `Avg (${finalRound?.name ?? "—"})`, "Rank", "Shown as"]}>
                {sorted.slice(0, 200).map((t) => (
                  <tr key={t.id}>
                    <Td className="font-semibold">{t.name}</Td>
                    <Td>{avg.get(t.id) ?? "—"}</Td>
                    <Td>
                      <input name={`rank_${t.id}`} type="number" min={1} max={100} defaultValue={t.final_rank ?? ""} className={`${small} !w-20`} />
                    </Td>
                    <Td>{t.final_rank && t.final_rank <= ev.winners_count ? <Badge tone="amber">{rankLabel(t.final_rank)}</Badge> : "—"}</Td>
                  </tr>
                ))}
              </Table>
              <SubmitButton pendingText="Saving…">Save ranks</SubmitButton>
            </form>
          )}
        </Card>
        <Card title="Announce results">
          <form action={publishWinnersAction} className="space-y-4">
            <input type="hidden" name="event_id" value={eventId} />
            <p className="text-sm text-slate-600">
              Currently: {ev.winners_published ? <Badge tone="green">Announced on the portal</Badge> : <Badge tone="amber">Not announced</Badge>}
            </p>
            {!ev.winners_published && (
              <>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" name="notify" defaultChecked className="accent-brand-primary" /> Email the winning teams
                </label>
                <input name="subject" defaultValue={winnerTpl?.subject ?? `Congratulations! {{team}} is {{rank}} at ${ev.title}`} className={inputCls} />
                <textarea
                  name="body"
                  rows={6}
                  defaultValue={
                    winnerTpl?.body ??
                    `Dear {{name}},\n\nCongratulations! Your team {{team}} has been placed {{rank}} at {{event}}.\n\nThe organising committee will contact you about the prize ceremony. Your certificate will be available on the portal: {{portalUrl}}\n\nRegards,\nic-ETITE'28 Organising Committee`
                  }
                  className={`${inputCls} font-mono text-sm`}
                />
              </>
            )}
            <input type="hidden" name="publish" value={ev.winners_published ? "0" : "1"} />
            <SubmitButton className={ev.winners_published ? btnSecondary : btnGold} confirm={ev.winners_published ? "Hide results from the portal?" : "Announce winners on the portal now?"}>
              {ev.winners_published ? "Hide results" : "Announce winners"}
            </SubmitButton>
          </form>
        </Card>
      </div>
    );
  }

  async function EmailsTab({ eventId, here }: { eventId: string; here: string }) {
    const scope = `event:${eventId}`;
    const [templates, audiences, certs] = await Promise.all([
      all<{ id: string; name: string; subject: string; body: string }>("SELECT id, name, subject, body FROM email_templates WHERE scope = ? ORDER BY name", [scope]),
      audienceOptions(scope),
      all<{ kind: "participation" | "winner" }>("SELECT kind FROM certificate_templates WHERE scope = ?", [scope]),
    ]);
    return (
      <Card title="Compose email">
        <EmailComposer scope={scope} back={here} templates={templates} audiences={audiences} certKinds={certs.map((c) => c.kind)} placeholders={PLACEHOLDERS} />
        <p className="mt-4 text-sm text-slate-500">
          Queued emails are sent from{" "}
          <Link href="/admin/email" className="font-semibold text-brand-secondary underline">
            Email & SMTP
          </Link>{" "}
          within your daily Gmail limit; anything left over goes out automatically the next day.
        </p>
      </Card>
    );
  }

  async function CertificatesTab({ eventId, here }: { eventId: string; here: string }) {
    const scope = `event:${eventId}`;
    const [rows, participation, winner] = await Promise.all([
      all<{ kind: "participation" | "winner"; width: number; height: number; mime: string; layout: string; released: number; updated_at: string }>(
        "SELECT kind, width, height, mime, layout, released, updated_at FROM certificate_templates WHERE scope = ?",
        [scope]
      ),
      certificateRecipients(scope, "participation"),
      certificateRecipients(scope, "winner"),
    ]);
    const templates: TemplateMeta[] = rows.map((r) => ({ ...r, layout: parseJson<CertLayout>(r.layout, DEFAULT_LAYOUT) }));
    return (
      <Card title="Certificates">
        <CertificateManager scope={scope} back={here} kinds={["participation", "winner"]} templates={templates} eligible={{ participation: participation.length, winner: winner.length }} />
        <p className="mt-4 text-sm text-slate-500">
          Released certificates appear on each participant&apos;s event page. To email them, use the Emails tab with &quot;Attach certificate&quot;. PDFs are generated when downloaded or sent and are never stored.
        </p>
      </Card>
    );
  }

  async function ExportTab({ eventId, slug }: { eventId: string; slug: string }) {
    return (
      <div className="space-y-6">
        <Card title="Download all data">
          <p className="mb-4 text-slate-600">
            ZIP of CSV files: participants with contact details, teams and members, submissions, scores and results for every round, qualifiers per round, winners, and certificate recipient lists. Certificates themselves can be downloaded from the Certificates tab.
          </p>
          <a href={`/api/admin/export?scope=${encodeURIComponent(`event:${eventId}`)}`} className={btnPrimary}>
            Download export (.zip)
          </a>
        </Card>
        <Card title="Delete event data">
          <p className="mb-4 text-sm text-slate-600">Permanently deletes registrations, teams, submissions, scores, qualification, invite list, payments, email drafts/queue and certificate templates for this event. Download the export first. This cannot be undone.</p>
          <form action={purgeEventAction} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="event_id" value={eventId} />
            <Field label={`Type "${slug}" to confirm`}>
              <input name="confirm" required autoComplete="off" className={`${inputCls} !w-56`} />
            </Field>
            <select name="mode" defaultValue="data" className={`${inputCls} !w-auto`}>
              <option value="data">Delete participant data, keep event (archived)</option>
              <option value="all">Delete the event completely</option>
            </select>
            <SubmitButton className={btnDanger} confirm="Permanently delete this data?">
              Delete data
            </SubmitButton>
          </form>
        </Card>
      </div>
    );
  }
}
