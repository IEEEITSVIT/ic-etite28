import { NextResponse, type NextRequest } from "next/server";
import JSZip from "jszip";
import { all, first, parseJson } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { toCsv } from "@/lib/portal/csv";
import { getRounds, roundCriteria, roundLeaderboard, submissionFields, type EventRow } from "@/lib/portal/events";
import { certificateRecipients } from "@/lib/certificates/server";
import { rankLabel, safeFilename } from "@/lib/certificates/render";

export const maxDuration = 60;

// Downloads everything for a scope as a ZIP of CSV files (before purging data).
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const scope = req.nextUrl.searchParams.get("scope") ?? "";
  const zip = new JSZip();
  let name = "export";

  if (scope.startsWith("event:")) {
    const event = await first<EventRow>("SELECT * FROM events WHERE id = ?", [scope.slice(6)]);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    name = event.slug;
    await exportEvent(zip, event);
  } else if (scope === "technext") {
    name = "technext";
    await exportTechnext(zip);
  } else if (scope === "conference") {
    name = "conference";
    await exportConference(zip);
  } else {
    return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
  }

  const bytes = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${safeFilename(`${name}-export-${stamp}`)}.zip"`,
      "cache-control": "no-store",
    },
  });
}

async function exportEvent(zip: JSZip, e: EventRow) {
  const [people, teams, rounds] = await Promise.all([
    all<Record<string, unknown>>(
      `SELECT u.name, u.email, u.phone, u.institution, u.department, u.year_of_study, u.city, t.name AS team, t.code AS team_code,
              r.member_role, r.payment_status, r.payment_amount, r.payment_currency, r.payment_ref, r.registered_at
         FROM registrations r JOIN users u ON u.id = r.user_id LEFT JOIN teams t ON t.id = r.team_id
        WHERE r.event_id = ? ORDER BY t.name, r.member_role = 'lead' DESC, u.name`,
      [e.id]
    ),
    all<{ id: string; name: string; code: string; final_rank: number | null; created_at: string }>("SELECT id, name, code, final_rank, created_at FROM teams WHERE event_id = ? ORDER BY name", [e.id]),
    getRounds(e.id),
  ]);
  const cols = ["name", "email", "phone", "institution", "department", "year_of_study", "city", "team", "team_code", "member_role", "payment_status", "payment_amount", "payment_currency", "payment_ref", "registered_at"];
  zip.file("participants.csv", toCsv(cols, people.map((p) => cols.map((c) => p[c]))));

  const members = await all<{ team_id: string; name: string; email: string; phone: string | null; member_role: string }>(
    "SELECT r.team_id, u.name, u.email, u.phone, r.member_role FROM registrations r JOIN users u ON u.id = r.user_id WHERE r.event_id = ? AND r.team_id IS NOT NULL",
    [e.id]
  );
  const byTeam = new Map<string, typeof members>();
  for (const m of members) byTeam.set(m.team_id, [...(byTeam.get(m.team_id) ?? []), m]);
  const teamRow = (t: (typeof teams)[number]) => {
    const ms = byTeam.get(t.id) ?? [];
    const lead = ms.find((m) => m.member_role === "lead");
    return [t.name, t.code, lead?.name, lead?.email, lead?.phone, ms.length, ms.map((m) => m.name).join("; "), ms.map((m) => m.email).join("; "), ms.map((m) => m.phone ?? "").join("; ")];
  };
  const teamCols = ["team", "code", "lead_name", "lead_email", "lead_phone", "members", "member_names", "member_emails", "member_phones"];
  zip.file("teams.csv", toCsv([...teamCols, "final_rank", "created_at"], teams.map((t) => [...teamRow(t), t.final_rank, t.created_at])));

  const fields = submissionFields(e);
  const teamName = new Map(teams.map((t) => [t.id, t.name]));
  for (const r of rounds) {
    const prefix = `round-${r.seq}`;
    const subs = await all<{ team_id: string; data: string; updated_at: string }>("SELECT team_id, data, updated_at FROM submissions WHERE round_id = ?", [r.id]);
    zip.file(
      `${prefix}-submissions.csv`,
      toCsv(["team", ...fields.map((f) => f.label), "updated_at"], subs.map((s) => {
        const d = parseJson<Record<string, string>>(s.data, {});
        return [teamName.get(s.team_id), ...fields.map((f) => d[f.key] ?? ""), s.updated_at];
      }))
    );
    const criteria = roundCriteria(r);
    const scores = await all<{ team_id: string; evaluator: string; scores: string; total: number; comment: string | null; updated_at: string }>(
      "SELECT s.team_id, u.name AS evaluator, s.scores, s.total, s.comment, s.updated_at FROM scores s JOIN users u ON u.id = s.evaluator_id WHERE s.round_id = ?",
      [r.id]
    );
    zip.file(
      `${prefix}-scores.csv`,
      toCsv(["team", "evaluator", ...criteria.map((c) => `${c.label} (/${c.max})`), "total", "comment", "updated_at"], scores.map((s) => {
        const v = parseJson<Record<string, number>>(s.scores, {});
        return [teamName.get(s.team_id), s.evaluator, ...criteria.map((c) => v[c.key] ?? ""), s.total, s.comment, s.updated_at];
      }))
    );
    const board = await roundLeaderboard(r);
    zip.file(
      `${prefix}-results.csv`,
      toCsv(["position", "team", ...criteria.map((c) => `avg ${c.label}`), "avg_total", "evaluations", "qualified"], board.map((b, i) => [
        i + 1,
        b.team_name,
        ...criteria.map((c) => b.criteria[c.key] ?? ""),
        b.avg_total ?? "",
        b.evaluations,
        b.qualified == null ? "" : b.qualified ? "yes" : "no",
      ]))
    );
    const qualifiedTeams = teams.filter((t) => board.find((b) => b.team_id === t.id)?.qualified === 1);
    zip.file(`${prefix}-qualifiers.csv`, toCsv(teamCols, qualifiedTeams.map(teamRow)));
  }

  const winners = teams.filter((t) => t.final_rank != null && t.final_rank <= e.winners_count).sort((a, b) => a.final_rank! - b.final_rank!);
  zip.file("winners.csv", toCsv(["rank", "position", ...teamCols], winners.map((t) => [t.final_rank, rankLabel(t.final_rank), ...teamRow(t)])));

  for (const kind of ["participation", "winner"] as const) {
    const recips = await certificateRecipients(`event:${e.id}`, kind);
    zip.file(`certificates-${kind}.csv`, toCsv(["name", "email", "team", "position"], recips.map((r) => [r.values.name, r.email, r.values.team, r.values.rank])));
  }
}

