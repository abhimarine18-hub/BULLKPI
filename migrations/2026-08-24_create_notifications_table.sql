-- Migration: Create notifications table to track date mismatch and action-slot updates.
-- Created At: 2026-08-24

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'date_mismatch', 'reminder'
  title VARCHAR(100),
  message TEXT NOT NULL,
  related_kpi_id INT REFERENCES kpis(id) ON DELETE CASCADE,
  related_project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  recipient VARCHAR(100) NOT NULL, -- employee name matching employee's name
  status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
