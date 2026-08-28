-- Add kpi_type and report_config columns to kpis table
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS kpi_type VARCHAR DEFAULT 'activity';
ALTER TABLE kpis ADD COLUMN IF NOT EXISTS report_config JSONB DEFAULT NULL;
