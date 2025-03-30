export const CREATE_SPACES_TABLE = `
  CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY NOT NULL,
    parent_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES spaces(id) ON DELETE CASCADE
  );
`;
