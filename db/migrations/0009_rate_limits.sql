-- Rate limiting for auth endpoints (login by IP, forgot password, signup, code resend / guesses).
CREATE TABLE IF NOT EXISTS rate_events (
  kind  TEXT NOT NULL,              -- e.g. 'login-ip', 'forgot-email', 'signup-ip'
  key   TEXT NOT NULL COLLATE NOCASE, -- IP address, email or user id
  at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_events ON rate_events(kind, key, at);
CREATE INDEX IF NOT EXISTS idx_rate_events_at ON rate_events(at);
