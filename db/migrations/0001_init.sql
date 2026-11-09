-- ic-ETITE'28 portal schema (Cloudflare D1 / SQLite).
-- Timestamps are ISO-8601 UTC strings; JSON columns hold serialized JSON.

-- ───────────────────────── Accounts ─────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash   TEXT NOT NULL,
  name            TEXT NOT NULL,
  phone           TEXT,
  institution     TEXT,
  department      TEXT,
  year_of_study   TEXT,
  city            TEXT,
  role            TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('participant','evaluator','admin')),
  email_verified  INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id          TEXT PRIMARY KEY,            -- sha256 of the cookie token
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- One-time codes: email verification and password reset.
CREATE TABLE IF NOT EXISTS auth_tokens (
  id          TEXT PRIMARY KEY,            -- sha256 of the token / code+user
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose     TEXT NOT NULL CHECK (purpose IN ('verify','reset')),
  expires_at  TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id, purpose);

CREATE TABLE IF NOT EXISTS login_attempts (
  email       TEXT NOT NULL COLLATE NOCASE,
  attempted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_attempts ON login_attempts(email, attempted_at);

-- ───────────────────────── CMS ─────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,               -- JSON
  updated_at  TEXT NOT NULL,
  updated_by  TEXT
);

-- ───────────────────────── Events (BOLT and others) ─────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                 TEXT PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,
  title              TEXT NOT NULL,
  tagline            TEXT,
  description        TEXT,
  venue              TEXT,
  starts_at          TEXT,
  ends_at            TEXT,
  visibility         TEXT NOT NULL DEFAULT 'hidden' CHECK (visibility IN ('hidden','unlisted','public')),
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived')),
  registration_mode  TEXT NOT NULL DEFAULT 'open' CHECK (registration_mode IN ('open','allowlist')),
  participation      TEXT NOT NULL DEFAULT 'team' CHECK (participation IN ('solo','team')),
  min_team_size      INTEGER NOT NULL DEFAULT 1,
  max_team_size      INTEGER NOT NULL DEFAULT 4,
  reg_opens_at       TEXT,
  reg_closes_at      TEXT,
  submission_fields  TEXT NOT NULL DEFAULT '[]', -- JSON [{key,label,required}]
  fee_amount         INTEGER NOT NULL DEFAULT 0,
  fee_currency       TEXT NOT NULL DEFAULT 'INR',
  fee_scope          TEXT NOT NULL DEFAULT 'per_team' CHECK (fee_scope IN ('per_team','per_member')),
  payment_link       TEXT,                     -- payment page / API endpoint linked to this event
  winners_count      INTEGER NOT NULL DEFAULT 3,
  winners_published  INTEGER NOT NULL DEFAULT 0,
  created_at         TEXT NOT NULL,
  updated_at         TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_allowlist (
  event_id  TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email     TEXT NOT NULL COLLATE NOCASE,
  PRIMARY KEY (event_id, email)
);

