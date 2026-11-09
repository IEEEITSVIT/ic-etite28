"use server";

import { requireAdmin } from "@/lib/auth/session";
import { batch, first, now, run } from "@/lib/db";
import { guarded, isEmail, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { PAYMENT_STATUSES, setPaymentStatusStatements, type PaymentStatus } from "@/lib/payments";
import { emailLayout, outboxInsert, textToHtml } from "@/lib/email/mailer";
import { newId } from "@/lib/portal/ids";
import { hashPassword } from "@/lib/auth/password";
import { randomBytes } from "node:crypto";
import { sha256 } from "@/lib/portal/ids";
import { SITE_URL } from "@/lib/seo";

const payment = (fd: FormData) => {
  const status = str(fd, "payment_status", 20) as PaymentStatus;
  if (!PAYMENT_STATUSES.includes(status)) throw new PortalError("Invalid payment status.");
  return status;
};

const link = (fd: FormData) => {
  const v = str(fd, "payment_link", 500);
  if (v && !/^https?:\/\//i.test(v)) throw new PortalError("Payment link must start with http:// or https://");
  return v || null;
};

// ─── TechNext ──────────────────────────────────────────────────────────

export async function updateTechnextBookingAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const back = `/admin/technext?${new URLSearchParams({ status: str(fd, "filter", 20) || "all" })}#b-${id}`;
  await guarded(back, async () => {
    const status = str(fd, "status", 20);
    if (!["pending", "approved", "rejected", "cancelled"].includes(status)) throw new PortalError("Invalid status.");
    const before = await first<{ status: string; email: string; contact_name: string; organization_name: string }>(
      "SELECT status, email, contact_name, organization_name FROM technext_bookings WHERE id = ?",
      [id]
    );
    if (!before) throw new PortalError("Booking not found.");
    const stmts = [
      {
        sql: "UPDATE technext_bookings SET status = ?, admin_notes = ?, payment_link = ?, payment_amount = ?, updated_at = ? WHERE id = ?",
        params: [status, str(fd, "admin_notes", 1000) || null, link(fd), Math.max(0, Math.round(Number(fd.get("payment_amount")) || 0)), now(), id],
      },
      ...setPaymentStatusStatements("technext", id, payment(fd), str(fd, "payment_ref", 120) || null),
    ];
    // Let the exhibitor know when the decision changes.
    if (before.status !== status && (status === "approved" || status === "rejected")) {
      const approved = status === "approved";
      stmts.push(
        outboxInsert({
          to: before.email,
          toName: before.contact_name,
          subject: approved ? "Your TechNext '28 stall is approved" : "Update on your TechNext '28 stall booking",
          html: emailLayout(
            approved ? "Stall approved" : "Booking update",
            textToHtml(
              approved
                ? `Dear ${before.contact_name},\n\nYour stall booking for ${before.organization_name} has been approved. Please complete the payment from your dashboard to confirm your stall:\n${SITE_URL}/dashboard`
                : `Dear ${before.contact_name},\n\nWe are unable to confirm the stall booking for ${before.organization_name} at this time.${str(fd, "admin_notes", 1000) ? `\n\nNote: ${str(fd, "admin_notes", 1000)}` : ""}\n\nFor questions, reply to this email.`
            )
          ),
          scope: "technext",
          priority: 3,
        })
      );
    }
    await batch(stmts);
    return "Booking updated.";
  });
}

// ─── Conference ────────────────────────────────────────────────────────

export async function updateConferenceRegistrationAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const back = `/admin/conference#r-${id}`;
  await guarded(back, async () => {
    const status = str(fd, "status", 20);
    if (!["pending", "confirmed", "cancelled"].includes(status)) throw new PortalError("Invalid status.");
    await batch([
      { sql: "UPDATE conference_registrations SET status = ?, admin_notes = ?, payment_link = ?, updated_at = ? WHERE id = ?", params: [status, str(fd, "admin_notes", 1000) || null, link(fd), now(), id] },
      ...setPaymentStatusStatements("conference", id, payment(fd), str(fd, "payment_ref", 120) || null),
    ]);
    return "Registration updated.";
  });
}

// ─── Users ─────────────────────────────────────────────────────────────

export async function setUserRoleAction(fd: FormData) {
  const admin = await requireAdmin();
  const back = `/admin/users?q=${encodeURIComponent(str(fd, "q", 80))}`;
  await guarded(back, async () => {
    const userId = str(fd, "user_id", 40);
    const role = str(fd, "role", 20);
    if (!["participant", "evaluator", "admin"].includes(role)) throw new PortalError("Invalid role.");
    if (userId === admin.id && role !== "admin") throw new PortalError("You cannot remove your own admin access.");
    await run("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", [role, now(), userId]);
    return "Role updated.";
  });
}

export async function verifyUserAction(fd: FormData) {
  await requireAdmin();
  const back = `/admin/users?q=${encodeURIComponent(str(fd, "q", 80))}`;
  await guarded(back, async () => {
    await run("UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?", [now(), str(fd, "user_id", 40)]);
    return "Email marked as verified.";
  });
}

// Creates (or promotes) an evaluator and emails them a link to set their password.
export async function inviteUserAction(fd: FormData) {
  await requireAdmin();
  const back = "/admin/users";
  await guarded(back, async () => {
    const email = str(fd, "email", 200).toLowerCase();
    const name = str(fd, "name", 100);
    const role = str(fd, "role", 20) === "admin" ? "admin" : "evaluator";
    if (!isEmail(email)) throw new PortalError("Enter a valid email.");
    const existing = await first<{ id: string; name: string }>("SELECT id, name FROM users WHERE email = ?", [email]);
    if (existing) {
      await run("UPDATE users SET role = ?, updated_at = ? WHERE id = ?", [role, now(), existing.id]);
      return `${existing.name} is now ${role === "admin" ? "an admin" : "an evaluator"}.`;
    }
    if (name.length < 2) throw new PortalError("Enter the person's name.");
    const id = newId();
    const token = randomBytes(32).toString("base64url");
    const setLink = `${SITE_URL}/reset-password?token=${token}`;
    await batch([
      {
        sql: `INSERT INTO users (id, email, password_hash, name, role, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
        params: [id, email, await hashPassword(randomBytes(24).toString("base64url")), name, role, now(), now()],
      },
      {
        sql: "INSERT INTO auth_tokens (id, user_id, purpose, expires_at, created_at) VALUES (?, ?, 'reset', ?, ?)",
        params: [sha256(token), id, new Date(Date.now() + 7 * 864e5).toISOString(), now()],
      },
      outboxInsert({
        to: email,
        toName: name,
        subject: `You're invited as ${role === "admin" ? "an admin" : "an evaluator"} for ic-ETITE'28`,
        html: emailLayout(
          "Portal invitation",
          textToHtml(`Hello ${name},\n\nYou have been added as ${role === "admin" ? "an administrator" : "an evaluator"} on the ic-ETITE'28 portal. Set your password with the link below (valid for 7 days):\n\n${setLink}\n\nAfter that, log in at ${SITE_URL}/login`)
        ),
        priority: 1,
      }),
    ]);
    return `Invitation queued for ${email}. Send it from Email & SMTP.`;
  });
}
