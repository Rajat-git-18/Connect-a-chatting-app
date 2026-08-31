import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import { getInitials } from "@/utils/userDisplay";
import { formatRelativeTime } from "@/features/thread/utils/mapThreadDetail";
import type { ConnectionRequestItem } from "@/types/connection.types";

type ConnectionRequestCardProps = {
  request: ConnectionRequestItem;
  variant: "incoming" | "outgoing";
  onPressUser: (userId: string) => void;
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  isProcessing?: boolean;
};

export default function ConnectionRequestCard({
  request,
  variant,
  onPressUser,
  onAccept,
  onReject,
  onCancel,
  isProcessing = false,
}: ConnectionRequestCardProps) {
  const person =
    variant === "incoming" ? request.sender : request.receiver;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.userRow}
        onPress={() => onPressUser(person.id)}
        activeOpacity={0.85}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(person.displayName)}</Text>
        </View>
        <View style={styles.userCopy}>
          <Text style={styles.name}>{person.displayName}</Text>
          <Text style={styles.handle}>@{person.username}</Text>
          <Text style={styles.time}>{formatRelativeTime(request.createdAt)}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textTertiary}
        />
      </TouchableOpacity>

      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>Question</Text>
        <Text style={styles.questionText}>{request.question.question}</Text>
      </View>

      <View style={styles.answerBox}>
        <Text style={styles.answerLabel}>
          {variant === "incoming" ? "Their answer" : "Your answer"}
        </Text>
        <Text style={styles.answerText}>{request.answer}</Text>
      </View>

      {variant === "incoming" ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.rejectButton, isProcessing && styles.buttonDisabled]}
            onPress={onReject}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            <Text style={styles.rejectText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, isProcessing && styles.buttonDisabled]}
            onPress={onAccept}
            disabled={isProcessing}
            activeOpacity={0.85}
          >
            {isProcessing ? (
              <ActivityIndicator color={theme.colors.white} size="small" />
            ) : (
              <Text style={styles.acceptText}>Accept</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.cancelButton, isProcessing && styles.buttonDisabled]}
          onPress={onCancel}
          disabled={isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.error} size="small" />
          ) : (
            <>
              <Ionicons
                name="close-circle-outline"
                size={16}
                color={theme.colors.error}
              />
              <Text style={styles.cancelText}>Cancel Request</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  userCopy: {
    flex: 1,
  },

  name: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.text,
  },

  handle: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },

  time: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 4,
  },

  questionBox: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  questionLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  questionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    lineHeight: 20,
  },

  answerBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  answerLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },

  answerText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },

  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },

  rejectButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  rejectText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },

  acceptButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  acceptText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },

  cancelText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.error,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});
