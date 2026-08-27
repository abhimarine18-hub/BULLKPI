-- Add has_daily_target column to kpis table
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS has_daily_target BOOLEAN DEFAULT false;
