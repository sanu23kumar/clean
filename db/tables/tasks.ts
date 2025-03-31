import type { SQLiteDatabase } from "expo-sqlite";

export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY NOT NULL,
    item_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    frequency TEXT NOT NULL,
    last_completed_at TEXT,
    FOREIGN KEY (item_id) REFERENCES spaces(id) ON DELETE CASCADE
  );
`;

export interface Task {
  id: number;
  item_id: number;
  name: string;
  frequency: string;
  last_completed_at: string | null;
}

export async function getAllTasks(db: SQLiteDatabase): Promise<Task[]> {
  return await db.getAllAsync<Task>("SELECT * FROM tasks");
}

export async function getTaskById(
  db: SQLiteDatabase,
  id: number
): Promise<Task | null> {
  return await db.getFirstAsync<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
}

export async function getTasksByItemId(
  db: SQLiteDatabase,
  itemId: number | null
): Promise<Task[]> {
  if (itemId === null) return [];
  return await db.getAllAsync<Task>("SELECT * FROM tasks WHERE item_id = ?", [
    itemId,
  ]);
}

export async function addTask(
  db: SQLiteDatabase,
  itemId: number,
  name: string,
  frequency: string,
  lastCompletedAt?: string
): Promise<void> {
  await db.runAsync(
    `INSERT INTO tasks (item_id, name, frequency, last_completed_at)
     VALUES (?, ?, ?, ?)`,
    [itemId, name, frequency, lastCompletedAt ?? null]
  );
}

export async function updateTask(
  db: SQLiteDatabase,
  id: number,
  itemId: number,
  name: string,
  frequency: string,
  lastCompletedAt?: string
): Promise<void> {
  await db.runAsync(
    `UPDATE tasks
     SET item_id = ?, name = ?, frequency = ?, last_completed_at = ?
     WHERE id = ?`,
    [itemId, name, frequency, lastCompletedAt ?? null, id]
  );
}

export async function deleteTask(
  db: SQLiteDatabase,
  id: number
): Promise<void> {
  await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
}
