-- Supabase Schema - Current State (As of 2026-08-24)
-- Contains the actual current structure of all tables, views, and schemas.

-- Enable UUID generation extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    lead VARCHAR(255),
    employee_id VARCHAR(50)
);

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(255),
    experience NUMERIC,
    reporting_manager VARCHAR(255),
    description TEXT, -- JSON configuration stored as text locally
    login_id VARCHAR(255),
    password VARCHAR(255)
);

-- 3. KPIs Table
CREATE TABLE IF NOT EXISTS kpis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) DEFAULT ' Nos',
    target NUMERIC DEFAULT 0.0,
    direction VARCHAR(50) DEFAULT 'higher',
    team VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    checker VARCHAR(255),
    approver VARCHAR(255),
    ai_check_enabled BOOLEAN DEFAULT FALSE,
    drive_by VARCHAR(255) DEFAULT '',
    monitor_by VARCHAR(255) DEFAULT '',
    kra VARCHAR(255),
    description TEXT DEFAULT '',
    history JSONB DEFAULT '[]'::jsonb,
    daily_actual JSONB DEFAULT '{}'::jsonb,
    revised_alloc JSONB DEFAULT '{}'::jsonb,
    custom_holidays JSONB DEFAULT '{}'::jsonb,
    holidays_enabled BOOLEAN DEFAULT true,
    target_type VARCHAR(50) DEFAULT 'daily',
    targets_list JSONB DEFAULT '[]'::jsonb,
    monthly_alloc JSONB DEFAULT '{}'::jsonb,
    monthly_actual JSONB DEFAULT '{}'::jsonb,
    weekly_alloc JSONB DEFAULT '{}'::jsonb,
    weekly_actual JSONB DEFAULT '{}'::jsonb,
    daily_alloc JSONB DEFAULT '{}'::jsonb,
    kpi_type TEXT DEFAULT 'activity',
    report_config JSONB DEFAULT '{}'::jsonb,
    is_initiated_type BOOLEAN DEFAULT false,
    initiated_at TIMESTAMPTZ,
    initiated_by VARCHAR(255)
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team VARCHAR(255) NOT NULL,
    lead VARCHAR(255) NOT NULL,
    stages JSONB DEFAULT '[]'::jsonb,
    current_stage_idx INT DEFAULT 0
);

-- 5. Client Projects Table
CREATE TABLE IF NOT EXISTS client_projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objective TEXT,
    company_details TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    stages JSONB DEFAULT '[]'::jsonb,
    current_stage_idx INT DEFAULT 0,
    ai_chats JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Client Project Logs Table
CREATE TABLE IF NOT EXISTS client_project_logs (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES client_projects(id) ON DELETE CASCADE,
    log_text TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Table
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

-- 8. Individual Tasks Table
CREATE TABLE IF NOT EXISTS individual_tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    team VARCHAR(255) NOT NULL,
    assignee VARCHAR(255) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    kpi_id INTEGER REFERENCES kpis(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_type VARCHAR(50),
    recurrence_value VARCHAR(50),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