CREATE TABLE IF NOT EXISTS event_evaluators (
  event_id  TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_rounds (
  id                TEXT PRIMARY KEY,
  event_id          TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  seq               INTEGER NOT NULL,
  name              TEXT NOT NULL,
  criteria          TEXT NOT NULL DEFAULT '[]',  -- JSON [{key,label,max}]
  submissions_open  INTEGER NOT NULL DEFAULT 0,
  submission_deadline TEXT,
  scores_published  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (event_id, seq)
);

CREATE TABLE IF NOT EXISTS teams (
  id            TEXT PRIMARY KEY,
  event_id      TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,
  lead_user_id  TEXT NOT NULL REFERENCES users(id),
  final_rank    INTEGER,
  created_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_teams_event ON teams(event_id);

CREATE TABLE IF NOT EXISTS registrations (
  event_id          TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id           TEXT REFERENCES teams(id) ON DELETE SET NULL,
  member_role       TEXT NOT NULL DEFAULT 'member' CHECK (member_role IN ('lead','member')),
  payment_status    TEXT NOT NULL DEFAULT 'not_required',
  payment_amount    INTEGER NOT NULL DEFAULT 0,
  payment_currency  TEXT NOT NULL DEFAULT 'INR',
  payment_ref       TEXT,
  payment_link      TEXT,
  registered_at     TEXT NOT NULL,
  PRIMARY KEY (event_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_registrations_team ON registrations(team_id);

CREATE TABLE IF NOT EXISTS submissions (
  team_id     TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  round_id    TEXT NOT NULL REFERENCES event_rounds(id) ON DELETE CASCADE,
  data        TEXT NOT NULL,                -- JSON {fieldKey: url}
  submitted_by TEXT REFERENCES users(id),
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (team_id, round_id)
);

CREATE TABLE IF NOT EXISTS scores (
  round_id      TEXT NOT NULL REFERENCES event_rounds(id) ON DELETE CASCADE,
  team_id       TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  evaluator_id  TEXT NOT NULL REFERENCES users(id),
  scores        TEXT NOT NULL,              -- JSON {criterionKey: number}
  total         REAL NOT NULL,
  comment       TEXT,
  updated_at    TEXT NOT NULL,
  PRIMARY KEY (round_id, team_id, evaluator_id)
);

-- Qualification decision for a team in a round (qualified → may enter the next round).
CREATE TABLE IF NOT EXISTS round_results (
  round_id    TEXT NOT NULL REFERENCES event_rounds(id) ON DELETE CASCADE,
  team_id     TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  qualified   INTEGER NOT NULL DEFAULT 0,
  decided_by  TEXT REFERENCES users(id),
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (round_id, team_id)
);

-- ───────────────────────── Certificates ─────────────────────────
-- scope: 'event:<eventId>' | 'technext' | 'conference'; kind: 'participation' | 'winner'
CREATE TABLE IF NOT EXISTS certificate_templates (
  scope       TEXT NOT NULL,
  kind        TEXT NOT NULL CHECK (kind IN ('participation','winner')),
  image_b64   TEXT NOT NULL,
  mime        TEXT NOT NULL,
  width       INTEGER NOT NULL,
  height      INTEGER NOT NULL,
  layout      TEXT NOT NULL,                -- JSON field placements
  released    INTEGER NOT NULL DEFAULT 0,   -- visible/downloadable to recipients
  updated_at  TEXT NOT NULL,
  PRIMARY KEY (scope, kind)
);

-- ───────────────────────── Email ─────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id          TEXT PRIMARY KEY,
  scope       TEXT NOT NULL,                -- 'global' | 'event:<id>' | 'technext' | 'conference'
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_outbox (
  id            TEXT PRIMARY KEY,
  scope         TEXT NOT NULL DEFAULT 'global',
  to_email      TEXT NOT NULL,
  to_name       TEXT,
  subject       TEXT NOT NULL,
  html          TEXT NOT NULL,
  attachment    TEXT,                       -- JSON {type:'certificate', scope, kind, userId} — rendered at send time
  priority      INTEGER NOT NULL DEFAULT 5, -- lower is sent first
  status        TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed')),
  attempts      INTEGER NOT NULL DEFAULT 0,
  error         TEXT,
  created_at    TEXT NOT NULL,
  sent_at       TEXT
);
CREATE INDEX IF NOT EXISTS idx_outbox_status ON email_outbox(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_outbox_sent ON email_outbox(sent_at);

-- ───────────────────────── TechNext expo stalls ─────────────────────────
CREATE TABLE IF NOT EXISTS technext_bookings (
  id                  TEXT PRIMARY KEY,
  user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_name   TEXT NOT NULL,
  organization_type   TEXT NOT NULL,
  sector              TEXT NOT NULL,
  contact_name        TEXT NOT NULL,
  designation         TEXT,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  city                TEXT NOT NULL,
  state               TEXT,
  website             TEXT,
  stall_type          TEXT NOT NULL,
  representatives     TEXT NOT NULL DEFAULT '[]', -- JSON [name]
  exhibit_description TEXT NOT NULL,
  power_required      INTEGER NOT NULL DEFAULT 0,
  special_requirements TEXT,
  gst_number          TEXT,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  admin_notes         TEXT,
  payment_status      TEXT NOT NULL DEFAULT 'unpaid',
  payment_amount      INTEGER NOT NULL DEFAULT 0,
  payment_currency    TEXT NOT NULL DEFAULT 'INR',
  payment_ref         TEXT,
  payment_link        TEXT,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_technext_user ON technext_bookings(user_id);

-- ───────────────────────── Conference registration ─────────────────────────
CREATE TABLE IF NOT EXISTS conference_registrations (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  category_key      TEXT NOT NULL,
  category_label    TEXT NOT NULL,
  residency         TEXT NOT NULL CHECK (residency IN ('indian','foreign')),
  ieee_member       INTEGER NOT NULL DEFAULT 0,
  ieee_number       TEXT,
  affiliation       TEXT NOT NULL,
  designation       TEXT,
  country           TEXT NOT NULL,
  paper_ids         TEXT,
  paper_titles      TEXT,
  presenting_author INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  admin_notes       TEXT,
  payment_status    TEXT NOT NULL DEFAULT 'unpaid',
  payment_amount    INTEGER NOT NULL,
  payment_currency  TEXT NOT NULL,
  payment_ref       TEXT,
  payment_link      TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

-- ───────────────────────── Payments ─────────────────────────
-- Gateway-agnostic ledger. purpose/ref_id point at the record being paid for.
CREATE TABLE IF NOT EXISTS payments (
  id            TEXT PRIMARY KEY,
  purpose       TEXT NOT NULL CHECK (purpose IN ('conference','technext','event')),
  ref_id        TEXT NOT NULL,
  user_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL,
  provider      TEXT NOT NULL,
  provider_ref  TEXT,
  status        TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','pending','paid','failed','refunded')),
  raw           TEXT,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON payments(purpose, ref_id);
