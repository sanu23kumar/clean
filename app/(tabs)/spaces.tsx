// screens/TabTwoScreen.tsx
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Text,
  Pressable,
  View,
} from "react-native";
import ScreenContainer from "@/components/ScreenContainer";
import { ThemedView } from "@/components/ThemedView";
import { useSpaces } from "@/hooks/useSpaces";
import { Space } from "@/db/tables/spaces";
import { Task } from "@/db/tables/tasks";

export default function TabTwoScreen() {
  const [parentId, setParentId] = useState<(Space | Task | null)[]>([null]);
  const {
    spaceTree,
    newTopLevelName,
    setNewTopLevelName,
    addTopLevelSpace,
    addChildSpace,
    removeSpace,
  } = useSpaces(parentId[parentId.length - 1]?.id ?? null);

  const renderItem = ({ item }: { item: Space | Task }) => {
    function onPress() {
      setParentId((parentId) => [...parentId, item]);
    }
    return (
      <Pressable onPress={onPress}>
        <Text>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <ScreenContainer>
      {/* Render all top-level spaces */}
      <View style={styles.breadCrumbs}>
        {parentId.map((id) => {
          const onPressBradCrumb = () => {
            const indexOfSelectedBreadCrumb = parentId.findIndex(
              (p) => p?.id === id?.id
            );
            setParentId(parentId.slice(0, indexOfSelectedBreadCrumb + 1));
          };
          return (
            <Pressable
              style={styles.breadCrumbButton}
              onPress={onPressBradCrumb}
            >
              <Text style={styles.breadCrumbText}>{id ? id.name : "HOME"}</Text>
              <Text style={styles.slash}>/</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList data={spaceTree} renderItem={renderItem} />

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
  breadCrumbButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  breadCrumbText: {
    fontSize: 16,
    backgroundColor: "lightgrey",
    borderRadius: 4,
    padding: 2,
    margin: 2,
  },
  breadCrumbs: {
    flexDirection: "row",
  },
  slash: {
    color: "grey",
  },
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
