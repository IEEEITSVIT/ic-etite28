import "server-only";
import { all, first, parseJson } from "@/lib/db";
import {
  DEFAULT_LAYOUT,
  rankLabel,
  renderCertificatePdf,
  safeFilename,
  type CertLayout,
  type CertValues,
  type TemplateImage,
} from "@/lib/certificates/render";

export type CertKind = "participation" | "winner";

export interface CertTemplateRow {
  scope: string;
  kind: CertKind;
  image_b64: string;
  mime: string;
  width: number;
  height: number;
  layout: string;
  updated_at: string;
}

export async function loadTemplate(scope: string, kind: CertKind): Promise<{ image: TemplateImage; layout: CertLayout } | null> {
  const row = await first<CertTemplateRow>("SELECT * FROM certificate_templates WHERE scope = ? AND kind = ?", [scope, kind]);
  if (!row) return null;
  return {
    image: { bytes: new Uint8Array(Buffer.from(row.image_b64, "base64")), mime: row.mime, width: row.width, height: row.height },
    layout: parseJson<CertLayout>(row.layout, DEFAULT_LAYOUT),
  };
}

export interface CertRecipient {
  userId: string;
  email: string;
  values: CertValues;
}

const formatDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) : "";

const CONFERENCE_DATE = "10-11 February 2028";

// Who is eligible for a certificate of this scope and kind, with the text printed on it.
export async function certificateRecipients(scope: string, kind: CertKind, userId?: string): Promise<CertRecipient[]> {
  const userFilter = userId ? " AND u.id = ?" : "";
  const extra = userId ? [userId] : [];

  if (scope.startsWith("event:")) {
    const eventId = scope.slice(6);
    const rows = await all<{
      user_id: string;
      name: string;
      email: string;
      institution: string | null;
      team: string | null;
      final_rank: number | null;
      title: string;
      winners_count: number;
      ends_at: string | null;
      starts_at: string | null;
    }>(
      `SELECT u.id AS user_id, u.name, u.email, u.institution, t.name AS team, t.final_rank,
              e.title, e.winners_count, e.ends_at, e.starts_at
         FROM registrations r
         JOIN users u ON u.id = r.user_id
         JOIN events e ON e.id = r.event_id
         LEFT JOIN teams t ON t.id = r.team_id
        WHERE r.event_id = ? ${kind === "winner" ? "AND t.final_rank IS NOT NULL AND t.final_rank <= e.winners_count" : ""} ${userFilter}
        ORDER BY t.final_rank IS NULL, t.final_rank, t.name, u.name`,
      [eventId, ...extra]
    );
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      values: {
        name: r.name,
        team: r.team ?? "",
        event: r.title,
        rank: kind === "winner" ? rankLabel(r.final_rank) : "",
        institution: r.institution ?? "",
        date: formatDate(r.ends_at ?? r.starts_at),
      },
    }));
  }

  if (scope === "technext") {
    const rows = await all<{ user_id: string; contact_name: string; email: string; organization_name: string; city: string }>(
      `SELECT b.user_id, b.contact_name, b.email, b.organization_name, b.city
         FROM technext_bookings b JOIN users u ON u.id = b.user_id
        WHERE b.status = 'approved' ${userFilter} ORDER BY b.organization_name`,
      extra
    );
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      values: { name: r.contact_name, team: r.organization_name, event: "TechNext '28", institution: r.city, date: CONFERENCE_DATE, rank: "" },
    }));
  }

  if (scope.startsWith("batch:")) {
    const batchId = scope.slice(6);
    const batch = await first<{ title: string; event_label: string | null; issue_date: string | null }>("SELECT title, event_label, issue_date FROM certificate_batches WHERE id = ?", [batchId]);
    if (!batch) return [];
    // For batches, `userId` is the recipient row id (recipients are matched to accounts by email).
    const rows = await all<{ id: string; email: string; name: string; data: string }>(
      `SELECT id, email, name, data FROM certificate_batch_recipients WHERE batch_id = ? ${userId ? "AND id = ?" : ""} ORDER BY name`,
      [batchId, ...extra]
    );
    const pick = (d: Record<string, string>, keys: string[]) => keys.map((k) => d[k]).find((v) => v) ?? "";
    return rows.map((r) => {
      const d = parseJson<Record<string, string>>(r.data, {});
      return {
        userId: r.id,
        email: r.email,
        values: {
          ...d,
          name: r.name,
          email: r.email,
          team: pick(d, ["team", "team_name", "organisation", "organization", "company"]),
          rank: pick(d, ["rank", "position", "award", "prize"]),
          institution: pick(d, ["institution", "college", "university", "affiliation"]),
          event: d.event || batch.event_label || batch.title,
          date: d.date || formatDate(batch.issue_date),
        },
      };
    });
  }

  if (scope === "conference") {
    const rows = await all<{ user_id: string; name: string; email: string; affiliation: string; category_label: string }>(
      `SELECT c.user_id, u.name, u.email, c.affiliation, c.category_label
         FROM conference_registrations c JOIN users u ON u.id = c.user_id
        WHERE c.status = 'confirmed' ${userFilter} ORDER BY u.name`,
      extra
    );
    return rows.map((r) => ({
      userId: r.user_id,
      email: r.email,
      values: { name: r.name, team: r.affiliation, institution: r.affiliation, event: "ic-ETITE'28", date: CONFERENCE_DATE, rank: "" },
    }));
  }

  return [];
}

export async function renderCertificateFor(scope: string, kind: CertKind, userId: string) {
  const [template, recipients] = await Promise.all([loadTemplate(scope, kind), certificateRecipients(scope, kind, userId)]);
  if (!template || recipients.length === 0) return null;
  const r = recipients[0];
  const bytes = await renderCertificatePdf(template.image, template.layout, r.values);
  return { bytes, filename: safeFilename(`certificate-${kind}-${r.values.name ?? "participant"}.pdf`) };
}
