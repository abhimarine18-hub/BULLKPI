CREATE TABLE IF NOT EXISTS video_productions (
  id SERIAL PRIMARY KEY,
  video_type VARCHAR(255),
  video_title VARCHAR(255),
  platform VARCHAR(50),
  assigned_agent VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'planned',
  shot_at TIMESTAMPTZ,
  shooting_notes TEXT,
  edited_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  views NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE video_productions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON video_productions FOR ALL USING (true) WITH CHECK (true);
