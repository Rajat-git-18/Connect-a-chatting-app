import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
} from "react-native";

import theme from "@/theme";

interface AuthInputProps extends TextInputProps {
  error?: string;
}

export default function AuthInput({
  error,
  style,
  ...props
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
      />

      {error ? (
        <Text style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,

    paddingHorizontal: theme.spacing.md,

    color: theme.colors.text,
  },

  inputError: {
    borderColor: theme.colors.error,
  },

  errorText: {
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    fontSize: 12,
  },
});