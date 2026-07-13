import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type ReplyComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onAttach: () => void;
  onSubmit: () => void;
  paddingBottom: number;
  submitting?: boolean;
};

export default function ReplyComposer({
  value,
  onChangeText,
  onAttach,
  onSubmit,
  paddingBottom,
  submitting = false,
}: ReplyComposerProps) {
  const canSubmit = value.trim().length > 0 && !submitting;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(paddingBottom, 12) }]}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.attach}
          onPress={onAttach}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Attach image"
        >
          <Ionicons
            name="image-outline"
            size={22}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Continue the discussion..."
          placeholderTextColor={theme.colors.textTertiary}
          multiline
          maxLength={2000}
          returnKeyType="default"
        />

        <TouchableOpacity
          style={[styles.send, !canSubmit && styles.sendDisabled]}
          onPress={onSubmit}
          disabled={!canSubmit}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Post reply"
        >
          <Text style={styles.sendText}>
            {submitting ? "..." : "Reply"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.float,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },

  attach: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === "ios" ? 12 : 10,
    paddingBottom: Platform.OS === "ios" ? 12 : 10,
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },

  send: {
    height: 44,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  sendDisabled: {
    opacity: 0.45,
  },

  sendText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
