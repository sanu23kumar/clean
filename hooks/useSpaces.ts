import { useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";
import {
  addSpace,
  deleteSpace,
  getSpaces,
  getSpacesById,
  Space,
} from "@/db/tables/spaces";
import { getTasksByItemId, Task } from "@/db/tables/tasks";

export function useSpaces(parent_id: number | null) {
  const db = useSQLiteContext();

  const [spaceTree, setSpaceTree] = useState<(Space | Task)[]>([]);
  const [newTopLevelName, setNewTopLevelName] = useState("");

  async function fetchSpaceTree() {
    const resultSpaces = await getSpaces(db, parent_id);
    const resultTasks = await getTasksByItemId(db, parent_id);
    setSpaceTree([...resultSpaces, ...resultTasks]);
  }

  useEffect(() => {
    fetchSpaceTree();
  }, [parent_id]);

  async function addTopLevelSpace() {
    const trimmed = newTopLevelName.trim();
    if (!trimmed) return;
    await addSpace(db, trimmed, parent_id);
    setNewTopLevelName("");
    await fetchSpaceTree();
  }

  async function addChildSpace(parentId: number, childName: string) {
    await addSpace(db, childName, parentId);
    await fetchSpaceTree();
  }

  async function removeSpace(id: number) {
    await deleteSpace(db, id);
    await fetchSpaceTree();
  }

  return {
    spaceTree,
    newTopLevelName,
    setNewTopLevelName,
    addTopLevelSpace,
    addChildSpace,
    removeSpace,
  };
}
