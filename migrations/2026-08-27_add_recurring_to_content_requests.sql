-- Add recurring support columns to content_requests
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS recurrence_type VARCHAR(20);
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS recurrence_end_date DATE;
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS recurrence_parent_id INT REFERENCES content_requests(id) ON DELETE SET NULL;
