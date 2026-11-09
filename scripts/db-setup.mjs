#!/usr/bin/env node
// Seeds the portal database through the D1 gateway. Safe to re-run: existing rows are kept.
//   npm run db:setup                       → uses .env.local
//   npm run db:setup -- .env.vercel.local
// Creates the first admin (ADMIN_EMAIL / ADMIN_PASSWORD), stores SMTP settings from
// SMTP_* (password encrypted with SESSION_SECRET), and a hidden BOLT 3.0 event.

import { createCipheriv, createHash, randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";

const envFile = process.argv[2] ?? ".env.local";
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split("\n")
    .filter((l) => /^[A-Z0-9_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
const need = (k) => {
  if (!env[k]) throw new Error(`${k} is missing in ${envFile}`);
  return env[k];
};

const GATEWAY = need("D1_GATEWAY_URL").replace(/\/+$/, "");
const SECRET = need("D1_GATEWAY_SECRET");
const now = () => new Date().toISOString();
const id = () => randomBytes(12).toString("base64url");

async function q(sql, params = []) {
  const res = await fetch(`${GATEWAY}/query`, {
    method: "POST",
    headers: { authorization: `Bearer ${SECRET}`, "content-type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? res.statusText);
  return data.results ?? [];
}

// Same formats as lib/auth/password.ts and lib/portal/crypto.ts.
function hashPassword(pw) {
  const salt = randomBytes(16);
  const hash = scryptSync(pw, salt, 32, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return ["scrypt", 16384, 8, 1, salt.toString("base64url"), hash.toString("base64url")].join("$");
}
function encrypt(plain) {
  const key = createHash("sha256").update(need("SESSION_SECRET")).digest();
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}

// 1. First admin
if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const [existing] = await q("SELECT id, role FROM users WHERE email = ?", [email]);
  if (!existing) {
    await q(
      `INSERT INTO users (id, email, password_hash, name, role, email_verified, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'admin', 1, ?, ?)`,
      [id(), email, hashPassword(env.ADMIN_PASSWORD), env.ADMIN_NAME || "Portal Admin", now(), now()]
    );
    console.log(`✓ Admin created: ${email}`);
  } else {
    if (existing.role !== "admin") await q("UPDATE users SET role = 'admin', email_verified = 1 WHERE id = ?", [existing.id]);
    console.log(`• Admin exists: ${email}`);
  }
} else {
  console.log("• ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin");
}

// 2. SMTP (shown and editable in /admin/email)
if (env.SMTP_USER && env.SMTP_PASS) {
  const value = {
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === "true",
    user: env.SMTP_USER,
    passEnc: encrypt(env.SMTP_PASS),
    fromName: "ic-ETITE'28",
    fromEmail: env.SMTP_USER,
    dailyLimit: Number(env.EMAIL_DAILY_LIMIT || 450),
  };
  await q(
    `INSERT INTO settings (key, value, updated_at, updated_by) VALUES ('smtp', ?, ?, 'db-setup')
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    [JSON.stringify(value), now()]
  );
  console.log(`✓ SMTP saved for ${env.SMTP_USER}`);
}

// 3. BOLT 3.0 event (hidden until an admin publishes it)
const [bolt] = await q("SELECT id FROM events WHERE slug = 'bolt-3'");
if (!bolt) {
  const eventId = id();
  await q(
    `INSERT INTO events (id, slug, title, tagline, description, venue, visibility, status, registration_mode, participation,
       min_team_size, max_team_size, submission_fields, fee_amount, fee_currency, fee_scope, winners_count, created_at, updated_at)
     VALUES (?, 'bolt-3', 'BOLT 3.0 Hackathon', ?, ?, 'Anna Auditorium, VIT Vellore', 'hidden', 'active', 'open', 'team',
       2, 4, ?, 0, 'INR', 'per_team', 3, ?, ?)`,
    [
      eventId,
      "Breakthrough On Locked Technology — national flagship hackathon at ic-ETITE'28",
      "BOLT 3.0 is the national flagship hackathon of ic-ETITE'28, organised by the IEEE Information Theory Society Student Chapter and SCORE at VIT Vellore.\n\nRound 1 — Online Ideathon: submit your idea and approach.\nRound 2 — Offline Hackathon: shortlisted teams build a working prototype on campus, with review rounds and a final pitch.",
      JSON.stringify([
        { key: "github", label: "GitHub repository", required: true },
        { key: "demo_video", label: "Demo video (YouTube / Drive)", required: false },
        { key: "presentation", label: "Presentation (PPT / PDF link)", required: true },
        { key: "live_demo", label: "Live demo / Figma", required: false },
      ]),
      now(),
      now(),
    ]
  );
  const crit = (list) => JSON.stringify(list.map(([key, label, max]) => ({ key, label, max })));
  await q("INSERT INTO event_rounds (id, event_id, seq, name, criteria) VALUES (?, ?, 1, 'Online Ideathon', ?)", [
    id(),
    eventId,
    crit([["innovation", "Innovation", 10], ["feasibility", "Feasibility", 10], ["impact", "Impact", 10]]),
  ]);
  await q("INSERT INTO event_rounds (id, event_id, seq, name, criteria) VALUES (?, ?, 2, 'Offline Hackathon', ?)", [
    id(),
    eventId,
    crit([["technical", "Technical depth", 20], ["execution", "Execution", 10], ["ui_ux", "UI / UX", 10], ["pitch", "Final pitch", 10]]),
  ]);
  console.log("✓ BOLT 3.0 event created (hidden) with 2 rounds");
} else {
  console.log("• BOLT 3.0 event exists");
}

console.log("Done.");
