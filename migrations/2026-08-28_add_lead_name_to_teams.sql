-- Add lead_name column to teams table if not present
ALTER TABLE teams ADD COLUMN IF NOT EXISTS lead_name VARCHAR(255);

-- Seed lead_name for teams
UPDATE teams SET lead_name = 'Anand Kumar' WHERE name = 'Digital Marketing';
UPDATE teams SET lead_name = 'Sandeep' WHERE name = 'Video Production';
UPDATE teams SET lead_name = 'Sandeep' WHERE name = 'Graphic Designing';
UPDATE teams SET lead_name = 'Malathi' WHERE name = 'Enquiry Management';
UPDATE teams SET lead_name = 'Abhilash' WHERE name = 'CRM and Coordinator';
UPDATE teams SET lead_name = 'Anitha' WHERE name = 'Expo and Events';
