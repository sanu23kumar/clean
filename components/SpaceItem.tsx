import React, { useState } from "react";
import { View, Pressable, TextInput, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";

interface SpaceItemProps {
  space: any;
  onAddChild: (parentId: number, name: string) => void;
  onDelete: (id: number) => void;
  indentation?: number;
}

/**
 * Recursive component that displays a single space, a button to toggle child input,
 * and renders each child (if any) underneath with indentation.
 */
export default function SpaceItem({
  space,
  onAddChild,
  onDelete,
  indentation = 0,
}: SpaceItemProps) {
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

        {/* Long-press space name to delete it */}
        <Pressable onLongPress={() => onDelete(space.id)}>
          <ThemedText style={styles.spaceText}>{space.name}</ThemedText>
        </Pressable>
      </View>

      {/* Child input toggled by the + button */}
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

      {/* Recursively render any children */}
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

const styles = StyleSheet.create({
  spaceItemContainer: {
    marginTop: 12,
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
    // Style for the + button
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
  addAction: {
    marginLeft: 12,
  },
  cancelAction: {
    marginLeft: 8,
  },
});
