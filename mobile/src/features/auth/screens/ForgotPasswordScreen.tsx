import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import AuthHeader from "../components/AuthHeader";

export default function ForgotPasswordScreen() {
  return (
    <View style={styles.container}>
      <AuthHeader />

      <Text style={styles.description}>
        Enter your email address and we will send you a link to reset your
        password.
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>SEND RESET LINK</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember your password?</Text>

        <TouchableOpacity onPress={() => goBack("/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: theme.spacing.xl,
  },

  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    color: theme.colors.text,
  },

  primaryButton: {
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    color: theme.colors.white,
    ...theme.typography.button,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing["2xl"],
  },

  footerText: {
    color: theme.colors.textSecondary,
  },

  link: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
});
