import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type HomeHeaderProps = {
  onPressNotifications?: () => void;
};

export default function HomeHeader({ onPressNotifications }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>C</Text>
        </View>
        <Text style={styles.title}>CONNECT</Text>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={theme.colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  logoLetter: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    letterSpacing: 2,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
});
