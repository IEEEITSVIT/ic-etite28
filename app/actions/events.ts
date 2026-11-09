"use server";

import { requireUser } from "@/lib/auth/session";
import { guarded, str } from "@/lib/portal/actions";
import {
  PortalError,
  createTeam,
  getEventBySlug,
  joinTeam,
  leaveTeam,
  registerForEvent,
  removeMember,
  saveSubmission,
  transferLead,
  type EventRow,
} from "@/lib/portal/events";
import { getPayable, startCheckout } from "@/lib/payments";
import { notify } from "@/lib/notifications";
import { first } from "@/lib/db";
import { formatDeadline } from "@/lib/pricing";
import { SITE_URL } from "@/lib/seo";
import { redirect } from "next/navigation";

async function load(formData: FormData): Promise<{ event: EventRow; path: string }> {
  const slug = str(formData, "slug", 80);
  const event = await getEventBySlug(slug);
  if (!event) throw new PortalError("Event not found.");
  return { event, path: `/events/${slug}` };
}

const pathFor = (formData: FormData) => `/events/${str(formData, "slug", 80)}`;

export async function registerAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    const already = await first("SELECT 1 AS ok FROM registrations WHERE event_id = ? AND user_id = ?", [event.id, user.id]);
    await registerForEvent(event, user);
    if (!already) {
      await notify("event_registered", {
        to: user.email,
        name: user.name,
        scope: `event:${event.id}`,
        vars: {
          event: event.title,
          deadline: event.participation === "team" && event.reg_closes_at ? ` before ${formatDeadline(event.reg_closes_at)}` : "",
          portalUrl: `${SITE_URL}/events/${event.slug}`,
        },
      });
    }
    return event.participation === "team" ? "You're registered! Now create a team or join one with a team code." : "You're registered!";
  });
}

export async function createTeamAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await createTeam(event, user, str(formData, "team_name", 60));
    const team = await first<{ name: string; code: string }>(
      "SELECT t.name, t.code FROM teams t JOIN registrations r ON r.team_id = t.id WHERE r.event_id = ? AND r.user_id = ?",
      [event.id, user.id]
    );
    if (team) {
      await notify("team_created", {
        to: user.email,
        name: user.name,
        scope: `event:${event.id}`,
        vars: { team: team.name, teamCode: team.code, event: event.title, portalUrl: `${SITE_URL}/events/${event.slug}` },
      });
    }
    return "Team created. Share the team code with your teammates.";
  });
}

export async function joinTeamAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await joinTeam(event, user, str(formData, "code", 12));
    const team = await first<{ name: string; lead_name: string; lead_email: string; lead_id: string }>(
      `SELECT t.name, u.name AS lead_name, u.email AS lead_email, u.id AS lead_id FROM teams t
         JOIN registrations r ON r.team_id = t.id JOIN users u ON u.id = t.lead_user_id
        WHERE r.event_id = ? AND r.user_id = ?`,
      [event.id, user.id]
    );
    if (team) {
      const vars = { member: user.name, team: team.name, event: event.title, portalUrl: `${SITE_URL}/events/${event.slug}` };
      await notify("team_joined", [
        { to: user.email, name: user.name, scope: `event:${event.id}`, vars },
        ...(team.lead_id !== user.id ? [{ to: team.lead_email, name: team.lead_name, scope: `event:${event.id}`, vars }] : []),
      ]);
    }
    return "You joined the team.";
  });
}

export async function leaveTeamAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await leaveTeam(event, user);
    return "You left the team.";
  });
}

export async function removeMemberAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await removeMember(event, user, str(formData, "user_id", 40));
    return "Member removed.";
  });
}

export async function transferLeadAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await transferLead(event, user, str(formData, "user_id", 40));
    return "Team lead transferred.";
  });
}

export async function submitAction(formData: FormData) {
  const path = pathFor(formData) + "#submissions";
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    const values: Record<string, string> = {};
    // Field validation (required, type, length) happens in saveSubmission against the round's fields.
    for (const [k, v] of formData.entries()) if (k.startsWith("field_")) values[k.slice(6)] = String(v).slice(0, 3100);
    await saveSubmission(event, user, str(formData, "round_id", 40), values);
    return "Submission saved. You can update it until the round closes.";
  });
}

// Shared by conference, TechNext and event registrations.
export async function payAction(formData: FormData) {
  const purpose = str(formData, "purpose", 20) as "conference" | "technext" | "event";
  const ref = str(formData, "ref", 100);
  const back = str(formData, "back", 200) || "/dashboard";
  const user = await requireUser(back);
  await guarded(back, async () => {
    const payable = await getPayable(purpose, ref);
    if (!payable || payable.userId !== user.id) throw new PortalError("Payment record not found.");
    const result = await startCheckout(payable);
    if (result.redirectUrl) redirect(result.redirectUrl);
    return result.message ?? "Payment started.";
  });
}
