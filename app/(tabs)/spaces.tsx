// screens/TabTwoScreen.tsx
import React from "react";
import { View, TextInput, StyleSheet, ScrollView } from "react-native";
import ScreenContainer from "@/components/ScreenContainer";
import SpaceItem from "@/components/SpaceItem";
import { ThemedView } from "@/components/ThemedView";
import { useSpaces } from "@/hooks/useSpaces";

export default function TabTwoScreen() {
  const {
    spaceTree,
    newTopLevelName,
    setNewTopLevelName,
    addTopLevelSpace,
    addChildSpace,
    removeSpace,
  } = useSpaces();

  return (
    <ScreenContainer>
      {/* Render all top-level spaces */}
      <ScrollView>
        {spaceTree.map((space) => (
          <SpaceItem
            key={space.id}
            space={space}
            onAddChild={addChildSpace}
            onDelete={removeSpace}
          />
        ))}
      </ScrollView>

      {/* Input to add new top-level space */}
      <ThemedView style={styles.topLevelRow}>
        <TextInput
          placeholder="Add a new space"
          onChangeText={setNewTopLevelName}
          value={newTopLevelName}
          onSubmitEditing={addTopLevelSpace}
          style={styles.textInputTop}
        />
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topLevelRow: {
    flexDirection: "column",
  },
  textInputTop: {
    borderWidth: 1,
    padding: 12,
    marginLeft: 12,
    marginRight: 12,
  },
});
