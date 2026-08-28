-- Ensure lead_name is present on teams
ALTER TABLE teams ADD COLUMN IF NOT EXISTS lead_name VARCHAR(255);

-- Update lead names (CRM and Coordinator is now Keerthana)
UPDATE teams SET lead_name = 'Anand Kumar' WHERE name = 'Digital Marketing';
UPDATE teams SET lead_name = 'Sandeep' WHERE name = 'Video Production';
UPDATE teams SET lead_name = 'Sandeep' WHERE name = 'Graphic Designing';
UPDATE teams SET lead_name = 'Malathi' WHERE name = 'Enquiry Management';
UPDATE teams SET lead_name = 'Keerthana' WHERE name = 'CRM and Coordinator';
UPDATE teams SET lead_name = 'Anitha' WHERE name = 'Expo and Events';
