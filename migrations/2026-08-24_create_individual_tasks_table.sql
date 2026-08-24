-- Migration: Create individual_tasks table for lightweight one-person, one-deadline tasks.
-- Created At: 2026-08-24

CREATE TABLE IF NOT EXISTS individual_tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  team VARCHAR(255) NOT NULL,
  assignee VARCHAR(255) NOT NULL,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'normal',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
