-- Each round can ask for its own submission fields (NULL = use the event's default fields).
ALTER TABLE event_rounds ADD COLUMN submission_fields TEXT;
