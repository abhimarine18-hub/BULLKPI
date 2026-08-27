-- Add workflow columns to content_requests
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS accepted_by VARCHAR(255);
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
