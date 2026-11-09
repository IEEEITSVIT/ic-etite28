"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { all, batch, batchChunked, first, now, run, type Statement } from "@/lib/db";
import { bool, guarded, isEmail, istToIso, num, str } from "@/lib/portal/actions";
import { PortalError, getEventById, getRounds, roundLeaderboard, type Criterion, type RoundRow, type SubmissionField } from "@/lib/portal/events";
import { newId, slugify } from "@/lib/portal/ids";
import { PAYMENT_STATUSES, applyPaymentStatus, type PaymentStatus } from "@/lib/payments";
import { emailLayout, fillTemplate, outboxInsert, textToHtml } from "@/lib/email/mailer";
import { resolveAudience } from "@/lib/portal/audience";

const base = (id: string) => `/admin/events/${id}`;

function oneOf<T extends string>(v: string, options: readonly T[], fallback: T): T {
  return (options as readonly string[]).includes(v) ? (v as T) : fallback;
}

// ─── Event settings ───────────────────────────────────────────────────

export async function saveEventAction(fd: FormData) {
  await requireAdmin();
  const existingId = str(fd, "id", 40);
  const back = existingId ? base(existingId) : "/admin/events";
  let savedId = existingId;
  await guarded(back, async () => {
    const title = str(fd, "title", 120);
    if (title.length < 3) throw new PortalError("Event title is required.");
    const slug = slugify(str(fd, "slug", 60) || title);
    if (!slug) throw new PortalError("Enter a URL slug (letters, numbers and dashes).");
    const clash = await first<{ id: string }>("SELECT id FROM events WHERE slug = ?", [slug]);
    if (clash && clash.id !== existingId) throw new PortalError(`The URL /events/${slug} is already used by another event.`);

    const participation = oneOf(str(fd, "participation"), ["solo", "team"] as const, "team");
    const minSize = participation === "solo" ? 1 : Math.max(1, Math.min(20, num(fd, "min_team_size", 1)));
    const maxSize = participation === "solo" ? 1 : Math.max(minSize, Math.min(20, num(fd, "max_team_size", 4)));

    const fields: SubmissionField[] = [];
    for (let i = 0; i < 6; i++) {
      const label = str(fd, `field_label_${i}`, 80);
      if (!label) continue;
      fields.push({ key: str(fd, `field_key_${i}`, 40) || slugify(label).replace(/-/g, "_") || `link_${i + 1}`, label, required: bool(fd, `field_required_${i}`) });
    }
    const prizes = [];
    for (let i = 0; i < 10; i++) {
      const title = str(fd, `prize_title_${i}`, 100);
      if (!title) continue;
      const raw = str(fd, `prize_amount_${i}`, 20).replace(/[^\d]/g, "");
      prizes.push({ title, amount: raw ? Number(raw) : null, description: str(fd, `prize_desc_${i}`, 300) });
    }
    const earlyRaw = str(fd, "early_fee_amount", 12);
    const earlyFee = earlyRaw === "" ? null : Math.max(0, Math.round(Number(earlyRaw) || 0));
    const earlyEnds = istToIso(str(fd, "early_bird_ends_at", 20));
    if (earlyFee != null && !earlyEnds) throw new PortalError("Set when the early-bird fee ends.");
    const paymentLink = str(fd, "payment_link", 500);
    if (paymentLink && !/^https?:\/\//i.test(paymentLink)) throw new PortalError("Payment link must start with http:// or https://");

    const values = [
      slug,
      title,
      str(fd, "tagline", 200) || null,
      str(fd, "description", 8000) || null,
      str(fd, "venue", 200) || null,
      istToIso(str(fd, "starts_at", 20)),
      istToIso(str(fd, "ends_at", 20)),
      oneOf(str(fd, "visibility"), ["hidden", "unlisted", "public"] as const, "hidden"),
      oneOf(str(fd, "status"), ["active", "archived"] as const, "active"),
      oneOf(str(fd, "registration_mode"), ["open", "allowlist"] as const, "open"),
      participation,
      minSize,
      maxSize,
      istToIso(str(fd, "reg_opens_at", 20)),
      istToIso(str(fd, "reg_closes_at", 20)),
      JSON.stringify(fields),
      Math.max(0, Math.round(num(fd, "fee_amount", 0))),
      oneOf(str(fd, "fee_currency"), ["INR", "USD"] as const, "INR"),
      oneOf(str(fd, "fee_scope"), ["per_team", "per_member"] as const, "per_team"),
      paymentLink || null,
      Math.max(1, Math.min(20, num(fd, "winners_count", 3))),
      JSON.stringify(prizes),
      str(fd, "prize_pool", 60) || null,
      earlyFee,
      earlyEnds,
      now(),
    ];

    if (existingId) {
      await run(
        `UPDATE events SET slug=?, title=?, tagline=?, description=?, venue=?, starts_at=?, ends_at=?, visibility=?, status=?, registration_mode=?,
           participation=?, min_team_size=?, max_team_size=?, reg_opens_at=?, reg_closes_at=?, submission_fields=?, fee_amount=?, fee_currency=?,
           fee_scope=?, payment_link=?, winners_count=?, prizes=?, prize_pool=?, early_fee_amount=?, early_bird_ends_at=?, updated_at=? WHERE id=?`,
        [...values, existingId]
      );
    } else {
      savedId = newId();
      await batch([
        {
          sql: `INSERT INTO events (slug, title, tagline, description, venue, starts_at, ends_at, visibility, status, registration_mode,
                  participation, min_team_size, max_team_size, reg_opens_at, reg_closes_at, submission_fields, fee_amount, fee_currency,
                  fee_scope, payment_link, winners_count, prizes, prize_pool, early_fee_amount, early_bird_ends_at, updated_at, id, created_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          params: [...values, savedId, now()],
        },
        // Every event starts with one round so submissions work out of the box.
        {
          sql: "INSERT INTO event_rounds (id, event_id, seq, name, criteria) VALUES (?, ?, 1, 'Round 1', ?)",
          params: [newId(), savedId, JSON.stringify([{ key: "innovation", label: "Innovation", max: 10 }, { key: "execution", label: "Execution", max: 10 }, { key: "presentation", label: "Presentation", max: 10 }])],
        },
      ]);
    }
    revalidatePath("/events");
    return existingId ? "Event saved." : "Event created. Add rounds, then set visibility to Public when ready.";
  }, () => base(savedId));
}

export async function saveAllowlistAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "event_id", 40);
  await guarded(`${base(id)}?tab=participants`, async () => {
    const raw = String(fd.get("emails") ?? "");
    const emails = [...new Set(raw.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))];
    const invalid = emails.filter((e) => !isEmail(e));
    if (invalid.length) throw new PortalError(`Invalid email(s): ${invalid.slice(0, 5).join(", ")}${invalid.length > 5 ? "…" : ""}`);
    const replace = str(fd, "mode", 10) === "replace";
    const stmts: Statement[] = replace ? [{ sql: "DELETE FROM event_allowlist WHERE event_id = ?", params: [id] }] : [];
    for (const e of emails) stmts.push({ sql: "INSERT OR IGNORE INTO event_allowlist (event_id, email) VALUES (?, ?)", params: [id, e] });
    await batchChunked(stmts, 100);
    const total = await first<{ n: number }>("SELECT COUNT(*) AS n FROM event_allowlist WHERE event_id = ?", [id]);
    return `Invite list updated: ${total?.n ?? 0} email(s).`;
  });
}

// ─── Rounds ───────────────────────────────────────────────────────────

export async function saveRoundAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=rounds`, async () => {
    const roundId = str(fd, "round_id", 40);
    const name = str(fd, "name", 80);
    if (!name) throw new PortalError("Round name is required.");
    const criteria: Criterion[] = [];
    for (let i = 0; i < 10; i++) {
      const label = str(fd, `crit_label_${i}`, 60);
      if (!label) continue;
      const max = num(fd, `crit_max_${i}`, 10);
      if (!(max > 0 && max <= 1000)) throw new PortalError(`Max score for "${label}" must be between 1 and 1000.`);
      criteria.push({ key: str(fd, `crit_key_${i}`, 40) || slugify(label).replace(/-/g, "_") || `c${i + 1}`, label, max });
    }
    if (criteria.length === 0) throw new PortalError("Add at least one scoring category.");
    const deadline = istToIso(str(fd, "deadline", 20));
    const aggregation = str(fd, "aggregation", 10) === "sum" ? "sum" : "average";
    if (roundId) {
      await run("UPDATE event_rounds SET name = ?, criteria = ?, submission_deadline = ?, aggregation = ? WHERE id = ? AND event_id = ?", [
        name,
        JSON.stringify(criteria),
        deadline,
        aggregation,
        roundId,
        eventId,
      ]);
    } else {
      const last = await first<{ seq: number }>("SELECT MAX(seq) AS seq FROM event_rounds WHERE event_id = ?", [eventId]);
      await run("INSERT INTO event_rounds (id, event_id, seq, name, criteria, submission_deadline, aggregation) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        newId(),
        eventId,
        (last?.seq ?? 0) + 1,
        name,
        JSON.stringify(criteria),
        deadline,
        aggregation,
      ]);
    }
    return "Round saved.";
  });
}

export async function deleteRoundAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=rounds`, async () => {
    const roundId = str(fd, "round_id", 40);
    const round = await first<RoundRow>("SELECT * FROM event_rounds WHERE id = ? AND event_id = ?", [roundId, eventId]);
    if (!round) throw new PortalError("Round not found.");
    const later = await first("SELECT 1 FROM event_rounds WHERE event_id = ? AND seq > ?", [eventId, round.seq]);
    if (later) throw new PortalError("Delete later rounds first.");
    await run("DELETE FROM event_rounds WHERE id = ?", [roundId]);
    return "Round deleted (with its submissions and scores).";
  });
}

export async function setRoundFlagAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  const tab = str(fd, "tab", 20) || "rounds";
  await guarded(`${base(eventId)}?tab=${tab}`, async () => {
    const flag = str(fd, "flag", 30);
    if (flag !== "submissions_open" && flag !== "scores_published") throw new PortalError("Invalid setting.");
    const value = str(fd, "value", 2) === "1" ? 1 : 0;
    await run(`UPDATE event_rounds SET ${flag} = ? WHERE id = ? AND event_id = ?`, [value, str(fd, "round_id", 40), eventId]);
    if (flag === "submissions_open") return value ? "Submissions opened." : "Submissions closed.";
    return value ? "Scores published — teams can now see their scores and qualification." : "Scores hidden from teams.";
  });
}

export async function assignEvaluatorsAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=rounds`, async () => {
    const ids = fd.getAll("evaluator").map(String).filter(Boolean);
    await batch([
      { sql: "DELETE FROM event_evaluators WHERE event_id = ?", params: [eventId] },
      ...ids.map((uid) => ({ sql: "INSERT OR IGNORE INTO event_evaluators (event_id, user_id) VALUES (?, ?)", params: [eventId, uid] })),
    ]);
    return `${ids.length} evaluator(s) assigned.`;
  });
}

// ─── Qualification & results ──────────────────────────────────────────

export async function setQualifiedAction(fd: FormData) {
  const admin = await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=scores&round=${str(fd, "round_id", 40)}`, async () => {
    const roundId = str(fd, "round_id", 40);
    const qualified = str(fd, "qualified", 2) === "1" ? 1 : 0;
    await run(
      `INSERT INTO round_results (round_id, team_id, qualified, decided_by, updated_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(round_id, team_id) DO UPDATE SET qualified = excluded.qualified, decided_by = excluded.decided_by, updated_at = excluded.updated_at`,
      [roundId, str(fd, "team_id", 40), qualified, admin.id, now()]
    );
  });
}

// Marks the top N teams (by average total) as qualified and the rest as not qualified.
export async function qualifyTopAction(fd: FormData) {
  const admin = await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  const roundId = str(fd, "round_id", 40);
  await guarded(`${base(eventId)}?tab=scores&round=${roundId}`, async () => {
    const n = Math.max(0, num(fd, "top_n", 0));
    const minScore = str(fd, "min_score", 10) ? num(fd, "min_score", 0) : null;
    const round = await first<RoundRow>("SELECT * FROM event_rounds WHERE id = ? AND event_id = ?", [roundId, eventId]);
    if (!round) throw new PortalError("Round not found.");
    const board = (await roundLeaderboard(round)).filter((t) => t.avg_total != null);
    if (board.length === 0) throw new PortalError("No scored teams in this round yet.");
    const picked = new Set(
      board.filter((t, i) => (n > 0 ? i < n : true) && (minScore == null || (t.avg_total ?? 0) >= minScore)).map((t) => t.team_id)
    );
    await batchChunked(
      board.map((t) => ({
        sql: `INSERT INTO round_results (round_id, team_id, qualified, decided_by, updated_at) VALUES (?, ?, ?, ?, ?)
              ON CONFLICT(round_id, team_id) DO UPDATE SET qualified = excluded.qualified, decided_by = excluded.decided_by, updated_at = excluded.updated_at`,
        params: [roundId, t.team_id, picked.has(t.team_id) ? 1 : 0, admin.id, now()],
      }))
    );
    return `${picked.size} team(s) marked as qualified.`;
  });
}

export async function saveRanksAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=results`, async () => {
    const teams = await all<{ id: string }>("SELECT id FROM teams WHERE event_id = ?", [eventId]);
    const used = new Set<number>();
    const stmts: Statement[] = [];
    for (const t of teams) {
      const raw = str(fd, `rank_${t.id}`, 4);
      const rank = raw ? Math.round(Number(raw)) : null;
      if (rank != null) {
        if (!(rank >= 1 && rank <= 100)) throw new PortalError("Ranks must be between 1 and 100.");
        if (used.has(rank)) throw new PortalError(`Rank ${rank} is assigned to more than one team.`);
        used.add(rank);
      }
      stmts.push({ sql: "UPDATE teams SET final_rank = ? WHERE id = ?", params: [rank, t.id] });
    }
    await batchChunked(stmts);
    return "Rankings saved.";
  });
}

// Ranks teams by their average total in the final round.
export async function autoRankAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=results`, async () => {
    const event = await getEventById(eventId);
    const rounds = await getRounds(eventId);
    const finalRound = rounds.at(-1);
    if (!event || !finalRound) throw new PortalError("Add a round first.");
    const board = (await roundLeaderboard(finalRound)).filter((t) => t.avg_total != null);
    if (board.length === 0) throw new PortalError(`No scores in ${finalRound.name} yet.`);
    await batchChunked([
      { sql: "UPDATE teams SET final_rank = NULL WHERE event_id = ?", params: [eventId] },
      ...board.slice(0, event.winners_count).map((t, i) => ({ sql: "UPDATE teams SET final_rank = ? WHERE id = ?", params: [i + 1, t.team_id] })),
    ]);
    return `Top ${Math.min(event.winners_count, board.length)} teams ranked from ${finalRound.name} scores. Review, then publish.`;
  });
}

export async function publishWinnersAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=results`, async () => {
    const publish = str(fd, "publish", 2) === "1";
    await run("UPDATE events SET winners_published = ?, updated_at = ? WHERE id = ?", [publish ? 1 : 0, now(), eventId]);
    if (!publish) return "Results hidden from the portal.";

    let queued = 0;
    if (bool(fd, "notify")) {
      const subject = str(fd, "subject", 200);
      const body = str(fd, "body", 10000);
      if (!subject || !body) throw new PortalError("Enter the winners email subject and message, or untick 'Email winners'.");
      const recipients = await resolveAudience(`event:${eventId}`, "winners");
      await batchChunked(
        recipients.map((r) =>
          outboxInsert({
            to: r.email,
            toName: r.name,
            subject: fillTemplate(subject, r.vars),
            html: emailLayout(fillTemplate(subject, r.vars), textToHtml(fillTemplate(body, r.vars))),
            scope: `event:${eventId}`,
          })
        )
      );
      queued = recipients.length;
    }
    revalidatePath("/events");
    return `Results announced on the portal${queued ? ` and ${queued} winner email(s) queued` : ""}.`;
  });
}

// ─── Teams & registrations ────────────────────────────────────────────

export async function adminSetEventPaymentAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=participants`, async () => {
    const status = str(fd, "status", 20) as PaymentStatus;
    if (!PAYMENT_STATUSES.includes(status)) throw new PortalError("Invalid payment status.");
    await applyPaymentStatus("event", `${eventId}:${str(fd, "user_id", 40)}`, status, str(fd, "payment_ref", 120) || null);
    return status === "paid" ? "Marked paid — invoice issued and emailed." : "Payment status updated.";
  });
}

export async function adminRemoveRegistrationAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=participants`, async () => {
    const userId = str(fd, "user_id", 40);
    const team = await first<{ id: string; lead_user_id: string }>(
      "SELECT t.id, t.lead_user_id FROM teams t JOIN registrations r ON r.team_id = t.id WHERE r.event_id = ? AND r.user_id = ?",
      [eventId, userId]
    );
    const stmts: Statement[] = [{ sql: "DELETE FROM registrations WHERE event_id = ? AND user_id = ?", params: [eventId, userId] }];
    if (team?.lead_user_id === userId) {
      // Hand the team to the earliest remaining member, or delete it when empty.
      stmts.push(
        {
          sql: `UPDATE registrations SET member_role = 'lead' WHERE event_id = ? AND user_id =
                  (SELECT user_id FROM registrations WHERE team_id = ? AND user_id != ? ORDER BY registered_at LIMIT 1)`,
          params: [eventId, team.id, userId],
        },
        {
          sql: `UPDATE teams SET lead_user_id = COALESCE((SELECT user_id FROM registrations WHERE team_id = ? AND user_id != ? ORDER BY registered_at LIMIT 1), lead_user_id) WHERE id = ?`,
          params: [team.id, userId, team.id],
        },
        { sql: "DELETE FROM teams WHERE id = ? AND NOT EXISTS (SELECT 1 FROM registrations WHERE team_id = ?)", params: [team.id, team.id] }
      );
    }
    await batch(stmts);
    return "Participant removed from the event.";
  });
}

