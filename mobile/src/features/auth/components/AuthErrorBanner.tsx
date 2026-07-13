import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

interface AuthErrorBannerProps {
  message: string;
}

export default function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) return null;

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Ionicons
        name="alert-circle"
        size={20}
        color={theme.colors.error}
        style={styles.icon}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  icon: {
    marginTop: 1,
    marginRight: theme.spacing.sm,
  },

  message: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
