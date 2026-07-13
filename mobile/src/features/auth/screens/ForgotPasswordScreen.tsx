import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useState } from "react";

import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import AuthHeader from "../components/AuthHeader";
import AuthScreenShell from "../components/AuthScreenShell";
import AuthInput from "../components/AuthInput";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleSubmit = () => {
    Keyboard.dismiss();

    const trimmed = email.trim();
    if (!trimmed) {
      setFieldError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFieldError("Enter a valid email address");
      return;
    }

    setFieldError(undefined);
    // Reset API wiring comes next
  };

  return (
    <AuthScreenShell>
      <AuthHeader />

      <Text style={styles.description}>
        Enter your email address and we will send you a link to reset your
        password.
      </Text>

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setFieldError(undefined);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        error={fieldError}
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSubmit}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>SEND RESET LINK</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Remember your password?</Text>
        <TouchableOpacity onPress={() => goBack("/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
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