export async function adminDeleteTeamAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  await guarded(`${base(eventId)}?tab=participants`, async () => {
    const teamId = str(fd, "team_id", 40);
    await batch([
      { sql: "UPDATE registrations SET team_id = NULL, member_role = 'member' WHERE team_id = ? AND event_id = ?", params: [teamId, eventId] },
      { sql: "DELETE FROM teams WHERE id = ? AND event_id = ?", params: [teamId, eventId] },
    ]);
    return "Team deleted; its members are still registered.";
  });
}

// ─── Purge ─────────────────────────────────────────────────────────────

export async function purgeEventAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  const event = await getEventById(eventId);
  const back = `${base(eventId)}?tab=export`;
  const purgeMode = str(fd, "mode", 10);
  await guarded(back, async () => {
    if (!event) throw new PortalError("Event not found.");
    if (str(fd, "confirm", 80) !== event.slug) throw new PortalError(`Type "${event.slug}" to confirm.`);
    const scope = `event:${eventId}`;
    // Order matters: children before parents (foreign keys are enforced).
    const stmts: Statement[] = [
      { sql: "DELETE FROM scores WHERE round_id IN (SELECT id FROM event_rounds WHERE event_id = ?)", params: [eventId] },
      { sql: "DELETE FROM round_results WHERE round_id IN (SELECT id FROM event_rounds WHERE event_id = ?)", params: [eventId] },
      { sql: "DELETE FROM submissions WHERE round_id IN (SELECT id FROM event_rounds WHERE event_id = ?)", params: [eventId] },
      { sql: "DELETE FROM registrations WHERE event_id = ?", params: [eventId] },
      { sql: "DELETE FROM teams WHERE event_id = ?", params: [eventId] },
      { sql: "DELETE FROM event_allowlist WHERE event_id = ?", params: [eventId] },
      { sql: "DELETE FROM payments WHERE purpose = 'event' AND ref_id LIKE ?", params: [`${eventId}:%`] },
      { sql: "DELETE FROM certificate_templates WHERE scope = ?", params: [scope] },
      { sql: "DELETE FROM email_templates WHERE scope = ?", params: [scope] },
      { sql: "DELETE FROM email_outbox WHERE scope = ?", params: [scope] },
    ];
    if (purgeMode === "all") {
      stmts.push({ sql: "DELETE FROM event_evaluators WHERE event_id = ?", params: [eventId] }, { sql: "DELETE FROM event_rounds WHERE event_id = ?", params: [eventId] }, { sql: "DELETE FROM events WHERE id = ?", params: [eventId] });
    } else {
      stmts.push({ sql: "UPDATE events SET status = 'archived', winners_published = 0, updated_at = ? WHERE id = ?", params: [now(), eventId] });
    }
    await batch(stmts);
    revalidatePath("/events");
    return purgeMode === "all" ? "Event and all its data deleted." : "All participant data for this event was deleted. The event is archived.";
  }, purgeMode === "all" ? "/admin/events" : back);
}

// Removes one evaluator's scores for a team (e.g. a duplicate or mistaken evaluation).
export async function deleteEvaluationAction(fd: FormData) {
  await requireAdmin();
  const eventId = str(fd, "event_id", 40);
  const roundId = str(fd, "round_id", 40);
  await guarded(`${base(eventId)}?tab=scores&round=${roundId}`, async () => {
    const round = await first("SELECT 1 FROM event_rounds WHERE id = ? AND event_id = ?", [roundId, eventId]);
    if (!round) throw new PortalError("Round not found.");
    await run("DELETE FROM scores WHERE round_id = ? AND team_id = ? AND evaluator_id = ?", [roundId, str(fd, "team_id", 40), str(fd, "evaluator_id", 40)]);
    return "Evaluation removed; the team's score was recalculated.";
  });
}
