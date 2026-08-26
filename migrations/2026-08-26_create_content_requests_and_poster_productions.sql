CREATE TABLE IF NOT EXISTS content_requests (
  id SERIAL PRIMARY KEY,
  request_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  planned_post_date DATE NOT NULL,
  required_by_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  brief TEXT,
  requested_by VARCHAR(255) NOT NULL,
  assigned_team VARCHAR(255) NOT NULL,
  production_ref_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE content_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON content_requests FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS poster_productions (
  id SERIAL PRIMARY KEY,
  poster_title VARCHAR(255) NOT NULL,
  assigned_agent VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'planned',
  raw_footage_drive_link TEXT, -- rename/align links
  approved_at TIMESTAMPTZ,
  approver_name VARCHAR(255),
  posted_at TIMESTAMPTZ,
  youtube_link TEXT, -- reuse/align standard link names from video
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE poster_productions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON poster_productions FOR ALL USING (true) WITH CHECK (true);
