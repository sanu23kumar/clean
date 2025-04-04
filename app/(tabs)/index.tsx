import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import ScreenContainer from "@/components/ScreenContainer";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <ScreenContainer>
      <ThemedText>Hello</ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({});
