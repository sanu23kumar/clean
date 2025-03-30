// TabTwoScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Pressable, StyleSheet, TextInput } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import ScreenContainer from "@/components/ScreenContainer";
import { ThemedText } from "@/components/ThemedText";

/**
 * Build a tree from the flat spaces list.
 * Each space with a null parent_id is top-level.
 * Each space with a parent_id belongs to that parent's children[] array.
 */
function buildTreeFromList(list: any[]) {
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

/**
 * Recursive component that displays a single space, a button to toggle child input,
 * and renders each child (if any) underneath with indentation.
 */
function SpaceItem({
  space,
  onAddChild,
  onDelete,
  indentation = 0,
}: {
  space: any;
  onAddChild: (parentId: number, name: string) => void;
  onDelete: (id: number) => void;
  indentation?: number;
}) {
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [childName, setChildName] = useState("");

  const handleAddChild = () => {
    const trimmed = childName.trim();
    if (!trimmed) return;
    onAddChild(space.id, trimmed);
    setChildName("");
    setIsAddingChild(false);
  };

  return (
    <View style={[styles.spaceItemContainer, { marginLeft: indentation }]}>
      {/* Row with space name and controls */}
      <View style={styles.spaceRow}>
        <Pressable
          style={styles.addButton}
          onPress={() => setIsAddingChild(!isAddingChild)}
        >
          <ThemedText>+</ThemedText>
        </Pressable>
        {/* Tapping space name to delete it (or you could show a separate "Delete" button) */}
        <Pressable onLongPress={() => onDelete(space.id)}>
          <ThemedText style={styles.spaceText}>{space.name}</ThemedText>
        </Pressable>
        {/* A + button to toggle input for adding a child */}
      </View>

      {/* Show child input only when user clicked + */}
      {isAddingChild && (
        <View style={styles.addChildContainer}>
          <TextInput
            placeholder="Enter child name..."
            value={childName}
            onChangeText={setChildName}
            onSubmitEditing={handleAddChild}
            style={styles.textInput}
          />
          <Pressable onPress={handleAddChild} style={styles.addAction}>
            <ThemedText>Add</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsAddingChild(false);
              setChildName("");
            }}
            style={styles.cancelAction}
          >
            <ThemedText>Cancel</ThemedText>
          </Pressable>
        </View>
      )}

      {/* Render children recursively */}
      {space.children?.map((child: any) => (
        <SpaceItem
          key={child.id}
          space={child}
          onAddChild={onAddChild}
          onDelete={onDelete}
          indentation={indentation + 1}
        />
      ))}
    </View>
  );
}

export default function TabTwoScreen() {
  const db = useSQLiteContext();

  const [spaceTree, setSpaceTree] = useState<any[]>([]);
  const [newTopLevelName, setNewTopLevelName] = useState("");

  // Fetch all spaces from DB and build a nested tree
  const getAllSpaces = async () => {
    const result = await db.getAllAsync("SELECT * FROM spaces");
    setSpaceTree(buildTreeFromList(result));
  };

  // Add a new top-level space (parent_id = NULL)
  const addTopLevelSpace = async () => {
    const trimmed = newTopLevelName.trim();
    if (!trimmed) return;
    await db.runAsync("INSERT INTO spaces (name, parent_id) VALUES (?, ?)", [
      trimmed,
      null,
    ]);
    setNewTopLevelName("");
    await getAllSpaces();
  };

  // Add a child space
  const addChildSpace = async (parentId: number, childName: string) => {
    await db.runAsync("INSERT INTO spaces (name, parent_id) VALUES (?, ?)", [
      childName,
      parentId,
    ]);
    await getAllSpaces();
  };

  // Delete a space (children get deleted if ON DELETE CASCADE is enabled)
  const deleteSpace = async (id: number) => {
    await db.runAsync("DELETE FROM spaces WHERE id = ?", [id]);
    await getAllSpaces();
  };

  useEffect(() => {
    getAllSpaces();
  }, []);

  return (
    <ScreenContainer>
      {/* Render all top-level spaces */}
      <View>
        {spaceTree.map((space) => (
          <SpaceItem
            key={space.id}
            space={space}
            onAddChild={addChildSpace}
            onDelete={deleteSpace}
          />
        ))}
      </View>

      <View style={styles.topLevelRow}>
        <TextInput
          placeholder="Add a new space"
          onChangeText={setNewTopLevelName}
          value={newTopLevelName}
          onSubmitEditing={addTopLevelSpace}
          style={styles.textInputTop}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: "space-between",
  },
  spaceItemContainer: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  spaceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceText: {
    marginLeft: 8,
  },
  addButton: {
    // Style for the + button next to each space
  },
  addChildContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 8,
    padding: 12,
    flex: 1,
  },
  textInputTop: {
    borderWidth: 1,
    padding: 12,
    marginLeft: 12,
    marginRight: 12,
  },
  addAction: {
    marginLeft: 12,
    // Style for the "Add" or "+" button
  },
  cancelAction: {
    marginLeft: 8,
  },
  topLevelRow: {
    flexDirection: "column",
    marginBottom: 8,
    position: "absolute",
    bottom: 88,
    left: 0,
    right: 0,
  },
});
