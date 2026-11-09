import "server-only";
import { all, first } from "@/lib/db";
import { rankLabel } from "@/lib/certificates/render";
import { SITE_URL } from "@/lib/seo";
import type { TemplateVars } from "@/lib/email/mailer";

export interface Recipient {
  userId: string;
  email: string;
  name: string;
  vars: TemplateVars;
}

export interface AudienceOption {
  value: string;
  label: string;
}

export const PLACEHOLDERS = ["name", "email", "team", "teamCode", "event", "round", "rank", "score", "portalUrl"];

// Audiences available to an admin when emailing from a scope.
export async function audienceOptions(scope: string): Promise<AudienceOption[]> {
  if (scope.startsWith("event:")) {
    const rounds = await all<{ id: string; seq: number; name: string }>("SELECT id, seq, name FROM event_rounds WHERE event_id = ? ORDER BY seq", [scope.slice(6)]);
    return [
      { value: "all", label: "All registered participants" },
      { value: "no_team", label: "Registered but not in a team" },
      { value: "unpaid", label: "Payment due" },
      ...rounds.flatMap((r) => [
        { value: `qualified:${r.id}`, label: `Qualified in round ${r.seq} (${r.name})` },
        { value: `not_qualified:${r.id}`, label: `Not qualified in round ${r.seq} (${r.name})` },
      ]),
      { value: "winners", label: "Winners (top teams)" },
    ];
  }
  if (scope === "technext") {
    return [
      { value: "all", label: "All stall bookings" },
      { value: "approved", label: "Approved exhibitors" },
      { value: "pending", label: "Pending review" },
      { value: "unpaid", label: "Payment due" },
    ];
  }
  if (scope === "conference") {
    return [
      { value: "all", label: "All conference registrations" },
      { value: "confirmed", label: "Confirmed registrations" },
      { value: "unpaid", label: "Payment due" },
    ];
  }
  return [];
}

export async function resolveAudience(scope: string, audience: string): Promise<Recipient[]> {
  const portalUrl = `${SITE_URL}/dashboard`;

  if (scope.startsWith("event:")) {
    const eventId = scope.slice(6);
    const event = await first<{ title: string; slug: string; winners_count: number }>("SELECT title, slug, winners_count FROM events WHERE id = ?", [eventId]);
    if (!event) return [];
    const eventUrl = `${SITE_URL}/events/${event.slug}`;

    let where = "";
    const params: unknown[] = [eventId];
    let roundName = "";
    let roundId: string | null = null;
    const [kind, arg] = audience.split(":");
    if (kind === "no_team") where = "AND r.team_id IS NULL";
    else if (kind === "unpaid") where = "AND r.payment_status IN ('unpaid','pending','failed')";
    else if (kind === "winners") {
      where = "AND t.final_rank IS NOT NULL AND t.final_rank <= ?";
      params.push(event.winners_count);
    } else if (kind === "qualified" || kind === "not_qualified") {
      roundId = arg;
      const round = await first<{ seq: number; name: string }>("SELECT seq, name FROM event_rounds WHERE id = ? AND event_id = ?", [arg, eventId]);
      if (!round) return [];
      roundName = `Round ${round.seq}: ${round.name}`;
      where =
        kind === "qualified"
          ? "AND EXISTS (SELECT 1 FROM round_results rr WHERE rr.round_id = ? AND rr.team_id = r.team_id AND rr.qualified = 1)"
          : "AND r.team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM round_results rr WHERE rr.round_id = ? AND rr.team_id = r.team_id AND rr.qualified = 1)";
      params.push(arg);
    } else if (kind !== "all") return [];

    const rows = await all<{ user_id: string; email: string; name: string; team: string | null; code: string | null; final_rank: number | null; team_id: string | null }>(
      `SELECT u.id AS user_id, u.email, u.name, t.name AS team, t.code, t.final_rank, t.id AS team_id
         FROM registrations r JOIN users u ON u.id = r.user_id LEFT JOIN teams t ON t.id = r.team_id
        WHERE r.event_id = ? ${where} ORDER BY t.name, u.name`,
      params
    );

    // Average round score per team, for {{score}}.
    const scoreByTeam = new Map<string, number>();
    if (roundId) {
      const scores = await all<{ team_id: string; avg_total: number }>("SELECT team_id, AVG(total) AS avg_total FROM scores WHERE round_id = ? GROUP BY team_id", [roundId]);
      for (const s of scores) scoreByTeam.set(s.team_id, Math.round(s.avg_total * 100) / 100);
    }

    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      name: r.name,
      vars: {
        name: r.name,
        email: r.email,
        team: r.team ?? "",
        teamCode: r.code ?? "",
        event: event.title,
        round: roundName,
        rank: rankLabel(r.final_rank),
        score: r.team_id ? (scoreByTeam.get(r.team_id) ?? "") : "",
        portalUrl: eventUrl,
      },
    }));
  }

  if (scope === "technext") {
    const where =
      audience === "approved" ? "AND status = 'approved'" : audience === "pending" ? "AND status = 'pending'" : audience === "unpaid" ? "AND payment_status IN ('unpaid','pending','failed') AND status != 'rejected'" : "";
    const rows = await all<{ user_id: string; email: string; contact_name: string; organization_name: string }>(
      `SELECT user_id, email, contact_name, organization_name FROM technext_bookings WHERE status != 'cancelled' ${where} ORDER BY organization_name`
    );
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      name: r.contact_name,
      vars: { name: r.contact_name, email: r.email, team: r.organization_name, event: "TechNext '28", portalUrl },
    }));
  }

  if (scope === "conference") {
    const where = audience === "confirmed" ? "AND c.status = 'confirmed'" : audience === "unpaid" ? "AND c.payment_status IN ('unpaid','pending','failed')" : "";
    const rows = await all<{ user_id: string; email: string; name: string; affiliation: string }>(
      `SELECT c.user_id, u.email, u.name, c.affiliation FROM conference_registrations c JOIN users u ON u.id = c.user_id
        WHERE c.status != 'cancelled' ${where} ORDER BY u.name`
    );
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      name: r.name,
      vars: { name: r.name, email: r.email, team: r.affiliation, event: "ic-ETITE'28", portalUrl },
    }));
  }

  return [];
}
