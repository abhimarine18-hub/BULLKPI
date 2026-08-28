-- Migration: create team_tasks table
CREATE TABLE IF NOT EXISTS team_tasks (
  id SERIAL PRIMARY KEY,
  team VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(255),
  raised_by VARCHAR(255),
  due_date DATE,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all team_tasks" ON team_tasks;
CREATE POLICY "Allow all team_tasks" ON team_tasks FOR ALL USING (true) WITH CHECK (true);
