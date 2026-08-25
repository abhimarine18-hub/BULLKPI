CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  assigned_agent VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'planned',
  event_date TIMESTAMPTZ,
  location VARCHAR(255),
  expected_leads INTEGER,
  actual_leads INTEGER,
  budget NUMERIC,
  actual_cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON events FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS vendor_payments (
  id SERIAL PRIMARY KEY,
  vendor_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(100),
  amount NUMERIC NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  invoice_number VARCHAR(100),
  payment_method VARCHAR(50),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE vendor_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app access" ON vendor_payments FOR ALL USING (true) WITH CHECK (true);
