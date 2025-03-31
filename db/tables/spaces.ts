import { SQLiteDatabase } from "expo-sqlite";

export const CREATE_SPACES_TABLE = `
  CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY NOT NULL,
    parent_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES spaces(id) ON DELETE CASCADE
  );
`;

export interface Space {
  id: number;
  parent_id: number | null;
  name: string;
}

export async function getTopSpaces(db: SQLiteDatabase): Promise<Space[]> {
  const rows = await db.getAllAsync<Space>(
    "SELECT * FROM spaces WHERE parent_id IS NULL"
  );
  return rows;
}

export async function getSpacesById(db: SQLiteDatabase, id: number) {
  const rows = await db.getAllAsync<Space>(
    "SELECT * FROM spaces WHERE parent_id = ?",
    [id]
  );
  return rows;
}

export async function getSpaces(db: SQLiteDatabase, id: number | null) {
  if (id) return getSpacesById(db, id);
  return getTopSpaces(db);
}

export async function addSpace(
  db: SQLiteDatabase,
  name: string,
  parentId?: number | null
): Promise<void> {
  await db.runAsync("INSERT INTO spaces (name, parent_id) VALUES (?, ?)", [
    name,
    parentId ?? null,
  ]);
}

export async function deleteSpace(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM spaces WHERE id = ?", [id]);
}
