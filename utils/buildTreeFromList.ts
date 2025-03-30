/**
 * Build a tree from the flat spaces list.
 * Each space with a null parent_id is top-level.
 * Each space with a parent_id belongs to that parent's children[] array.
 */
export function buildTreeFromList(list: any[]) {
  const map: Record<number, any> = {};
  // Create a map of id -> space { ...spaceData, children: [] }
  list.forEach((space) => {
    map[space.id] = { ...space, children: [] };
  });

  const tree: any[] = [];
  // Assign each space to either root level or to its parent's children
  list.forEach((space) => {
    if (space.parent_id) {
      map[space.parent_id]?.children.push(map[space.id]);
    } else {
      tree.push(map[space.id]);
    }
  });

  return tree;
}
