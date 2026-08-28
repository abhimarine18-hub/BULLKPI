-- Add sub_team column to team_members table
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS sub_team VARCHAR(255);
