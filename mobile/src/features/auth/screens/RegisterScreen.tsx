import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import theme from "@/theme";
import AuthHeader from "../components/AuthHeader";
import AuthScreenShell from "../components/AuthScreenShell";
import AuthErrorBanner from "../components/AuthErrorBanner";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AuthInput from "../components/AuthInput";
import {
  registerSchema,
  type RegisterFormData,
} from "../schema/auth.schema";
import { getAuthErrorMessage } from "../utils/getAuthErrorMessage";
import { register } from "@/services/api/auth.api";
import { saveToken } from "@/services/auth/auth.service";

export default function RegisterScreen() {
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const clearError = () => {
    if (registerError) setRegisterError(null);
  };

  const onSubmit = async (data: RegisterFormData) => {
    Keyboard.dismiss();
    setRegisterError(null);

    try {
      const { confirmPassword, ...payload } = data;
      const response = await register(payload);
      await saveToken(response.token);
      router.replace("/(protected)/home");
    } catch (error: unknown) {
      setRegisterError(getAuthErrorMessage(error, "register"));
    }
  };

  return (
    <AuthScreenShell contentAlign="top">
      <AuthHeader compact />

      {registerError ? <AuthErrorBanner message={registerError} /> : null}

      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Display Name"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
            error={errors.displayName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Username"
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            returnKeyType="next"
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            error={errors.username?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Email"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Password"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            textContentType="newPassword"
            returnKeyType="next"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Confirm Password"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <TouchableOpacity
        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmitting ? "Creating Account..." : "SIGN UP"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.line} />
      </View>

      <GoogleSignInButton />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: theme.colors.white,
    ...theme.typography.button,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.xl,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },

  or: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.textSecondary,
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
