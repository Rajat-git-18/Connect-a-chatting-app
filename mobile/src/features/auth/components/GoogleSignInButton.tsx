import { Text, TouchableOpacity, StyleSheet } from "react-native";

import theme from "@/theme";
import GoogleIcon from "./GoogleIcon";

type GoogleSignInButtonProps = {
  onPress?: () => void;
};

export default function GoogleSignInButton({ onPress }: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <GoogleIcon size={20} />
      <Text style={styles.label}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  label: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
});
