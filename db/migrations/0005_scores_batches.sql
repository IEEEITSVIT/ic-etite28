-- How evaluators' totals combine into a team's round score.
ALTER TABLE event_rounds ADD COLUMN aggregation TEXT NOT NULL DEFAULT 'average';  -- 'average' | 'sum'

-- Standalone certificate batches imported from Excel/CSV. Recipients are matched to
-- portal accounts by email, so they also appear in that user's dashboard.
CREATE TABLE IF NOT EXISTS certificate_batches (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  event_label  TEXT,
  issue_date   TEXT,
  columns      TEXT NOT NULL DEFAULT '[]',   -- JSON: column names from the sheet (placeholders)
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS certificate_batch_recipients (
  id          TEXT PRIMARY KEY,
  batch_id    TEXT NOT NULL REFERENCES certificate_batches(id) ON DELETE CASCADE,
  email       TEXT NOT NULL COLLATE NOCASE,
  name        TEXT NOT NULL,
  data        TEXT NOT NULL DEFAULT '{}',    -- JSON: the row's other columns
  emailed_at  TEXT,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_batch_recipients_batch ON certificate_batch_recipients(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_recipients_email ON certificate_batch_recipients(email);
