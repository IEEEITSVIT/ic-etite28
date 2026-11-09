"use client";

import { useState } from "react";
import { deleteEmailTemplateAction, queueEmailAction, saveEmailTemplateAction } from "@/app/actions/admin-comms";
import SubmitButton from "@/components/portal/SubmitButton";
import { btnDanger, btnGold, btnSecondary, inputCls, labelCls } from "@/components/portal/ui";

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export default function EmailComposer({
  scope,
  back,
  templates,
  audiences,
  certKinds,
  placeholders,
  defaultAudience,
}: {
  scope: string;
  back: string;
  templates: Template[];
  audiences: { value: string; label: string }[];
  certKinds: ("participation" | "winner")[];
  placeholders: string[];
  defaultAudience?: string;
}) {
  const [templateId, setTemplateId] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const pick = (id: string) => {
    setTemplateId(id);
    const t = templates.find((x) => x.id === id);
    setName(t?.name ?? "");
    setSubject(t?.subject ?? "");
    setBody(t?.body ?? "");
  };

  return (
    <form className="space-y-4">
      <input type="hidden" name="scope" value={scope} />
      <input type="hidden" name="back" value={back} />
      <input type="hidden" name="id" value={templateId} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Saved draft</span>
          <select value={templateId} onChange={(e) => pick(e.target.value)} className={inputCls}>
            <option value="">— New message —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelCls}>Send to</span>
          <select name="audience" defaultValue={defaultAudience ?? audiences[0]?.value} className={inputCls}>
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelCls}>Subject</span>
        <input name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={200} className={inputCls} />
      </label>
      <label className="block">
        <span className={labelCls}>Message</span>
        <textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} required rows={9} className={`${inputCls} font-mono text-sm`} />
        <span className="mt-1 block text-xs text-slate-500">
          Placeholders: {placeholders.map((p) => `{{${p}}}`).join("  ")}. Links become clickable; blank lines start a new paragraph.
        </span>
      </label>
      {certKinds.length > 0 && (
        <label className="block max-w-sm">
          <span className={labelCls}>Attach certificate</span>
          <select name="attach" defaultValue="" className={inputCls}>
            <option value="">No attachment</option>
            {certKinds.map((k) => (
              <option key={k} value={k}>
                {k === "winner" ? "Winner certificate (winners only)" : "Participation certificate"}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-slate-500">Generated as a PDF when each email is sent; nothing is stored.</span>
        </label>
      )}
      <div className="flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
        <SubmitButton className={btnGold} pendingText="Queuing…" formAction={queueEmailAction} confirm="Queue this email for every recipient in the selected audience?">
          Queue emails
        </SubmitButton>
        <div className="ml-auto flex flex-wrap items-end gap-2">
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Draft name" className={`${inputCls} !w-48 !py-2 !text-sm`} />
          <button formAction={saveEmailTemplateAction} className={btnSecondary}>
            {templateId ? "Update draft" : "Save as draft"}
          </button>
          {templateId && (
            <button formAction={deleteEmailTemplateAction} className={btnDanger} onClick={(e) => !confirm("Delete this draft?") && e.preventDefault()}>
              Delete draft
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
