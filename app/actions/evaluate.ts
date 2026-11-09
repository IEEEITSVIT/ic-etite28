"use server";

import { requireRole, type SessionUser } from "@/lib/auth/session";
import { first, now, run } from "@/lib/db";
import { guarded, str } from "@/lib/portal/actions";
import { PortalError, roundCriteria, type RoundRow } from "@/lib/portal/events";

async function assertCanEvaluate(user: SessionUser, eventId: string) {
  if (user.role === "admin") return;
  const ok = await first("SELECT 1 FROM event_evaluators WHERE event_id = ? AND user_id = ?", [eventId, user.id]);
  if (!ok) throw new PortalError("You are not assigned to evaluate this event.");
}

async function loadRound(eventId: string, roundId: string) {
  const round = await first<RoundRow>("SELECT * FROM event_rounds WHERE id = ? AND event_id = ?", [roundId, eventId]);
  if (!round) throw new PortalError("Round not found.");
  return round;
}

export async function saveScoreAction(fd: FormData) {
  const user = await requireRole(["evaluator", "admin"], "/evaluate");
  const eventId = str(fd, "event_id", 40);
  const roundId = str(fd, "round_id", 40);
  const teamId = str(fd, "team_id", 40);
  const back = `/evaluate/${eventId}?round=${roundId}${str(fd, "q", 80) ? `&q=${encodeURIComponent(str(fd, "q", 80))}` : ""}#team-${teamId}`;
  await guarded(back, async () => {
    await assertCanEvaluate(user, eventId);
    const round = await loadRound(eventId, roundId);
    const team = await first("SELECT 1 FROM teams WHERE id = ? AND event_id = ?", [teamId, eventId]);
    if (!team) throw new PortalError("Team not found.");
    const scores: Record<string, number> = {};
    let total = 0;
    for (const c of roundCriteria(round)) {
      const raw = str(fd, `crit_${c.key}`, 10);
      const v = Number(raw);
      if (raw === "" || !Number.isFinite(v) || v < 0 || v > c.max) throw new PortalError(`${c.label} must be between 0 and ${c.max}.`);
      scores[c.key] = Math.round(v * 100) / 100;
      total += scores[c.key];
    }
    await run(
      `INSERT INTO scores (round_id, team_id, evaluator_id, scores, total, comment, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(round_id, team_id, evaluator_id) DO UPDATE SET scores = excluded.scores, total = excluded.total, comment = excluded.comment, updated_at = excluded.updated_at`,
      [roundId, teamId, user.id, JSON.stringify(scores), Math.round(total * 100) / 100, str(fd, "comment", 1000) || null, now()]
    );
    return "Score saved.";
  });
}

export async function evaluatorQualifyAction(fd: FormData) {
  const user = await requireRole(["evaluator", "admin"], "/evaluate");
  const eventId = str(fd, "event_id", 40);
  const roundId = str(fd, "round_id", 40);
  const teamId = str(fd, "team_id", 40);
  const back = `/evaluate/${eventId}?round=${roundId}#team-${teamId}`;
  await guarded(back, async () => {
    await assertCanEvaluate(user, eventId);
    await loadRound(eventId, roundId);
    const qualified = str(fd, "qualified", 2) === "1" ? 1 : 0;
    await run(
      `INSERT INTO round_results (round_id, team_id, qualified, decided_by, updated_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(round_id, team_id) DO UPDATE SET qualified = excluded.qualified, decided_by = excluded.decided_by, updated_at = excluded.updated_at`,
      [roundId, teamId, qualified, user.id, now()]
    );
    return qualified ? "Team marked as qualified for the next round." : "Qualification removed.";
  });
}
