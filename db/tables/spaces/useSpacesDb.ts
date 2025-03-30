import { useSQLiteContext } from "expo-sqlite";

export function useSpacesDb() {
  const db = useSQLiteContext();

  async function getAllSpaces() {
    return await db.getAllAsync("SELECT * FROM spaces");
  }

  async function addSpace(name: string, parentId?: number | null) {
    await db.runAsync("INSERT INTO spaces (name, parent_id) VALUES (?, ?)", [
      name,
      parentId ?? null,
    ]);
  }

  async function deleteSpace(id: number) {
    await db.runAsync("DELETE FROM spaces WHERE id = ?", [id]);
  }
  return {
    getAllSpaces,
    addSpace,
    deleteSpace,
  };
}
