ALTER TABLE kpis ADD COLUMN IF NOT EXISTS monthly_target_revised JSONB DEFAULT '{}'::jsonb;
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS revised_target_log JSONB DEFAULT '[]'::jsonb;
