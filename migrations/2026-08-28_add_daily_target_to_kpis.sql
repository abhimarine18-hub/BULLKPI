-- Add daily_target column to kpis table
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS daily_target NUMERIC;
