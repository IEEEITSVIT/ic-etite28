import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, MapPin, Users, Trophy, FileText, Award, Lock } from "lucide-react";
import { all, first, parseJson } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import {
  canView,
  eligibleForRound,
  eventFeeNow,
  eventPrizes,
  getEventBySlug,
  getRegistration,
  getRounds,
  getTeam,
  getTeamMembers,
  isAllowlisted,
  registrationWindow,
  roundAcceptsSubmissions,
  roundCriteria,
  submissionFields,
} from "@/lib/portal/events";
import { fmtIst } from "@/lib/portal/actions";
import { formatMoney } from "@/lib/settings";
import { rankLabel } from "@/lib/certificates/render";
import { formatDeadline } from "@/lib/pricing";
import PrizePool from "@/components/portal/PrizePool";
import {
  createTeamAction,
  joinTeamAction,
  leaveTeamAction,
  registerAction,
  removeMemberAction,
  submitAction,
  transferLeadAction,
} from "@/app/actions/events";
import SubmitButton from "@/components/portal/SubmitButton";
import CopyButton from "@/components/portal/CopyButton";
import PaymentCard from "@/components/portal/PaymentCard";
import { Badge, Card, Empty, Field, Flash, PortalPage, StatusBadge, btnDanger, btnGold, btnPrimary, btnSecondary, inputCls } from "@/components/portal/ui";

type Params = Promise<{ slug: string }>;
type SP = Promise<{ ok?: string; error?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug).catch(() => null);
  if (!event || event.visibility === "hidden") return { title: "Event", robots: { index: false } };
  return {
    title: `${event.title} | ic-ETITE'28`,
    description: event.tagline ?? undefined,
    alternates: { canonical: `/events/${slug}` },
    robots: event.visibility === "public" ? undefined : { index: false },
  };
}

