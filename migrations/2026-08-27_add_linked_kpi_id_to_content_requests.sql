ALTER TABLE content_requests ADD COLUMN IF NOT EXISTS linked_kpi_id INT REFERENCES kpis(id);
