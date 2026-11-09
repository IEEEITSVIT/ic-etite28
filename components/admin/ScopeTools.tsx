import { all, parseJson } from "@/lib/db";
import { audienceOptions, PLACEHOLDERS } from "@/lib/portal/audience";
import { certificateRecipients } from "@/lib/certificates/server";
import { DEFAULT_LAYOUT, type CertLayout } from "@/lib/certificates/render";
import EmailComposer from "@/components/admin/EmailComposer";
import CertificateManager, { type TemplateMeta } from "@/components/admin/CertificateManager";
import { Card, btnPrimary } from "@/components/portal/ui";

// Email, certificate and export tools for the TechNext and conference admin pages.
export default async function ScopeTools({ scope, back, label }: { scope: "technext" | "conference"; back: string; label: string }) {
  const [templates, audiences, certRows, eligible] = await Promise.all([
    all<{ id: string; name: string; subject: string; body: string }>("SELECT id, name, subject, body FROM email_templates WHERE scope = ? ORDER BY name", [scope]),
    audienceOptions(scope),
    all<{ kind: "participation" | "winner"; width: number; height: number; mime: string; layout: string; released: number; updated_at: string }>(
      "SELECT kind, width, height, mime, layout, released, updated_at FROM certificate_templates WHERE scope = ?",
      [scope]
    ),
    certificateRecipients(scope, "participation"),
  ]);
  const certTemplates: TemplateMeta[] = certRows.map((r) => ({ ...r, layout: parseJson<CertLayout>(r.layout, DEFAULT_LAYOUT) }));
  return (
    <div className="mt-6 space-y-6">
      <Card title={`Email ${label}`}>
        <EmailComposer scope={scope} back={back} templates={templates} audiences={audiences} certKinds={certRows.map((c) => c.kind)} placeholders={PLACEHOLDERS.filter((p) => !["teamCode", "round", "rank", "score"].includes(p))} />
      </Card>
      <Card title="Certificates">
        <CertificateManager scope={scope} back={back} kinds={["participation"]} templates={certTemplates} eligible={{ participation: eligible.length, winner: 0 }} />
        <p className="mt-3 text-sm text-slate-500">{scope === "technext" ? "Issued to approved exhibitors (contact person and organisation)." : "Issued to confirmed registrations."}</p>
      </Card>
      <Card title="Export">
        <a href={`/api/admin/export?scope=${scope}`} className={btnPrimary}>
          Download all {label} (.zip of CSV)
        </a>
      </Card>
    </div>
  );
}