export default async function EventPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const { ok, error } = await searchParams;
  const [event, user] = await Promise.all([getEventBySlug(slug), getCurrentUser()]);
  if (!event || !canView(event, user)) notFound();

  const regWindow = registrationWindow(event);
  const reg = user ? await getRegistration(event.id, user.id) : null;
  const team = reg?.team_id ? await getTeam(reg.team_id) : null;
  const [members, rounds] = await Promise.all([team ? getTeamMembers(team.id) : Promise.resolve([]), getRounds(event.id)]);
  const isLead = reg?.member_role === "lead";
  const fields = submissionFields(event);
  const path = `/events/${slug}`;

  const allowlisted = user && event.registration_mode === "allowlist" ? await isAllowlisted(event.id, user.email) : true;

  // Per-round data for the participant's team.
  const roundData = team
    ? await Promise.all(
        rounds.map(async (r) => {
          const [submission, eligible, result, scoreRows] = await Promise.all([
            first<{ data: string; updated_at: string }>("SELECT data, updated_at FROM submissions WHERE team_id = ? AND round_id = ?", [team.id, r.id]),
            eligibleForRound(team, r, event),
            first<{ qualified: number }>("SELECT qualified FROM round_results WHERE team_id = ? AND round_id = ?", [team.id, r.id]),
            r.scores_published
              ? all<{ scores: string; total: number }>("SELECT scores, total FROM scores WHERE team_id = ? AND round_id = ?", [team.id, r.id])
              : Promise.resolve([]),
          ]);
          return { round: r, submission: parseJson<Record<string, string>>(submission?.data, {}), submittedAt: submission?.updated_at, eligible, result, scoreRows };
        })
      )
    : [];

  const winners = event.winners_published
    ? await all<{ id: string; name: string; final_rank: number }>(
        "SELECT id, name, final_rank FROM teams WHERE event_id = ? AND final_rank IS NOT NULL AND final_rank <= ? ORDER BY final_rank",
        [event.id, event.winners_count]
      )
    : [];

  const certs = reg
    ? await all<{ kind: "participation" | "winner" }>("SELECT kind FROM certificate_templates WHERE scope = ? AND released = 1", [`event:${event.id}`])
    : [];
  const isWinner = Boolean(team?.final_rank && team.final_rank <= event.winners_count && event.winners_published);
  const myCerts = certs.filter((c) => c.kind === "participation" || isWinner);

  const payerReg = reg && reg.payment_status !== "not_required" ? reg : null;

  return (
    <PortalPage
      title={event.title}
      subtitle={event.tagline}
      actions={
        user ? (
          <Link href="/dashboard" className={btnSecondary}>
            My dashboard
          </Link>
        ) : undefined
      }
    >
      <Flash ok={ok} error={error} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* ── Registration / team workspace ───────────────────── */}
          {!user ? (
            <Card title="Register">
              <p className="mb-4 text-slate-600">Log in or create an account to register for {event.title}.</p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/login?next=${encodeURIComponent(path)}`} className={btnPrimary}>
                  Log in
                </Link>
                <Link href={`/signup?next=${encodeURIComponent(path)}`} className={btnGold}>
                  Create account
                </Link>
              </div>
            </Card>
          ) : !reg ? (
            <Card title="Register">
              {regWindow === "open" && allowlisted ? (
                <form action={registerAction} className="flex flex-wrap items-center justify-between gap-4">
                  <input type="hidden" name="slug" value={slug} />
                  <p className="text-slate-600">
                    Registering as <strong>{user.name}</strong> ({user.email}).
                  </p>
                  <SubmitButton className={btnGold} pendingText="Registering…">
                    Register now
                  </SubmitButton>
                </form>
              ) : regWindow === "open" ? (
                <p className="flex items-center gap-2 text-slate-600">
                  <Lock className="h-4 w-4" /> Registration is by invitation only and {user.email} is not on the invite list.
                </p>
              ) : (
                <p className="text-slate-600">{regWindow === "not_open" ? `Registration opens ${fmtIst(event.reg_opens_at)}.` : "Registration is closed."}</p>
              )}
            </Card>
          ) : (
            <>
              {payerReg && (
                <PaymentCard
                  purpose="event"
                  refId={`${event.id}:${user.id}`}
                  amount={payerReg.payment_amount}
                  currency={payerReg.payment_currency}
                  status={payerReg.payment_status}
                  back={path}
                />
              )}

              {event.participation === "team" && (
                <Card title="Your team">
                  {!team ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <form action={createTeamAction} className="space-y-3 rounded-xl border border-slate-200 p-4">
                        <input type="hidden" name="slug" value={slug} />
                        <h3 className="font-bold text-[#002147]">Create a team</h3>
                        <p className="text-sm text-slate-600">You become team lead and get a code to share.</p>
                        <input name="team_name" required minLength={2} maxLength={60} placeholder="Team name" className={inputCls} />
                        <SubmitButton pendingText="Creating…">Create team</SubmitButton>
                      </form>
                      <form action={joinTeamAction} className="space-y-3 rounded-xl border border-slate-200 p-4">
                        <input type="hidden" name="slug" value={slug} />
                        <h3 className="font-bold text-[#002147]">Join a team</h3>
                        <p className="text-sm text-slate-600">Enter the code your team lead shared.</p>
                        <input name="code" required maxLength={12} placeholder="Team code" className={`${inputCls} uppercase tracking-widest`} />
                        <SubmitButton className={btnGold} pendingText="Joining…">
                          Join team
                        </SubmitButton>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#002147] p-4 text-white">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Team</div>
                          <div className="text-xl font-extrabold">{team.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/10 px-4 py-1.5 font-mono text-lg font-bold tracking-[0.25em] text-[#FFB81C]">{team.code}</span>
                          <CopyButton value={team.code} label="Copy code" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {members.length} of {event.max_team_size} members
                        {members.length < event.min_team_size && <> · needs at least {event.min_team_size} to submit</>}
                      </p>
                      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                        {members.map((m) => (
                          <li key={m.user_id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                            <div>
                              <div className="font-semibold text-slate-800">
                                {m.name} {m.member_role === "lead" && <Badge tone="navy">Lead</Badge>}
                              </div>
                              <div className="text-xs text-slate-500">{m.email}</div>
                            </div>
                            {isLead && m.user_id !== user.id && regWindow !== "closed" && (
                              <div className="flex gap-2">
                                <form action={transferLeadAction}>
                                  <input type="hidden" name="slug" value={slug} />
                                  <input type="hidden" name="user_id" value={m.user_id} />
                                  <SubmitButton className={btnSecondary} confirm={`Make ${m.name} the team lead?`}>
                                    Make lead
                                  </SubmitButton>
                                </form>
                                <form action={removeMemberAction}>
                                  <input type="hidden" name="slug" value={slug} />
                                  <input type="hidden" name="user_id" value={m.user_id} />
                                  <SubmitButton className={btnDanger} confirm={`Remove ${m.name} from the team?`}>
                                    Remove
                                  </SubmitButton>
                                </form>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      {regWindow !== "closed" && (
                        <form action={leaveTeamAction}>
                          <input type="hidden" name="slug" value={slug} />
                          <SubmitButton className={btnDanger} confirm={isLead && members.length === 1 ? "Leaving will delete this team. Continue?" : "Leave this team?"}>
                            {isLead && members.length === 1 ? "Delete team" : "Leave team"}
                          </SubmitButton>
                        </form>
                      )}
                    </div>
                  )}
                </Card>
              )}

              {/* ── Rounds: submissions & published scores ───────── */}
              {team && rounds.length > 0 && (
                <div id="submissions" className="space-y-4 scroll-mt-28">
                  {roundData.map(({ round, submission, submittedAt, eligible, result, scoreRows }) => {
                    const open = roundAcceptsSubmissions(round);
                    const criteria = roundCriteria(round);
                    const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) / 100 : null);
                    const perCriterion = criteria.map((c) => ({
                      ...c,
                      value: avg(scoreRows.map((s) => Number(parseJson<Record<string, number>>(s.scores, {})[c.key] ?? 0))),
                    }));
                    const total = avg(scoreRows.map((s) => s.total));
                    return (
                      <Card
                        key={round.id}
                        title={
                          <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#004B87]" /> Round {round.seq}: {round.name}
                          </span>
                        }
                        actions={
                          <>
                            {open ? <Badge tone="green">Submissions open</Badge> : <Badge>Submissions closed</Badge>}
                            {round.scores_published === 1 && result && <StatusBadge status={result.qualified ? "qualified" : "not qualified"} />}
                          </>
                        }
                      >
                        {round.submission_deadline && <p className="mb-3 text-sm text-slate-600">Deadline: {fmtIst(round.submission_deadline)}</p>}
                        {!eligible ? (
                          <Empty>{round.seq === 1 ? `Your team needs at least ${event.min_team_size} member(s) to submit.` : "Only teams that qualified in the previous round can submit here."}</Empty>
                        ) : fields.length === 0 ? (
                          <Empty>No submission is required for this round.</Empty>
                        ) : open ? (
                          <form action={submitAction} className="space-y-3">
                            <input type="hidden" name="slug" value={slug} />
                            <input type="hidden" name="round_id" value={round.id} />
                            {fields.map((f) => (
                              <Field key={f.key} label={`${f.label}${f.required ? " *" : ""}`}>
                                <input name={`field_${f.key}`} type="url" defaultValue={submission[f.key] ?? ""} required={f.required} placeholder="https://" className={inputCls} />
                              </Field>
                            ))}
                            <div className="flex flex-wrap items-center gap-3">
                              <SubmitButton pendingText="Saving…">{submittedAt ? "Update submission" : "Submit"}</SubmitButton>
                              {submittedAt && <span className="text-xs text-slate-500">Last saved {fmtIst(submittedAt)}</span>}
                            </div>
                          </form>
                        ) : submittedAt ? (
                          <ul className="space-y-1.5 text-sm">
                            {fields.map((f) => (
                              <li key={f.key}>
                                <span className="font-semibold text-slate-700">{f.label}: </span>
                                {submission[f.key] ? (
                                  <a href={submission[f.key]} target="_blank" rel="noopener noreferrer" className="break-all text-[#004B87] underline">
                                    {submission[f.key]}
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <Empty>No submission was made for this round.</Empty>
                        )}

                        {round.scores_published === 1 && (
                          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="mb-2 font-bold text-[#002147]">Your scores</h3>
                            {scoreRows.length === 0 ? (
                              <p className="text-sm text-slate-600">Your team was not scored in this round.</p>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2">
                                {perCriterion.map((c) => (
                                  <div key={c.key} className="flex justify-between rounded-lg bg-white px-3 py-2 text-sm">
                                    <span className="text-slate-600">{c.label}</span>
                                    <span className="font-bold text-[#002147]">
                                      {c.value ?? "—"} / {c.max}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between rounded-lg bg-[#002147] px-3 py-2 text-sm text-white sm:col-span-2">
                                  <span>Total (average of {scoreRows.length} evaluator{scoreRows.length > 1 ? "s" : ""})</span>
                                  <span className="font-extrabold text-[#FFB81C]">
                                    {total} / {criteria.reduce((a, c) => a + c.max, 0)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {myCerts.length > 0 && (
                <Card title={<span className="flex items-center gap-2"><Award className="h-5 w-5 text-[#B45309]" /> Certificates</span>}>
                  <div className="flex flex-wrap gap-2">
                    {myCerts.map((c) => (
                      <a key={c.kind} href={`/api/certificates?scope=${encodeURIComponent(`event:${event.id}`)}&kind=${c.kind}`} className={c.kind === "winner" ? btnGold : btnPrimary}>
                        Download {c.kind === "winner" ? "winner" : "participation"} certificate
                      </a>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          {event.description && (
            <Card title="About">
              <div className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700">{event.description}</div>
            </Card>
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <aside className="space-y-4">
          <Card>
            <ul className="space-y-3 text-sm text-slate-700">
              {(event.starts_at || event.ends_at) && (
                <li className="flex gap-2.5">
                  <Calendar className="h-4 w-4 shrink-0 text-[#004B87]" />
                  <span>
                    {fmtIst(event.starts_at)}
                    {event.ends_at && <> → {fmtIst(event.ends_at)}</>}
                  </span>
                </li>
              )}
              {event.venue && (
                <li className="flex gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#004B87]" /> {event.venue}
                </li>
              )}
              <li className="flex gap-2.5">
                <Users className="h-4 w-4 shrink-0 text-[#004B87]" />
                {event.participation === "solo" ? "Individual event" : `Teams of ${event.min_team_size}–${event.max_team_size}`}
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <StatusBadge status={regWindow === "open" ? "registration open" : regWindow === "not_open" ? "opens soon" : "registration closed"} />
                {event.reg_closes_at && regWindow !== "closed" && <span className="text-xs text-slate-500">closes {fmtIst(event.reg_closes_at)}</span>}
              </li>
              {event.fee_amount > 0 &&
                (() => {
                  const fee = eventFeeNow(event);
                  const per = event.fee_scope === "per_team" ? "per team" : "per person";
                  return (
                    <li className="font-semibold text-[#002147]">
                      Fee:{" "}
                      {fee.early ? (
                        <>
                          <span className="text-xs text-slate-400 line-through">{formatMoney(event.fee_amount, event.fee_currency)}</span>{" "}
                          <span className="text-emerald-700">{formatMoney(fee.amount ?? 0, event.fee_currency)}</span> {per}
                          <span className="mt-1 block text-xs font-bold text-emerald-700">Early bird until {formatDeadline(event.early_bird_ends_at)}</span>
                        </>
                      ) : (
                        <>
                          {formatMoney(event.fee_amount, event.fee_currency)} {per}
                        </>
                      )}
                    </li>
                  );
                })()}
            </ul>
          </Card>
          <PrizePool prizes={eventPrizes(event)} pool={event.prize_pool} compact />
          {winners.length > 0 && (
            <Card title={<span className="flex items-center gap-2"><Trophy className="h-5 w-5 text-[#B45309]" /> Results</span>}>
              <ol className="space-y-2">
                {winners.map((w) => (
                  <li key={w.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${w.id === team?.id ? "bg-amber-50 ring-1 ring-amber-300" : "bg-slate-50"}`}>
                    <span className="font-semibold text-slate-800">{w.name}</span>
                    <span className="text-sm font-bold text-[#B45309]">{rankLabel(w.final_rank)}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </aside>
      </div>
    </PortalPage>
  );
}
