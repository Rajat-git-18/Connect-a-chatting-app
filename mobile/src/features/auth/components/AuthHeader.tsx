import { View, Text, StyleSheet } from "react-native";
import theme from "@/theme";

interface AuthHeaderProps {
  compact?: boolean;
}

export default function AuthHeader({ compact = false }: AuthHeaderProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={[styles.logo, compact && styles.logoCompact]}>
        <Text style={[styles.logoLetter, compact && styles.logoLetterCompact]}>
          C
        </Text>
      </View>

      <Text style={[styles.title, compact && styles.titleCompact]}>
        CONNECT
      </Text>

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

  containerCompact: {
    marginBottom: theme.spacing.xl,
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

  logoCompact: {
    width: 64,
    height: 64,
    marginBottom: theme.spacing.md,
  },

  logoLetter: {
    color: theme.colors.white,
    fontSize: 36,
    fontWeight: "700",
  },

  logoLetterCompact: {
    fontSize: 28,
  },

  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    letterSpacing: 4,
  },

  titleCompact: {
    fontSize: 28,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
