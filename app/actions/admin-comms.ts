"use server";

import { requireAdmin } from "@/lib/auth/session";
import { batchChunked, now, run } from "@/lib/db";
import { emailLayout, fillTemplate, outboxInsert, textToHtml } from "@/lib/email/mailer";
import { resolveAudience } from "@/lib/portal/audience";
import { certificateRecipients, type CertKind } from "@/lib/certificates/server";
import { DEFAULT_LAYOUT, type CertLayout } from "@/lib/certificates/render";
import { guarded, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { newId } from "@/lib/portal/ids";

const validScope = (scope: string) => {
  if (scope === "technext" || scope === "conference" || /^event:[\w-]+$/.test(scope)) return scope;
  throw new PortalError("Invalid scope.");
};
const backPath = (fd: FormData) => {
  const b = str(fd, "back", 200);
  return b.startsWith("/admin") ? b : "/admin";
};

// ─── Email templates & bulk sends ─────────────────────────────────────

export async function saveEmailTemplateAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    const scope = validScope(str(fd, "scope", 80));
    const name = str(fd, "name", 80);
    const subject = str(fd, "subject", 200);
    const body = str(fd, "body", 10000);
    if (!name || !subject || !body) throw new PortalError("Template name, subject and body are required.");
    const id = str(fd, "id", 40) || newId();
    await run(
      `INSERT INTO email_templates (id, scope, name, subject, body, updated_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name, subject = excluded.subject, body = excluded.body, updated_at = excluded.updated_at`,
      [id, scope, name, subject, body, now()]
    );
    return `Template "${name}" saved.`;
  });
}

export async function deleteEmailTemplateAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    await run("DELETE FROM email_templates WHERE id = ?", [str(fd, "id", 40)]);
    return "Template deleted.";
  });
}

export async function queueEmailAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    const scope = validScope(str(fd, "scope", 80));
    const audience = str(fd, "audience", 80);
    const subject = str(fd, "subject", 200);
    const body = str(fd, "body", 10000);
    const attach = str(fd, "attach", 20) as CertKind | "";
    if (!subject || !body) throw new PortalError("Subject and message are required.");

    let recipients = await resolveAudience(scope, audience);
    if (attach) {
      const eligible = new Set((await certificateRecipients(scope, attach)).map((r) => r.userId));
      recipients = recipients.filter((r) => eligible.has(r.userId));
    }
    // One email per address even if someone appears twice.
    const seen = new Set<string>();
    recipients = recipients.filter((r) => !seen.has(r.email.toLowerCase()) && seen.add(r.email.toLowerCase()));
    if (recipients.length === 0) throw new PortalError("No recipients match that audience.");

    await batchChunked(
      recipients.map((r) => {
        const subj = fillTemplate(subject, r.vars);
        return outboxInsert({
          to: r.email,
          toName: r.name,
          subject: subj,
          html: emailLayout(subj, textToHtml(fillTemplate(body, r.vars))),
          scope,
          priority: 5,
          attachment: attach ? { type: "certificate", scope, kind: attach, userId: r.userId } : null,
        });
      })
    );
    return `${recipients.length} email(s) queued. Open Email & SMTP → Send queued emails to deliver them.`;
  });
}

// ─── Certificate templates ────────────────────────────────────────────

const MAX_IMAGE_B64 = 1_900_000; // D1 caps a single value at 2 MB

export async function saveCertificateTemplateAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    const scope = validScope(str(fd, "scope", 80));
    const kind = str(fd, "kind", 20) as CertKind;
    if (kind !== "participation" && kind !== "winner") throw new PortalError("Invalid certificate type.");

    let layout: CertLayout;
    try {
      layout = JSON.parse(String(fd.get("layout") ?? ""));
      if (!Array.isArray(layout.fields)) throw new Error();
    } catch {
      layout = DEFAULT_LAYOUT;
    }

    const image = String(fd.get("image_b64") ?? "");
    if (image) {
      const mime = str(fd, "mime", 20);
      const width = Number(fd.get("width"));
      const height = Number(fd.get("height"));
      if (mime !== "image/png" && mime !== "image/jpeg") throw new PortalError("Upload a PNG or JPEG image.");
      if (image.length > MAX_IMAGE_B64) throw new PortalError("Template image is too large. Use a JPEG under 1.4 MB.");
      if (!(width > 0 && height > 0)) throw new PortalError("Could not read the image size.");
      await run(
        `INSERT INTO certificate_templates (scope, kind, image_b64, mime, width, height, layout, released, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
         ON CONFLICT(scope, kind) DO UPDATE SET image_b64 = excluded.image_b64, mime = excluded.mime, width = excluded.width,
           height = excluded.height, layout = excluded.layout, updated_at = excluded.updated_at`,
        [scope, kind, image, mime, width, height, JSON.stringify(layout), now()]
      );
    } else {
      const res = await run("UPDATE certificate_templates SET layout = ?, updated_at = ? WHERE scope = ? AND kind = ?", [JSON.stringify(layout), now(), scope, kind]);
      if (res.changes === 0) throw new PortalError("Upload a template image first.");
    }
    return "Certificate template saved.";
  });
}

export async function setCertificateReleaseAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    const scope = validScope(str(fd, "scope", 80));
    const kind = str(fd, "kind", 20);
    const released = str(fd, "released", 2) === "1" ? 1 : 0;
    await run("UPDATE certificate_templates SET released = ? WHERE scope = ? AND kind = ?", [released, scope, kind]);
    return released ? "Certificates are now downloadable by recipients." : "Certificates hidden from recipients.";
  });
}

export async function deleteCertificateTemplateAction(fd: FormData) {
  await requireAdmin();
  const back = backPath(fd);
  await guarded(back, async () => {
    await run("DELETE FROM certificate_templates WHERE scope = ? AND kind = ?", [validScope(str(fd, "scope", 80)), str(fd, "kind", 20)]);
    return "Certificate template deleted.";
  });
}
