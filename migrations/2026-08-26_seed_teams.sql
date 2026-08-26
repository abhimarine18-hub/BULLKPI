-- Seed teams
INSERT INTO teams (name) VALUES ('Digital Marketing') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Video Production') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Graphic Designing') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Enquiry Management') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('CRM and Coordinator') ON CONFLICT (name) DO NOTHING;
INSERT INTO teams (name) VALUES ('Expo and Events') ON CONFLICT (name) DO NOTHING;
