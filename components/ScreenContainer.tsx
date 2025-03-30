import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const backgroundColor = useThemeColor({}, "background");

  return <View style={[{ backgroundColor }, styles.parent]}>{children}</View>;
}

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    paddingBottom: 100,
  },
});
