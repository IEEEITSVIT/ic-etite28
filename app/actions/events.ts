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
  submissionFields,
  transferLead,
  type EventRow,
} from "@/lib/portal/events";
import { getPayable, startCheckout } from "@/lib/payments";
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
    await registerForEvent(event, user);
    return event.participation === "team" ? "You're registered! Now create a team or join one with a team code." : "You're registered!";
  });
}

export async function createTeamAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await createTeam(event, user, str(formData, "team_name", 60));
    return "Team created. Share the team code with your teammates.";
  });
}

export async function joinTeamAction(formData: FormData) {
  const path = pathFor(formData);
  const user = await requireUser(path);
  await guarded(path, async () => {
    const { event } = await load(formData);
    await joinTeam(event, user, str(formData, "code", 12));
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
    for (const f of submissionFields(event)) values[f.key] = str(formData, `field_${f.key}`, 500);
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
