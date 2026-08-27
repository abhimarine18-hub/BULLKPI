-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
    id SERIAL PRIMARY KEY,
    holiday_date DATE NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    applies_to VARCHAR(100) DEFAULT 'all'
);

-- Enable RLS and create policy for holidays
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all actions on holidays" ON holidays
    FOR ALL USING (true) WITH CHECK (true);

-- Create agent_leaves table
CREATE TABLE IF NOT EXISTS agent_leaves (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    leave_date DATE NOT NULL,
    reason TEXT,
    UNIQUE(agent_name, leave_date)
);

-- Enable RLS and create policy for agent_leaves
ALTER TABLE agent_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all actions on agent_leaves" ON agent_leaves
    FOR ALL USING (true) WITH CHECK (true);
