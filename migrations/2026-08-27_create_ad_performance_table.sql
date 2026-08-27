CREATE TABLE IF NOT EXISTS ad_performance (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  campaign_name VARCHAR(255),
  adset_name VARCHAR(255),
  ad_name VARCHAR(255),
  spend NUMERIC DEFAULT 0.0,
  reach BIGINT DEFAULT 0,
  leads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ad_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON ad_performance FOR ALL USING (true) WITH CHECK (true);
