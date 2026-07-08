import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/theme";

export default function SplashLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>C</Text>
      </View>

      <Text style={styles.title}>CONNECT</Text>

      <Text style={styles.tagline}>
        Connect People. Build Together.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: theme.spacing.lg,
  },

  logoText: {
    color: theme.colors.white,
    fontSize: 42,
    fontWeight: "700",
  },

  title: {
    ...theme.typography.h1,
    color: theme.colors.text,

    letterSpacing: 4,
  },

  tagline: {
    ...theme.typography.body,

    color: theme.colors.textSecondary,

    marginTop: theme.spacing.sm,
  },
});