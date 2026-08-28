import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://hdelynngavpavndjxyvk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZWx5bm5nYXZwYXZuZGp4eXZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjYxMTAwMywiZXhwIjoyMTAyMTg3MDAzfQ.FU8bqfhSe29Q5Y8BkqBAlmawzjfhcfUt78z42iQZgMQ");

const sql = `
CREATE TABLE IF NOT EXISTS monthly_focus_plans (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(255) NOT NULL,
    month_key VARCHAR(7) NOT NULL,
    state_name VARCHAR(255) NOT NULL,
    language_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (agent_name, month_key)
);
ALTER TABLE monthly_focus_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow open read access" ON monthly_focus_plans;
DROP POLICY IF EXISTS "Allow open insert access" ON monthly_focus_plans;
DROP POLICY IF EXISTS "Allow open update access" ON monthly_focus_plans;
DROP POLICY IF EXISTS "Allow open delete access" ON monthly_focus_plans;
CREATE POLICY "Allow open read access" ON monthly_focus_plans FOR SELECT USING (true);
CREATE POLICY "Allow open insert access" ON monthly_focus_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow open update access" ON monthly_focus_plans FOR UPDATE USING (true);
CREATE POLICY "Allow open delete access" ON monthly_focus_plans FOR DELETE USING (true);
`;

const run = async () => {
  const { data, error } = await supabase.from("monthly_focus_plans").select("*").limit(1);
  if (error) {
    console.log("Error querying monthly_focus_plans:", error.message, error.code);
  } else {
    console.log("Success! Table exists. Data:", data);
  }
};
run();
