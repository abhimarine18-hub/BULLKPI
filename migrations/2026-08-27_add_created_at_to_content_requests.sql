-- Add created_at column to content_requests for tracking pending timestamps
ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
