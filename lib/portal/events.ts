import "server-only";
import { all, batch, first, now, parseJson, run } from "@/lib/db";
import { newCode, newId } from "@/lib/portal/ids";
import type { SessionUser } from "@/lib/auth/session";
import { priceNow, type Prize } from "@/lib/pricing";

export type SubmissionFieldType = "url" | "text" | "long";

export interface SubmissionField {
  key: string;
  label: string;
  required: boolean;
  type?: SubmissionFieldType; // default "url"
}

export const FIELD_LIMITS: Record<SubmissionFieldType, number> = { url: 500, text: 300, long: 3000 };

export interface Criterion {
  key: string;
  label: string;
  max: number;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  venue: string | null;
  starts_at: string | null;
  ends_at: string | null;
  visibility: "hidden" | "unlisted" | "public";
  status: "active" | "archived";
  registration_mode: "open" | "allowlist";
  participation: "solo" | "team";
  min_team_size: number;
  max_team_size: number;
  reg_opens_at: string | null;
  reg_closes_at: string | null;
  submission_fields: string;
  fee_amount: number;
  fee_currency: string;
  fee_scope: "per_team" | "per_member";
  payment_link: string | null;
  winners_count: number;
  winners_published: number;
  prizes: string;
  prize_pool: string | null;
  early_fee_amount: number | null;
  early_bird_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoundRow {
  id: string;
  event_id: string;
  seq: number;
  name: string;
  criteria: string;
  submissions_open: number;
  submission_deadline: string | null;
  scores_published: number;
  aggregation: "average" | "sum";
  submission_fields: string | null; // JSON; NULL = event default fields
}

export interface TeamRow {
  id: string;
  event_id: string;
  name: string;
  code: string;
  lead_user_id: string;
  final_rank: number | null;
  created_at: string;
}

export interface MemberRow {
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  institution: string | null;
  member_role: "lead" | "member";
  payment_status: string;
}

export interface RegistrationRow {
  event_id: string;
  user_id: string;
  team_id: string | null;
  member_role: "lead" | "member";
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
  payment_link: string | null;
  registered_at: string;
}

export const submissionFields = (e: Pick<EventRow, "submission_fields">) => parseJson<SubmissionField[]>(e.submission_fields, []);
// What a round asks teams to submit: its own fields, or the event's default fields.
export const roundFields = (round: Pick<RoundRow, "submission_fields">, e: Pick<EventRow, "submission_fields">): SubmissionField[] =>
  round.submission_fields == null ? submissionFields(e) : parseJson<SubmissionField[]>(round.submission_fields, []);

export const eventPrizes = (e: Pick<EventRow, "prizes">) => parseJson<Prize[]>(e.prizes, []);

// Fee charged if someone registers now (early-bird price until early_bird_ends_at).
export const eventFeeNow = (e: Pick<EventRow, "fee_amount" | "early_fee_amount" | "early_bird_ends_at">) =>
  priceNow(e.fee_amount, e.early_fee_amount, e.early_bird_ends_at ? { endsAt: e.early_bird_ends_at, percent: 0 } : null);
export const roundCriteria = (r: Pick<RoundRow, "criteria">) => parseJson<Criterion[]>(r.criteria, []);

export const getEventBySlug = (slug: string) => first<EventRow>("SELECT * FROM events WHERE slug = ?", [slug]);
export const getEventById = (id: string) => first<EventRow>("SELECT * FROM events WHERE id = ?", [id]);
export const getRounds = (eventId: string) =>
  all<RoundRow>("SELECT * FROM event_rounds WHERE event_id = ? ORDER BY seq", [eventId]);

export function canView(event: EventRow, user: SessionUser | null) {
  return event.visibility !== "hidden" || user?.role === "admin";
}

export type RegistrationWindow = "not_open" | "open" | "closed";
export function registrationWindow(e: EventRow): RegistrationWindow {
  const t = Date.now();
  if (e.status !== "active") return "closed";
  if (e.reg_opens_at && new Date(e.reg_opens_at).getTime() > t) return "not_open";
  if (e.reg_closes_at && new Date(e.reg_closes_at).getTime() < t) return "closed";
  return "open";
}

export async function isAllowlisted(eventId: string, email: string) {
  const row = await first("SELECT 1 AS ok FROM event_allowlist WHERE event_id = ? AND email = ?", [eventId, email]);
  return Boolean(row);
}

export const getRegistration = (eventId: string, userId: string) =>
  first<RegistrationRow>("SELECT * FROM registrations WHERE event_id = ? AND user_id = ?", [eventId, userId]);

export const getTeam = (teamId: string) => first<TeamRow>("SELECT * FROM teams WHERE id = ?", [teamId]);

export const getTeamMembers = (teamId: string) =>
  all<MemberRow>(
    `SELECT r.user_id, u.name, u.email, u.phone, u.institution, r.member_role, r.payment_status
       FROM registrations r JOIN users u ON u.id = r.user_id
      WHERE r.team_id = ? ORDER BY r.member_role = 'lead' DESC, r.registered_at`,
    [teamId]
  );

// Fee rules: per-member → every registrant pays; per-team → the team lead pays.
function paymentFor(e: EventRow, payer: boolean) {
  const fee = eventFeeNow(e).amount ?? 0;
  if (fee <= 0 || !payer) return { status: "not_required", amount: 0 };
  return { status: "unpaid", amount: fee };
}

export class PortalError extends Error {}

// Collapses runs of whitespace so "Quantum  Leap" and "Quantum Leap" count as the same name.
export const normalizeTeamName = (name: string) => name.replace(/\s+/g, " ").trim().slice(0, 60);

const isUniqueViolation = (err: unknown, column: string) =>
  err instanceof Error && /UNIQUE/i.test(err.message) && err.message.includes(column);

// Solo events name each participant's team after them; same-named people get a suffix.
async function uniqueSoloName(eventId: string, base: string) {
  const taken = await all<{ name: string }>("SELECT name FROM teams WHERE event_id = ? AND (name = ? COLLATE NOCASE OR name LIKE ?)", [eventId, base, `${base} (%)`]);
  if (taken.length === 0) return base;
  const names = new Set(taken.map((t) => t.name.toLowerCase()));
  let n = 2;
  while (names.has(`${base} (${n})`.toLowerCase())) n++;
  return `${base} (${n})`;
}

export async function registerForEvent(e: EventRow, user: SessionUser) {
  if (!canView(e, user)) throw new PortalError("Event not found.");
  if (registrationWindow(e) !== "open") throw new PortalError("Registration is not open for this event.");
  if (e.registration_mode === "allowlist" && !(await isAllowlisted(e.id, user.email))) {
    throw new PortalError("Registration for this event is limited to invited participants. Your email is not on the list.");
  }
  if (await getRegistration(e.id, user.id)) return;

  const pay = paymentFor(e, e.fee_scope === "per_member" || e.participation === "solo");
  const stmts = [
    {
      sql: `INSERT OR IGNORE INTO registrations (event_id, user_id, team_id, member_role, payment_status, payment_amount, payment_currency, registered_at)
            VALUES (?, ?, NULL, 'member', ?, ?, ?, ?)`,
      params: [e.id, user.id, pay.status, pay.amount, e.fee_currency, now()],
    },
  ];
  // Solo events: each participant is a team of one, so submissions/scores work the same way.
  if (e.participation === "solo") {
    const teamId = newId();
    stmts.push(
      {
        sql: "INSERT INTO teams (id, event_id, name, code, lead_user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        params: [teamId, e.id, await uniqueSoloName(e.id, normalizeTeamName(user.name)), newCode(8), user.id, now()],
      },
      {
        sql: "UPDATE registrations SET team_id = ?, member_role = 'lead' WHERE event_id = ? AND user_id = ?",
        params: [teamId, e.id, user.id],
      }
    );
  }
  await batch(stmts);
}

function assertTeamChangesAllowed(e: EventRow) {
  if (e.participation !== "team") throw new PortalError("This is an individual event.");
  if (registrationWindow(e) === "closed") throw new PortalError("Registration has closed; teams can no longer be changed.");
}

export async function createTeam(e: EventRow, user: SessionUser, name: string) {
  assertTeamChangesAllowed(e);
  const reg = await getRegistration(e.id, user.id);
  if (!reg) throw new PortalError("Register for the event first.");
  if (reg.team_id) throw new PortalError("You are already in a team.");
  const clean = normalizeTeamName(name);
  if (clean.length < 2) throw new PortalError("Team name must be at least 2 characters.");
  const dup = await first("SELECT 1 FROM teams WHERE event_id = ? AND name = ? COLLATE NOCASE", [e.id, clean]);
  if (dup) throw new PortalError("A team with that name already exists.");

  const pay = paymentFor(e, e.fee_scope === "per_team");
  for (let attempt = 0; attempt < 3; attempt++) {
    const teamId = newId();
    try {
      await batch([
        {
          sql: `INSERT INTO teams (id, event_id, name, code, lead_user_id, created_at)
                SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS
                  (SELECT 1 FROM registrations WHERE event_id = ? AND user_id = ? AND team_id IS NULL)`,
          params: [teamId, e.id, clean, newCode(6), user.id, now(), e.id, user.id],
        },
        {
          sql: `UPDATE registrations SET team_id = ?, member_role = 'lead',
                  payment_status = CASE WHEN ? = 'unpaid' THEN 'unpaid' ELSE payment_status END,
                  payment_amount = CASE WHEN ? = 'unpaid' THEN ? ELSE payment_amount END
                WHERE event_id = ? AND user_id = ? AND team_id IS NULL AND EXISTS (SELECT 1 FROM teams WHERE id = ?)`,
          params: [teamId, pay.status, pay.status, pay.amount, e.id, user.id, teamId],
        },
      ]);
      return;
    } catch (err) {
      // The database enforces unique names per event, so a concurrent create with the same name lands here.
      if (isUniqueViolation(err, "teams.name")) throw new PortalError("A team with that name already exists.");
      // Unique team code collision: retry with a fresh code.
      if (!isUniqueViolation(err, "teams.code") || attempt === 2) throw err;
    }
  }
}

export async function joinTeam(e: EventRow, user: SessionUser, code: string) {
  assertTeamChangesAllowed(e);
  const reg = await getRegistration(e.id, user.id);
  if (!reg) throw new PortalError("Register for the event first.");
  if (reg.team_id) throw new PortalError("You are already in a team. Leave it first to join another.");
  const team = await first<TeamRow>("SELECT * FROM teams WHERE event_id = ? AND code = ?", [e.id, code.trim().toUpperCase()]);
  if (!team) throw new PortalError("No team with that code in this event.");
  // Capacity check and join in one statement so concurrent joins can't overfill a team.
  const res = await run(
    `UPDATE registrations SET team_id = ?, member_role = 'member'
      WHERE event_id = ? AND user_id = ? AND team_id IS NULL
        AND (SELECT COUNT(*) FROM registrations WHERE team_id = ?) < ?`,
    [team.id, e.id, user.id, team.id, e.max_team_size]
  );
  if (res.changes === 0) throw new PortalError(`That team is full (maximum ${e.max_team_size} members).`);
}

export async function leaveTeam(e: EventRow, user: SessionUser) {
  assertTeamChangesAllowed(e);
  const reg = await getRegistration(e.id, user.id);
  if (!reg?.team_id) return;
  const members = await getTeamMembers(reg.team_id);
  if (reg.member_role === "lead") {
    if (members.length > 1) throw new PortalError("Transfer team lead to another member before leaving, or remove the other members.");
    await batch([
      { sql: "UPDATE registrations SET team_id = NULL, member_role = 'member' WHERE team_id = ?", params: [reg.team_id] },
      { sql: "DELETE FROM teams WHERE id = ?", params: [reg.team_id] },
    ]);
    return;
  }
  await run("UPDATE registrations SET team_id = NULL WHERE event_id = ? AND user_id = ?", [e.id, user.id]);
}

export async function removeMember(e: EventRow, lead: SessionUser, memberId: string) {
  assertTeamChangesAllowed(e);
  const reg = await getRegistration(e.id, lead.id);
  if (!reg?.team_id || reg.member_role !== "lead") throw new PortalError("Only the team lead can remove members.");
  if (memberId === lead.id) throw new PortalError("Use 'Leave team' to remove yourself.");
  await run("UPDATE registrations SET team_id = NULL, member_role = 'member' WHERE event_id = ? AND user_id = ? AND team_id = ?", [
    e.id,
    memberId,
    reg.team_id,
  ]);
}

export async function transferLead(e: EventRow, lead: SessionUser, memberId: string) {
  assertTeamChangesAllowed(e);
  const reg = await getRegistration(e.id, lead.id);
  if (!reg?.team_id || reg.member_role !== "lead") throw new PortalError("Only the team lead can transfer leadership.");
  const target = await getRegistration(e.id, memberId);
  if (!target || target.team_id !== reg.team_id) throw new PortalError("That person is not in your team.");
  await batch([
    { sql: "UPDATE registrations SET member_role = 'member' WHERE event_id = ? AND user_id = ?", params: [e.id, lead.id] },
    { sql: "UPDATE registrations SET member_role = 'lead' WHERE event_id = ? AND user_id = ?", params: [e.id, memberId] },
    { sql: "UPDATE teams SET lead_user_id = ? WHERE id = ?", params: [memberId, reg.team_id] },
  ]);
}

// A team may submit to round 1 once it meets the minimum size; later rounds require
// qualification in the previous round.
export async function eligibleForRound(team: TeamRow, round: RoundRow, e: EventRow): Promise<boolean> {
  if (round.seq === 1) {
    const n = await first<{ n: number }>("SELECT COUNT(*) AS n FROM registrations WHERE team_id = ?", [team.id]);
    return (n?.n ?? 0) >= e.min_team_size;
  }
  const prev = await first<{ qualified: number }>(
    `SELECT rr.qualified FROM round_results rr JOIN event_rounds r ON r.id = rr.round_id
      WHERE r.event_id = ? AND r.seq = ? AND rr.team_id = ?`,
    [e.id, round.seq - 1, team.id]
  );
  return prev?.qualified === 1;
}

export function roundAcceptsSubmissions(round: RoundRow) {
  if (!round.submissions_open) return false;
  return !round.submission_deadline || new Date(round.submission_deadline).getTime() > Date.now();
}

export async function saveSubmission(e: EventRow, user: SessionUser, roundId: string, values: Record<string, string>) {
  const reg = await getRegistration(e.id, user.id);
  if (!reg?.team_id) throw new PortalError("Join or create a team first.");
  const round = await first<RoundRow>("SELECT * FROM event_rounds WHERE id = ? AND event_id = ?", [roundId, e.id]);
  if (!round) throw new PortalError("Round not found.");
  if (!roundAcceptsSubmissions(round)) throw new PortalError("Submissions are closed for this round.");
  const team = await getTeam(reg.team_id);
  if (!team || !(await eligibleForRound(team, round, e))) {
    throw new PortalError(round.seq === 1 ? `Your team needs at least ${e.min_team_size} member(s) to submit.` : "Your team has not qualified for this round.");
  }
  const data: Record<string, string> = {};
  const fields = roundFields(round, e);
  if (fields.length === 0) throw new PortalError("This round has no submission.");
  for (const f of fields) {
    const type = f.type ?? "url";
    const v = (values[f.key] ?? "").trim();
    if (f.required && !v) throw new PortalError(`${f.label} is required.`);
    if (v && type === "url" && !/^https?:\/\/\S+$/i.test(v)) throw new PortalError(`${f.label} must be a valid link starting with http:// or https://`);
    if (v.length > FIELD_LIMITS[type]) throw new PortalError(`${f.label} must be at most ${FIELD_LIMITS[type]} characters.`);
    data[f.key] = v;
  }
  await run(
    `INSERT INTO submissions (team_id, round_id, data, submitted_by, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(team_id, round_id) DO UPDATE SET data = excluded.data, submitted_by = excluded.submitted_by, updated_at = excluded.updated_at`,
    [team.id, round.id, JSON.stringify(data), user.id, now()]
  );
}

// Combines several evaluators' numbers: their average (default) or their sum, per round.
export function combine(values: number[], aggregation: RoundRow["aggregation"]) {
  if (values.length === 0) return null;
  const total = values.reduce((a, b) => a + b, 0);
  return Math.round((aggregation === "sum" ? total : total / values.length) * 100) / 100;
}

// Per-team aggregates for a round: each criterion and the total, combined across evaluators.
export interface TeamRoundScore {
  team_id: string;
  team_name: string;
  evaluations: number;
  avg_total: number | null;
  criteria: Record<string, number>;
  qualified: number | null;
}

export async function roundLeaderboard(round: RoundRow): Promise<TeamRoundScore[]> {
  const [teams, scores, results] = await Promise.all([
    all<{ id: string; name: string }>("SELECT id, name FROM teams WHERE event_id = ? ORDER BY name", [round.event_id]),
    all<{ team_id: string; scores: string; total: number }>("SELECT team_id, scores, total FROM scores WHERE round_id = ?", [round.id]),
    all<{ team_id: string; qualified: number }>("SELECT team_id, qualified FROM round_results WHERE round_id = ?", [round.id]),
  ]);
  const criteria = roundCriteria(round);
  const qualified = new Map(results.map((r) => [r.team_id, r.qualified]));
  const byTeam = new Map<string, { totals: number[]; per: Record<string, number[]> }>();
  for (const s of scores) {
    const entry = byTeam.get(s.team_id) ?? { totals: [], per: {} };
    entry.totals.push(s.total);
    const values = parseJson<Record<string, number>>(s.scores, {});
    for (const c of criteria) (entry.per[c.key] ??= []).push(Number(values[c.key] ?? 0));
    byTeam.set(s.team_id, entry);
  }
  const agg = (xs: number[]) => combine(xs, round.aggregation) ?? 0;
  return teams
    .map((t) => {
      const e = byTeam.get(t.id);
      return {
        team_id: t.id,
        team_name: t.name,
        evaluations: e?.totals.length ?? 0,
        avg_total: e ? agg(e.totals) : null,
        criteria: e ? Object.fromEntries(Object.entries(e.per).map(([k, xs]) => [k, agg(xs)])) : {},
        qualified: qualified.get(t.id) ?? null,
      };
    })
    .sort((a, b) => (b.avg_total ?? -1) - (a.avg_total ?? -1));
}
