import { Image, StyleSheet, Platform, SafeAreaView } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <SafeAreaView style={[{ backgroundColor }, styles.parent]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingBottom: 100,
  },
});
