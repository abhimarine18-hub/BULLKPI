-- Migration: Create Monthly Focus Plans table (Shoot Plan)
DROP TABLE IF EXISTS monthly_focus_plans CASCADE;

CREATE TABLE monthly_focus_plans (
  id SERIAL PRIMARY KEY,
  person_name VARCHAR(255) NOT NULL,
  team VARCHAR(100),
  month_key VARCHAR(7) NOT NULL,
  state VARCHAR(255),
  language VARCHAR(100),
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(person_name, month_key)
);

-- Enable RLS with open access policies
ALTER TABLE monthly_focus_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow open read access" ON monthly_focus_plans FOR SELECT USING (true);
CREATE POLICY "Allow open insert access" ON monthly_focus_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow open update access" ON monthly_focus_plans FOR UPDATE USING (true);
CREATE POLICY "Allow open delete access" ON monthly_focus_plans FOR DELETE USING (true);
