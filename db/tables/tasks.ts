export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY NOT NULL,
    item_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    frequency TEXT NOT NULL,
    last_completed_at TEXT,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
  );
`;
