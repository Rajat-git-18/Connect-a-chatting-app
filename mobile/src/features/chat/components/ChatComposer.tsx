import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type ChatComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isSending?: boolean;
};

export default function ChatComposer({
  value,
  onChangeText,
  onSend,
  disabled = false,
  isSending = false,
}: ChatComposerProps) {
  const canSend = value.trim().length > 0 && !disabled && !isSending;

  return (
    <View style={styles.bar}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        placeholderTextColor={theme.colors.textTertiary}
        style={styles.input}
        multiline
        maxLength={4000}
        editable={!disabled && !isSending}
      />
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        activeOpacity={0.85}
      >
        <Ionicons
          name="send"
          size={18}
          color={canSend ? theme.colors.white : theme.colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: Platform.OS === "ios" ? theme.spacing.md : theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    ...theme.typography.body,
    color: theme.colors.text,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
