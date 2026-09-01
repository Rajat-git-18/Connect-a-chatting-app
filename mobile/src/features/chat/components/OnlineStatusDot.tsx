import { View, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import theme from "@/theme";

type OnlineStatusDotProps = {
  isOnline: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function OnlineStatusDot({
  isOnline,
  size = 12,
  style,
}: OnlineStatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOnline
            ? theme.colors.success
            : theme.colors.textTertiary,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
});
