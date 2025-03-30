export const CREATE_ITEMS_TABLE = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY NOT NULL,
    space_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
  );
`;
