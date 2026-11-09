"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { all, batch, batchChunked, first, now, run, type Statement } from "@/lib/db";
import { emailLayout, fillTemplate, outboxInsert, textToHtml } from "@/lib/email/mailer";
import { guarded, isEmail, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { newId } from "@/lib/portal/ids";
import { SITE_URL } from "@/lib/seo";

const page = (id: string) => `/admin/certificates/${id}`;

export async function createBatchAction(fd: FormData) {
  await requireAdmin();
  let id = "";
  await guarded(
    "/admin/certificates",
    async () => {
      const title = str(fd, "title", 120);
      if (title.length < 3) throw new PortalError("Give the batch a title, e.g. 'Workshop on Quantum ML — participants'.");
      id = newId();
      await run("INSERT INTO certificate_batches (id, title, event_label, issue_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)", [
        id,
        title,
        str(fd, "event_label", 150) || null,
        str(fd, "issue_date", 10) || null,
        now(),
        now(),
      ]);
      return "Batch created. Import the Excel sheet next.";
    },
    () => page(id)
  );
}

export async function updateBatchAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  await guarded(page(id), async () => {
    const title = str(fd, "title", 120);
    if (title.length < 3) throw new PortalError("Title is required.");
    await run("UPDATE certificate_batches SET title = ?, event_label = ?, issue_date = ?, updated_at = ? WHERE id = ?", [
      title,
      str(fd, "event_label", 150) || null,
      str(fd, "issue_date", 10) || null,
      now(),
      id,
    ]);
    return "Batch details saved.";
  });
}

interface ImportRow {
  name: string;
  email: string;
  data: Record<string, string>;
}

const MAX_ROWS = 5000;

// Rows are parsed from Excel/CSV in the admin's browser and posted as JSON.
export async function importRecipientsAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  await guarded(page(id), async () => {
    const exists = await first("SELECT 1 FROM certificate_batches WHERE id = ?", [id]);
    if (!exists) throw new PortalError("Batch not found.");
    let rows: ImportRow[];
    let columns: string[];
    try {
      rows = JSON.parse(String(fd.get("rows") ?? "[]"));
      columns = JSON.parse(String(fd.get("columns") ?? "[]"));
    } catch {
      throw new PortalError("Could not read the imported rows. Re-select the file.");
    }
    if (!Array.isArray(rows) || rows.length === 0) throw new PortalError("The sheet has no rows to import.");
    if (rows.length > MAX_ROWS) throw new PortalError(`At most ${MAX_ROWS} rows per batch.`);
    const bad = rows.filter((r) => !r.name?.trim() || !isEmail(String(r.email ?? "").trim().toLowerCase()));
    if (bad.length) throw new PortalError(`${bad.length} row(s) have a missing name or invalid email, e.g. "${bad[0].name ?? ""}" <${bad[0].email ?? ""}>. Fix the sheet and import again.`);

    const replace = str(fd, "mode", 10) === "replace";
    const stmts: Statement[] = replace ? [{ sql: "DELETE FROM certificate_batch_recipients WHERE batch_id = ?", params: [id] }] : [];
    for (const r of rows) {
      const data: Record<string, string> = {};
      for (const [k, v] of Object.entries(r.data ?? {})) data[String(k).slice(0, 60)] = String(v ?? "").slice(0, 300);
      stmts.push({
        sql: "INSERT INTO certificate_batch_recipients (id, batch_id, email, name, data, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        params: [newId(), id, r.email.trim().toLowerCase(), r.name.trim().slice(0, 120), JSON.stringify(data), now()],
      });
    }
    // Replace mode deletes first; run the delete on its own so a failed insert batch can't leave a mix.
    if (replace) await batch([stmts.shift()!]);
    await batchChunked(stmts, 100);
    await run("UPDATE certificate_batches SET columns = ?, updated_at = ? WHERE id = ?", [JSON.stringify(columns.slice(0, 40)), now(), id]);
    return `${rows.length} recipient(s) ${replace ? "imported (previous list replaced)" : "added"}.`;
  });
}

export async function deleteRecipientAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "batch_id", 40);
  await guarded(page(id), async () => {
    await run("DELETE FROM certificate_batch_recipients WHERE id = ? AND batch_id = ?", [str(fd, "recipient_id", 40), id]);
    return "Recipient removed.";
  });
}

export async function emailBatchAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  await guarded(page(id), async () => {
    const b = await first<{ title: string; event_label: string | null }>("SELECT title, event_label FROM certificate_batches WHERE id = ?", [id]);
    if (!b) throw new PortalError("Batch not found.");
    const tpl = await first("SELECT 1 FROM certificate_templates WHERE scope = ?", [`batch:${id}`]);
    if (!tpl) throw new PortalError("Upload and save a certificate template first.");
    const subject = str(fd, "subject", 200);
    const body = str(fd, "body", 8000);
    if (!subject || !body) throw new PortalError("Subject and message are required.");
    const onlyNew = str(fd, "only_new", 2) === "1";
    const recipients = await all<{ id: string; email: string; name: string; data: string }>(
      `SELECT id, email, name, data FROM certificate_batch_recipients WHERE batch_id = ? ${onlyNew ? "AND emailed_at IS NULL" : ""}`,
      [id]
    );
    if (recipients.length === 0) throw new PortalError(onlyNew ? "Everyone in this batch has already been emailed." : "No recipients yet.");
    const scope = `batch:${id}`;
    const stmts: Statement[] = [];
    for (const r of recipients) {
      const vars = { ...JSON.parse(r.data || "{}"), name: r.name, email: r.email, event: b.event_label ?? b.title, portalUrl: `${SITE_URL}/dashboard` };
      const subj = fillTemplate(subject, vars);
      stmts.push(
        outboxInsert({
          to: r.email,
          toName: r.name,
          subject: subj,
          html: emailLayout(subj, textToHtml(fillTemplate(body, vars))),
          scope,
          priority: 4,
          attachment: { type: "certificate", scope, kind: "participation", userId: r.id },
        }),
        { sql: "UPDATE certificate_batch_recipients SET emailed_at = ? WHERE id = ?", params: [now(), r.id] }
      );
    }
    await batchChunked(stmts, 100);
    return `${recipients.length} certificate email(s) queued. Send them from Email & SMTP.`;
  });
}

export async function deleteBatchAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const b = await first<{ title: string }>("SELECT title FROM certificate_batches WHERE id = ?", [id]);
  if (!b || str(fd, "confirm", 150) !== "DELETE") redirect(`${page(id)}?error=${encodeURIComponent('Type DELETE to confirm.')}`);
  const scope = `batch:${id}`;
  await batch([
    { sql: "DELETE FROM certificate_batch_recipients WHERE batch_id = ?", params: [id] },
    { sql: "DELETE FROM certificate_templates WHERE scope = ?", params: [scope] },
    { sql: "DELETE FROM email_outbox WHERE scope = ? AND status = 'queued'", params: [scope] },
    { sql: "DELETE FROM certificate_batches WHERE id = ?", params: [id] },
  ]);
  redirect(`/admin/certificates?ok=${encodeURIComponent(`Batch "${b.title}" deleted.`)}`);
}
