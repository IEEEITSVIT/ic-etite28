"use server";

import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { batch, first, now, run } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroyAllSessions, destroySession, getCurrentUser, isBootstrapAdmin } from "@/lib/auth/session";
import { newId, newNumericCode, sha256 } from "@/lib/portal/ids";
import { emailLayout, sendNow, textToHtml } from "@/lib/email/mailer";
import { flash, guarded, isEmail, str } from "@/lib/portal/actions";
import { PortalError } from "@/lib/portal/events";
import { SITE_URL } from "@/lib/seo";

const safeNext = (v: string) => (v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard");
const withNext = (path: string, next: string) => (next && next !== "/dashboard" ? `${path}?next=${encodeURIComponent(next)}` : path);

const CODE_TTL_MIN = 15;
const RESET_TTL_MIN = 30;

async function issueVerificationCode(user: { id: string; email: string; name: string }) {
  const code = newNumericCode(6);
  await batch([
    { sql: "DELETE FROM auth_tokens WHERE user_id = ? AND purpose = 'verify'", params: [user.id] },
    {
      sql: "INSERT INTO auth_tokens (id, user_id, purpose, expires_at, created_at) VALUES (?, ?, 'verify', ?, ?)",
      params: [sha256(`${user.id}:${code}`), user.id, new Date(Date.now() + CODE_TTL_MIN * 60e3).toISOString(), now()],
    },
  ]);
  const subject = `Your verification code: ${code}`;
  await sendNow({
    to: user.email,
    toName: user.name,
    subject,
    html: emailLayout(
      "Verify your email",
      textToHtml(`Hello ${user.name},\n\nYour ic-ETITE'28 verification code is:`) +
        `<p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#002147;margin:8px 0 18px">${code}</p>` +
        textToHtml(`The code expires in ${CODE_TTL_MIN} minutes. If you did not create an account, you can ignore this email.`)
    ),
  });
}

export async function signupAction(formData: FormData) {
  const next = safeNext(str(formData, "next"));
  const back = withNext("/signup", next);
  await guarded(back, async () => {
    const name = str(formData, "name", 100);
    const email = str(formData, "email", 200).toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (name.length < 2) throw new PortalError("Please enter your full name.");
    if (!isEmail(email)) throw new PortalError("Please enter a valid email address.");
    if (password.length < 8) throw new PortalError("Password must be at least 8 characters.");
    if (password !== confirm) throw new PortalError("Passwords do not match.");
    if (await first("SELECT 1 FROM users WHERE email = ?", [email])) {
      throw new PortalError("An account with this email already exists. Log in instead, or reset your password.");
    }
    const id = newId();
    await run(
      `INSERT INTO users (id, email, password_hash, name, phone, institution, department, year_of_study, city, role, email_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        id,
        email,
        await hashPassword(password),
        name,
        str(formData, "phone", 20) || null,
        str(formData, "institution", 150) || null,
        str(formData, "department", 120) || null,
        str(formData, "year_of_study", 30) || null,
        str(formData, "city", 80) || null,
        isBootstrapAdmin(email) ? "admin" : "participant",
        now(),
        now(),
      ]
    );
    await createSession(id);
    await issueVerificationCode({ id, email, name });
    return `We sent a 6-digit code to ${email}.`;
  }, withNext("/verify-email", next));
}

export async function verifyEmailAction(formData: FormData) {
  const next = safeNext(str(formData, "next"));
  const back = withNext("/verify-email", next);
  const user = await getCurrentUser();
  if (!user) redirect(withNext("/login", next));
  const code = str(formData, "code", 10).replace(/\D/g, "");
  const token = await first<{ expires_at: string }>("SELECT expires_at FROM auth_tokens WHERE id = ? AND purpose = 'verify'", [
    sha256(`${user.id}:${code}`),
  ]);
  if (!token || token.expires_at < now()) flash(back, "error", "That code is incorrect or has expired. Request a new one.");
  await batch([
    { sql: "UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?", params: [now(), user.id] },
    { sql: "DELETE FROM auth_tokens WHERE user_id = ? AND purpose = 'verify'", params: [user.id] },
  ]);
  flash(next, "ok", "Email verified. Welcome to the ic-ETITE'28 portal!");
}

export async function resendCodeAction(formData: FormData) {
  const next = safeNext(str(formData, "next"));
  const back = withNext("/verify-email", next);
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const last = await first<{ created_at: string }>(
    "SELECT created_at FROM auth_tokens WHERE user_id = ? AND purpose = 'verify' ORDER BY created_at DESC LIMIT 1",
    [user.id]
  );
  if (last && Date.now() - new Date(last.created_at).getTime() < 60e3) flash(back, "error", "Please wait a minute before requesting another code.");
  await issueVerificationCode(user);
  flash(back, "ok", `A new code was sent to ${user.email}.`);
}

const MAX_ATTEMPTS = 8;
const WINDOW_MIN = 15;

export async function loginAction(formData: FormData) {
  const next = safeNext(str(formData, "next"));
  const back = withNext("/login", next);
  const email = str(formData, "email", 200).toLowerCase();
  const password = String(formData.get("password") ?? "");

  const since = new Date(Date.now() - WINDOW_MIN * 60e3).toISOString();
  const attempts = await first<{ n: number }>("SELECT COUNT(*) AS n FROM login_attempts WHERE email = ? AND attempted_at > ?", [email, since]);
  if ((attempts?.n ?? 0) >= MAX_ATTEMPTS) flash(back, "error", `Too many attempts. Try again in ${WINDOW_MIN} minutes or reset your password.`);

  const user = await first<{ id: string; password_hash: string; role: string }>("SELECT id, password_hash, role FROM users WHERE email = ?", [email]);
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    await run("INSERT INTO login_attempts (email, attempted_at) VALUES (?, ?)", [email, now()]);
    flash(back, "error", "Incorrect email or password.");
  }
  await run("DELETE FROM login_attempts WHERE email = ? OR attempted_at < ?", [email, since]);
  if (isBootstrapAdmin(email) && user.role !== "admin") await run("UPDATE users SET role = 'admin' WHERE id = ?", [user.id]);
  await createSession(user.id);
  redirect(next);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login?ok=" + encodeURIComponent("You have been logged out."));
}

export async function forgotPasswordAction(formData: FormData) {
  const email = str(formData, "email", 200).toLowerCase();
  const user = isEmail(email) ? await first<{ id: string; name: string }>("SELECT id, name FROM users WHERE email = ?", [email]) : null;
  if (user) {
    const token = randomBytes(32).toString("base64url");
    await batch([
      { sql: "DELETE FROM auth_tokens WHERE user_id = ? AND purpose = 'reset'", params: [user.id] },
      {
        sql: "INSERT INTO auth_tokens (id, user_id, purpose, expires_at, created_at) VALUES (?, ?, 'reset', ?, ?)",
        params: [sha256(token), user.id, new Date(Date.now() + RESET_TTL_MIN * 60e3).toISOString(), now()],
      },
    ]);
    const link = `${SITE_URL}/reset-password?token=${token}`;
    await sendNow({
      to: email,
      toName: user.name,
      subject: "Reset your ic-ETITE'28 password",
      html: emailLayout(
        "Password reset",
        textToHtml(`Hello ${user.name},\n\nUse the link below to set a new password. It expires in ${RESET_TTL_MIN} minutes.\n\n${link}\n\nIf you did not request this, you can ignore this email.`)
      ),
    });
  }
  flash("/forgot-password", "ok", "If an account exists for that email, a reset link has been sent.");
}

export async function resetPasswordAction(formData: FormData) {
  const token = str(formData, "token", 200);
  const back = `/reset-password?token=${encodeURIComponent(token)}`;
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) flash(back, "error", "Password must be at least 8 characters.");
  if (password !== String(formData.get("confirm") ?? "")) flash(back, "error", "Passwords do not match.");
  const row = await first<{ user_id: string; expires_at: string }>("SELECT user_id, expires_at FROM auth_tokens WHERE id = ? AND purpose = 'reset'", [
    sha256(token),
  ]);
  if (!row || row.expires_at < now()) flash("/forgot-password", "error", "That reset link is invalid or has expired. Request a new one.");
  await destroyAllSessions(row.user_id);
  // Reaching the link proves control of the mailbox, so the email counts as verified.
  await batch([
    { sql: "UPDATE users SET password_hash = ?, email_verified = 1, updated_at = ? WHERE id = ?", params: [await hashPassword(password), now(), row.user_id] },
    { sql: "DELETE FROM auth_tokens WHERE user_id = ? AND purpose = 'reset'", params: [row.user_id] },
  ]);
  await createSession(row.user_id);
  flash("/dashboard", "ok", "Your password has been updated.");
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const name = str(formData, "name", 100);
  if (name.length < 2) flash("/dashboard/profile", "error", "Please enter your full name.");
  await run(
    `UPDATE users SET name = ?, phone = ?, institution = ?, department = ?, year_of_study = ?, city = ?, updated_at = ? WHERE id = ?`,
    [
      name,
      str(formData, "phone", 20) || null,
      str(formData, "institution", 150) || null,
      str(formData, "department", 120) || null,
      str(formData, "year_of_study", 30) || null,
      str(formData, "city", 80) || null,
      now(),
      user.id,
    ]
  );
  flash("/dashboard/profile", "ok", "Profile updated.");
}

export async function changePasswordAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const row = await first<{ password_hash: string }>("SELECT password_hash FROM users WHERE id = ?", [user.id]);
  if (!row || !(await verifyPassword(current, row.password_hash))) flash("/dashboard/profile", "error", "Current password is incorrect.");
  if (password.length < 8) flash("/dashboard/profile", "error", "New password must be at least 8 characters.");
  await run("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?", [await hashPassword(password), now(), user.id]);
  flash("/dashboard/profile", "ok", "Password changed.");
}
