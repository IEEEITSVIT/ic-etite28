import "server-only";
import { first, parseJson, run } from "@/lib/db";
import { emailLayout, fillTemplate, outboxInsert, processOutbox, textToHtml, type TemplateVars } from "@/lib/email/mailer";
import { SITE_URL } from "@/lib/seo";

// Automatic emails sent when something happens in the portal. Wording and on/off are
// editable in /admin/email; these are the defaults.

export type NotificationKey =
  | "conference_registered"
  | "technext_booked"
  | "technext_approved"
  | "technext_rejected"
  | "event_registered"
  | "team_created"
  | "team_joined"
  | "payment_received";

export interface NotificationTemplate {
  enabled: boolean;
  subject: string;
  body: string;
}

export const NOTIFICATION_DEFS: Record<NotificationKey, { label: string; when: string; placeholders: string[]; defaults: NotificationTemplate }> = {
  conference_registered: {
    label: "Conference registration received",
    when: "A delegate submits the conference registration form.",
    placeholders: ["name", "category", "amount", "deadline", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "ic-ETITE'28 registration received — {{category}}",
      body: "Dear {{name}},\n\nThank you for registering for ic-ETITE'28 as {{category}}.\n\nAmount payable: {{amount}}\nPlease complete the payment from your dashboard{{deadline}}. Your registration is confirmed once the payment is received.\n\n{{portalUrl}}\n\nRegards,\nic-ETITE'28 Organising Committee",
    },
  },
  technext_booked: {
    label: "TechNext stall booking received",
    when: "An exhibitor submits a stall booking.",
    placeholders: ["name", "organisation", "stall", "amount", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "TechNext '28 stall booking received — {{organisation}}",
      body: "Dear {{name}},\n\nThank you for booking a {{stall}} for {{organisation}} at TechNext '28. The organising committee will review your booking and confirm it shortly; payment details follow on approval.\n\nTrack your booking: {{portalUrl}}",
    },
  },
  technext_approved: {
    label: "TechNext stall approved",
    when: "An admin approves a stall booking.",
    placeholders: ["name", "organisation", "stall", "amount", "notes", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "Your TechNext '28 stall is approved",
      body: "Dear {{name}},\n\nYour stall booking ({{stall}}) for {{organisation}} has been approved.\n\nAmount payable: {{amount}}\nPlease complete the payment from your dashboard to confirm your stall:\n{{portalUrl}}\n\n{{notes}}",
    },
  },
  technext_rejected: {
    label: "TechNext stall not approved",
    when: "An admin rejects a stall booking.",
    placeholders: ["name", "organisation", "notes"],
    defaults: {
      enabled: true,
      subject: "Update on your TechNext '28 stall booking",
      body: "Dear {{name}},\n\nWe are unable to confirm the stall booking for {{organisation}} at this time.\n\n{{notes}}\n\nFor questions, reply to this email.",
    },
  },
  event_registered: {
    label: "Event registration (e.g. BOLT)",
    when: "Someone registers for an event.",
    placeholders: ["name", "event", "deadline", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "You're registered for {{event}}",
      body: "Dear {{name}},\n\nYou are registered for {{event}}.\n\nNext step: create a team or join one with your team's code on the event page{{deadline}}.\n\n{{portalUrl}}",
    },
  },
  team_created: {
    label: "Team created",
    when: "A team lead creates a team.",
    placeholders: ["name", "team", "teamCode", "event", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "Team {{team}} created — code {{teamCode}}",
      body: "Dear {{name}},\n\nYour team {{team}} for {{event}} is ready.\n\nTeam code: {{teamCode}}\nShare this code with your teammates so they can join from the event page:\n{{portalUrl}}",
    },
  },
  team_joined: {
    label: "Joined a team",
    when: "A participant joins a team with its code (sent to the participant and the team lead).",
    placeholders: ["name", "member", "team", "event", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "{{member}} joined team {{team}}",
      body: "Dear {{name}},\n\n{{member}} is now a member of team {{team}} for {{event}}.\n\n{{portalUrl}}",
    },
  },
  payment_received: {
    label: "Payment received (with invoice)",
    when: "A payment is marked paid by an admin or confirmed by the payment gateway. The invoice PDF is attached.",
    placeholders: ["name", "item", "amount", "invoiceNumber", "paymentRef", "portalUrl"],
    defaults: {
      enabled: true,
      subject: "Payment received — invoice {{invoiceNumber}}",
      body: "Dear {{name}},\n\nWe have received your payment of {{amount}} for {{item}}.\n\nInvoice number: {{invoiceNumber}}\nPayment reference: {{paymentRef}}\n\nThe invoice is attached and can also be downloaded from your dashboard:\n{{portalUrl}}\n\nThank you,\nic-ETITE'28 Organising Committee",
    },
  },
};

export const NOTIFICATION_KEYS = Object.keys(NOTIFICATION_DEFS) as NotificationKey[];

export async function getNotificationTemplates(): Promise<Record<NotificationKey, NotificationTemplate>> {
  const row = await first<{ value: string }>("SELECT value FROM settings WHERE key = 'notifications'").catch(() => null);
  const saved = parseJson<Partial<Record<NotificationKey, Partial<NotificationTemplate>>>>(row?.value, {});
  return Object.fromEntries(NOTIFICATION_KEYS.map((k) => [k, { ...NOTIFICATION_DEFS[k].defaults, ...(saved[k] ?? {}) }])) as Record<NotificationKey, NotificationTemplate>;
}

export async function saveNotificationTemplates(value: Record<NotificationKey, NotificationTemplate>, userId: string) {
  await run(
    `INSERT INTO settings (key, value, updated_at, updated_by) VALUES ('notifications', ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    [JSON.stringify(value), new Date().toISOString(), userId]
  );
}

export interface NotifyTarget {
  to: string;
  name: string;
  vars: TemplateVars;
  scope?: string;
  attachment?: { type: "invoice"; invoiceId: string } | null;
}

// Queues the notice and tries to send it straight away. Never throws: a mail problem
// must not break the registration that triggered it (it stays queued for the cron).
export async function notify(key: NotificationKey, targets: NotifyTarget | NotifyTarget[]) {
  try {
    const tpl = (await getNotificationTemplates())[key];
    if (!tpl.enabled) return;
    for (const t of Array.isArray(targets) ? targets : [targets]) {
      const vars = { portalUrl: `${SITE_URL}/dashboard`, ...t.vars, name: t.name };
      const subject = fillTemplate(tpl.subject, vars);
      const insert = outboxInsert({
        to: t.to,
        toName: t.name,
        subject,
        html: emailLayout(subject, textToHtml(fillTemplate(tpl.body, vars))),
        scope: t.scope ?? "global",
        priority: 2,
        attachment: t.attachment ?? null,
      });
      await run(insert.sql, insert.params);
      await processOutbox(1, insert.params[0] as string).catch(() => {});
    }
  } catch (err) {
    console.error(`notify(${key}) failed`, err);
  }
}
