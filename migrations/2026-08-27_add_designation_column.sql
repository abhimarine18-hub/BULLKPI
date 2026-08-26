ALTER TABLE team_members ADD COLUMN IF NOT EXISTS designation VARCHAR(255);
UPDATE team_members SET designation = 'Department Head' WHERE name = 'Abhilash';
UPDATE team_members SET designation = 'CRM Coordinator' WHERE name = 'Keerthana';
