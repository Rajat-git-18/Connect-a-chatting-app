import { View, Text, StyleSheet } from "react-native";
import theme from "@/theme";

export default function AuthHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoLetter}>C</Text>
      </View>

      <Text style={styles.title}>CONNECT</Text>

      <Text style={styles.subtitle}>
        Connect People. Build Together.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: theme.spacing["4xl"],
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.full,

    backgroundColor: theme.colors.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: theme.spacing.lg,
  },

  logoLetter: {
    color: theme.colors.white,
    fontSize: 36,
    fontWeight: "700",
  },

  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    letterSpacing: 4,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});