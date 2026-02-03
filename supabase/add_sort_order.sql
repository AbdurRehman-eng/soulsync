-- Add sort_order column to cards table if it doesn't exist
ALTER TABLE cards ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Add sort_order column to tasks table if it doesn't exist
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing records with sequential sort_order based on created_at
UPDATE cards SET sort_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM cards
) AS subquery
WHERE cards.id = subquery.id AND cards.sort_order = 0;

UPDATE tasks SET sort_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM tasks
) AS subquery
WHERE tasks.id = subquery.id AND tasks.sort_order = 0;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cards_sort_order ON cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_tasks_sort_order ON tasks(sort_order);
CREATE INDEX IF NOT EXISTS idx_moods_sort_order ON moods(sort_order);
