-- Separate SMTP account for verification codes / password resets ("otp") vs everything else ("main").
ALTER TABLE email_outbox ADD COLUMN channel TEXT NOT NULL DEFAULT 'main';
-- Which SMTP username sent the row, so each account's daily quota is counted on its own.
ALTER TABLE email_outbox ADD COLUMN smtp_user TEXT;
CREATE INDEX IF NOT EXISTS idx_outbox_channel ON email_outbox(channel, status, priority, created_at);
