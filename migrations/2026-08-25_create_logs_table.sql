-- Migration: Create logs table to track daily KPI shortfalls, reasons, and alternate target dates.
-- Created At: 2026-08-25

CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  kpi_id INTEGER NOT NULL REFERENCES kpis(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  target NUMERIC NOT NULL,
  carry_forward NUMERIC NOT NULL,
  effective_target NUMERIC NOT NULL,
  actual NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  alternate_target_date DATE,
  logged_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
