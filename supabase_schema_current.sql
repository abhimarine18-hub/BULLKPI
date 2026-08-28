-- Supabase Schema - Current State (Generated on 2026-08-28T18:51:16.974Z)

-- Table: teams
CREATE TABLE IF NOT EXISTS teams (
    id (type_unknown),
    name (type_unknown),
    lead_name (type_unknown)
);

-- Table: team_members
CREATE TABLE IF NOT EXISTS team_members (
    id (type_unknown),
    name (type_unknown),
    team (type_unknown),
    login_id (type_unknown),
    password_hash (type_unknown),
    designation (type_unknown),
    sub_team (type_unknown)
);

-- Table: kpis
CREATE TABLE IF NOT EXISTS kpis (
    id (type_unknown),
    name (type_unknown),
    team (type_unknown),
    market (type_unknown),
    unit (type_unknown),
    direction (type_unknown),
    cy_target (type_unknown),
    monthly_target (type_unknown),
    monthly_actual (type_unknown),
    do_person (type_unknown),
    drive_person (type_unknown),
    monitor_person (type_unknown),
    checker (type_unknown),
    approver (type_unknown),
    kpi_type (type_unknown),
    report_config (type_unknown),
    category (type_unknown),
    history (type_unknown),
    created_at (type_unknown),
    ai_checking_enabled (type_unknown),
    daily_target (type_unknown),
    has_daily_target (type_unknown),
    monthly_target_revised (type_unknown)
);

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
    id (type_unknown),
    title (type_unknown),
    team (type_unknown),
    do_person (type_unknown),
    drive_person (type_unknown),
    linked_kpi_id (type_unknown),
    objective (type_unknown),
    status (type_unknown),
    created_at (type_unknown)
);

-- Table: holidays
CREATE TABLE IF NOT EXISTS holidays (
    -- no rows to inspect columns
);

-- Table: agent_leaves
CREATE TABLE IF NOT EXISTS agent_leaves (
    -- no rows to inspect columns
);

-- Table: campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    -- no rows to inspect columns
);

-- Table: ad_performance
CREATE TABLE IF NOT EXISTS ad_performance (
    -- no rows to inspect columns
);

-- Table: content_requests
CREATE TABLE IF NOT EXISTS content_requests (
    id (type_unknown),
    task_number (type_unknown),
    campaign_id (type_unknown),
    content_type (type_unknown),
    requested_by (type_unknown),
    assigned_team (type_unknown),
    channel (type_unknown),
    planned_post_date (type_unknown),
    required_by_date (type_unknown),
    status (type_unknown),
    ai_suggestion (type_unknown),
    drive_link (type_unknown),
    posted_link (type_unknown),
    linked_kpi_id (type_unknown),
    title (type_unknown),
    brief (type_unknown),
    request_number (type_unknown),
    is_recurring (type_unknown),
    recurrence_type (type_unknown),
    recurrence_end_date (type_unknown),
    recurrence_parent_id (type_unknown),
    accepted_by (type_unknown),
    accepted_at (type_unknown),
    approved_by (type_unknown),
    approved_at (type_unknown)
);

-- Table: monthly_focus_plans
CREATE TABLE IF NOT EXISTS monthly_focus_plans (
    -- no rows to inspect columns
);

