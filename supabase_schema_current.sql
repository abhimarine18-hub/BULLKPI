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
    report_config JSONB DEFAULT '{}'::jsonb
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
