-- Prize pool and early-bird pricing for events (conference / TechNext live in CMS settings).
ALTER TABLE events ADD COLUMN prizes TEXT NOT NULL DEFAULT '[]';   -- JSON [{title, amount, description}]
ALTER TABLE events ADD COLUMN prize_pool TEXT;                      -- headline, e.g. "₹4,00,000+"
ALTER TABLE events ADD COLUMN early_fee_amount INTEGER;             -- fee before early_bird_ends_at
ALTER TABLE events ADD COLUMN early_bird_ends_at TEXT;
