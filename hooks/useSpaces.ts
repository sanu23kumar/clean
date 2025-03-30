// hooks/useSpaces.ts
import { useState, useEffect } from "react";
import { buildTreeFromList } from "@/utils/buildTreeFromList";
import { useSpacesDb } from "@/db/tables/spaces/useSpacesDb";

export function useSpaces() {
  const { getAllSpaces, addSpace, deleteSpace } = useSpacesDb();

  const [spaceTree, setSpaceTree] = useState<any[]>([]);
  const [newTopLevelName, setNewTopLevelName] = useState("");

  async function fetchSpaceTree() {
    const result = await getAllSpaces();
    setSpaceTree(buildTreeFromList(result));
  }

  useEffect(() => {
    fetchSpaceTree();
  }, []);

  async function addTopLevelSpace() {
    const trimmed = newTopLevelName.trim();
    if (!trimmed) return;
    await addSpace(trimmed, null);
    setNewTopLevelName("");
    await fetchSpaceTree();
  }

  async function addChildSpace(parentId: number, childName: string) {
    await addSpace(childName, parentId);
    await fetchSpaceTree();
  }

  async function removeSpace(id: number) {
    await deleteSpace(id);
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
