-- Add ai_checking_enabled column to kpis table
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS ai_checking_enabled BOOLEAN DEFAULT false;
