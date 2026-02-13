DROP TABLE reminders;

CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) on DELETE CASCADE,
    medication_id INTEGER NOT NULL REFERENCES medication(id) on DELETE CASCADE,
    reminder_time TIME NOT NULL,
    days_of_the_week VARCHAR(20) [],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_sent_at TIMESTAMP
);

CREATE INDEX idx_reminders_user_id on reminders(id);
CREATE INDEX idx_reminders_medication_id on reminders(medication_id);
CREATE INDEX idx_reminders_active on reminders(is_active);

COMMENT ON TABLE reminders is 'MEDICATION REMINDERS SCHEDULED';
COMMENT ON COLUMN reminders.days_of_the_week is 'ARRAY OF DAYS OR NULL FOR DAILY REMINDERS';