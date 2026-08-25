CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  lead_source VARCHAR(255),
  customer_name VARCHAR(255),
  phone VARCHAR(50),
  assigned_agent VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'given',
  called_at TIMESTAMPTZ,
  call_notes TEXT,
  converted_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  sale_value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON leads FOR ALL USING (true) WITH CHECK (true);
