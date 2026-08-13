-- Create Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  lead VARCHAR(255)
);

-- Create Team Members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) UNIQUE,
  designation VARCHAR(255),
  experience INT DEFAULT 0,
  reporting_manager VARCHAR(255),
  description TEXT
);

-- Create KPIs table
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
  history JSONB DEFAULT '[]'::jsonb,
  daily_actual JSONB DEFAULT '{}'::jsonb,
  revised_alloc JSONB DEFAULT '{}'::jsonb,
  custom_holidays JSONB DEFAULT '{}'::jsonb,
  holidays_enabled BOOLEAN DEFAULT true,
  target_type VARCHAR(50) DEFAULT 'daily',
  targets_list JSONB DEFAULT '[]'::jsonb
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  team VARCHAR(255) NOT NULL,
  lead VARCHAR(255) NOT NULL,
  stages JSONB DEFAULT '[]'::jsonb,
  current_stage_idx INT DEFAULT 0
);

-- Insert Default Teams
INSERT INTO teams (id, name, description, lead) VALUES
(1, 'Digital Marketing', 'Building brand visibility, engagement and cost-efficient leads across digital channels', 'Anand Kumar'),
(2, 'Video Production', 'Producing on-brand video content on schedule', 'Jefrin'),
(3, 'Graphic Designing', 'Delivering design assets for campaigns and collateral', 'Sandeep'),
(4, 'Enquiry Management', 'Managing inbound enquiries and converting them into qualified leads', 'Malathi'),
(5, 'CRM and Coordinator', 'Customer relationship management and coordination', 'Keerthana'),
(6, 'EXPO AND EVENTS', 'Generating and capturing leads at trade shows and exhibitions', 'Anitha')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, lead = EXCLUDED.lead;

-- Insert Default Members
INSERT INTO team_members (id, team_id, name, employee_id, designation, experience, reporting_manager, description) VALUES
(1, 1, 'Anand Kumar', 'EMP-1042', 'Digital Marketing Junior Manager', 5, 'CMO', 'Leads overall digital campaigns and strategy.'),
(2, 1, 'Krithika', 'EMP-1058', 'Intern - Digital Marketing', 1, 'Anand Kumar', 'Assists with social content and digital updates.'),
(3, 2, 'Jefrin', 'EMP-1071', 'Video Production Lead', 6, 'Marketing Head', 'Manages video content development and scheduling.'),
(4, 2, 'Harish', 'EMP-1072', 'Video Editor', 3, 'Jefrin', 'Subordinate of Jefrin.'),
(5, 2, 'Sanjay', 'EMP-1073', 'Videographer', 3, 'Jefrin', 'Subordinate of Jefrin.'),
(6, 2, 'Anand', 'EMP-1074', 'Video Assistant', 2, 'Jefrin', 'Subordinate of Jefrin.'),
(7, 2, 'Shivangi', 'EMP-1075', 'Script Writer', 2, 'Jefrin', 'Subordinate of Jefrin.'),
(8, 3, 'Sandeep', 'EMP-1083', 'Graphic Design Lead', 6, 'Marketing Head', 'Oversees print and digital design requests.'),
(9, 3, 'Gopi', 'EMP-1084', 'Graphic Designer', 3, 'Sandeep', 'Subordinate of Sandeep for domestic and international.'),
(10, 3, 'Kalaivani', 'EMP-1085', 'Graphic Designer', 3, 'Sandeep', 'Subordinate of Sandeep for domestic and international.'),
(11, 3, 'Nowshand', 'EMP-1086', 'Graphic Designer - IB', 4, 'Sandeep', 'Subordinate of Sandeep dedicated for the IB.'),
(12, 4, 'Malathi', 'EMP-1094', 'Enquiry Desk Lead', 7, 'Marketing Head', 'Oversees enquiry intake and conversion tracking.'),
(13, 4, 'Saranya', 'EMP-1095', 'Enquiry Agent', 3, 'Malathi', 'Agent working under Malathi.'),
(14, 4, 'Shalini', 'EMP-1096', 'Enquiry Agent', 3, 'Malathi', 'Agent working under Malathi.'),
(15, 4, 'Smeronika', 'EMP-1097', 'Enquiry Agent', 2, 'Malathi', 'Agent working under Malathi.'),
(16, 4, 'Jennet', 'EMP-1098', 'Enquiry Agent', 2, 'Malathi', 'Agent working under Malathi.'),
(17, 4, 'Agent 1', 'EMP-1099', 'Enquiry Agent 1', 1, 'Malathi', 'Agent 1 working under Malathi.'),
(18, 4, 'Agent 2', 'EMP-1100', 'Enquiry Agent 2', 1, 'Malathi', 'Agent 2 working under Malathi.'),
(19, 4, 'Agent 3', 'EMP-1101', 'Enquiry Agent 3', 1, 'Malathi', 'Agent 3 working under Malathi.'),
(20, 4, 'Agent 4', 'EMP-1102', 'Enquiry Agent 4', 1, 'Malathi', 'Agent 4 working under Malathi.'),
(21, 4, 'Agent 5', 'EMP-1103', 'Enquiry Agent 5', 1, 'Malathi', 'Agent 5 working under Malathi.'),
(22, 4, 'Agent 6', 'EMP-1104', 'Enquiry Agent 6', 1, 'Malathi', 'Agent 6 working under Malathi.'),
(23, 5, 'Keerthana', 'EMP-1119', 'CRM Lead & Coordinator', 5, 'Marketing Head', 'Leads client relationships and service coordination.'),
(24, 6, 'Anitha', 'EMP-1105', 'Events & Expo Lead', 5, 'Marketing Head', 'Plans and executes expo participation end-to-end.')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  designation = EXCLUDED.designation, 
  experience = EXCLUDED.experience, 
  reporting_manager = EXCLUDED.reporting_manager, 
  description = EXCLUDED.description;
