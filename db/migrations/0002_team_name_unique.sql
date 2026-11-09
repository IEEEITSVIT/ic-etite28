-- Team names are unique within an event (case-insensitive), enforced by the database.
CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_event_name ON teams(event_id, name COLLATE NOCASE);