async function exportTechnext(zip: JSZip) {
  const rows = await all<Record<string, unknown>>("SELECT * FROM technext_bookings ORDER BY created_at");
  const cols = [
    "organization_name", "organization_type", "sector", "contact_name", "designation", "email", "phone", "city", "state", "website",
    "stall_type", "representatives", "exhibit_description", "power_required", "special_requirements", "gst_number", "status",
    "payment_status", "payment_amount", "payment_currency", "payment_ref", "admin_notes", "created_at",
  ];
  zip.file(
    "technext-bookings.csv",
    toCsv(cols, rows.map((r) => cols.map((c) => (c === "representatives" ? parseJson<string[]>(r[c], []).join("; ") : c === "power_required" ? (r[c] ? "yes" : "no") : r[c]))))
  );
}

async function exportConference(zip: JSZip) {
  const rows = await all<Record<string, unknown>>(
    `SELECT u.name, u.email, u.phone, c.category_label, c.residency, c.ieee_member, c.ieee_number, c.affiliation, c.designation, c.country,
            c.paper_ids, c.paper_titles, c.presenting_author, c.status, c.payment_status, c.payment_amount, c.payment_currency, c.payment_ref,
            c.admin_notes, c.created_at
       FROM conference_registrations c JOIN users u ON u.id = c.user_id ORDER BY c.created_at`
  );
  const cols = Object.keys(rows[0] ?? { name: 1, email: 1 });
  zip.file("conference-registrations.csv", toCsv(cols, rows.map((r) => cols.map((c) => r[c]))));
}
