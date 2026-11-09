-- One invoice per paid registration / booking. Numbers are sequential and unique;
-- PDFs are rendered on demand from this row and the CMS invoice template.
CREATE TABLE IF NOT EXISTS invoices (
  id            TEXT PRIMARY KEY,
  seq           INTEGER NOT NULL UNIQUE,
  number        TEXT NOT NULL UNIQUE,
  purpose       TEXT NOT NULL CHECK (purpose IN ('conference','technext','event')),
  ref_id        TEXT NOT NULL,
  user_id       TEXT REFERENCES users(id) ON DELETE SET NULL,
  bill_name     TEXT NOT NULL,
  bill_email    TEXT NOT NULL,
  bill_org      TEXT,
  bill_address  TEXT,
  bill_gstin    TEXT,
  items         TEXT NOT NULL,          -- JSON [{description, amount}]
  amount        INTEGER NOT NULL,
  currency      TEXT NOT NULL,
  payment_ref   TEXT,
  issued_at     TEXT NOT NULL,
  UNIQUE (purpose, ref_id)
);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
