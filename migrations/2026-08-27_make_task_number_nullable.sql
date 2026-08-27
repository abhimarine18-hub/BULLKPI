-- Allow task_number to be null so content requests can be inserted without it
-- (the column already has a null value in existing rows, so the NOT NULL was 
-- likely added later or is a default serial that was never set up correctly)
ALTER TABLE content_requests ALTER COLUMN task_number DROP NOT NULL;
