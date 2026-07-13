import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";

import theme from "@/theme";
import { push } from "@/utils/navigation";
import AuthHeader from "../components/AuthHeader";
import AuthScreenShell from "../components/AuthScreenShell";
import AuthErrorBanner from "../components/AuthErrorBanner";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AuthInput from "../components/AuthInput";
import {
  loginSchema,
  type LoginFormData,
} from "../schema/auth.schema";
import { getAuthErrorMessage } from "../utils/getAuthErrorMessage";
import { login } from "@/services/api/auth.api";
import { getToken, saveToken } from "@/services/auth/auth.service";

export default function LoginScreen() {
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const clearError = () => {
    if (loginError) setLoginError(null);
  };

  const onSubmit = async (data: LoginFormData) => {
    Keyboard.dismiss();
    setLoginError(null);

    try {
      const response = await login(data);
      await saveToken(response.token);
      await getToken();
      router.replace("/(protected)/home");
    } catch (error: unknown) {
      setLoginError(getAuthErrorMessage(error, "login"));
    }
  };

  return (
    <AuthScreenShell>
      <AuthHeader />

      {loginError ? <AuthErrorBanner message={loginError} /> : null}

      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, value } }) => (
          <AuthInput
            placeholder="Email or Username"
            value={value}
            onChangeText={(text) => {
              clearError();
              onChange(text);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            returnKeyType="next"
            error={errors.identifier?.message}
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
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
            error={errors.password?.message}
          />
        )}
      />

      <TouchableOpacity onPress={() => push("/forgot-password")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, isSubmitting && styles.buttonDisabled]}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.85}
      >
        <Text style={styles.loginText}>
          {isSubmitting ? "Signing In..." : "LOGIN"}
        </Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.or}>OR</Text>
        <View style={styles.line} />
      </View>

      <GoogleSignInButton />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => push("/register")}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  forgot: {
    alignSelf: "flex-end",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },

  loginButton: {
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  loginText: {
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

  signup: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: theme.spacing.xs,
  },
});
