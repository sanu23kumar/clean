import { useSQLiteContext } from "expo-sqlite";

export function useTasksDb() {
  const db = useSQLiteContext();

  async function getAllTasks() {
    return await db.getAllAsync("SELECT * FROM tasks");
  }

  async function getTaskById(id: number) {
    return await db.getFirstAsync("SELECT * FROM tasks WHERE id = ?", [id]);
  }

  async function getTasksByItemId(itemId: number) {
    return await db.getAllAsync("SELECT * FROM tasks WHERE item_id = ?", [
      itemId,
    ]);
  }

  async function addTask(
    itemId: number,
    name: string,
    frequency: string,
    lastCompletedAt?: string
  ) {
    await db.runAsync(
      `INSERT INTO tasks (item_id, name, frequency, last_completed_at)
       VALUES (?, ?, ?, ?)`,
      [itemId, name, frequency, lastCompletedAt ?? null]
    );
  }

  async function updateTask(
    id: number,
    itemId: number,
    name: string,
    frequency: string,
    lastCompletedAt?: string
  ) {
    await db.runAsync(
      `UPDATE tasks
       SET item_id = ?, name = ?, frequency = ?, last_completed_at = ?
       WHERE id = ?`,
      [itemId, name, frequency, lastCompletedAt ?? null, id]
    );
  }

  async function deleteTask(id: number) {
    await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
  }

  return {
    getAllTasks,
    getTaskById,
    getTasksByItemId,
    addTask,
    updateTask,
    deleteTask,
  };
}
