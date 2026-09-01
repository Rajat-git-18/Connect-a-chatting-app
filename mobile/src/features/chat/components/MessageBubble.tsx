import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import { formatRelativeTime } from "@/features/thread/utils/mapThreadDetail";
import type { ChatMessage } from "@/types/chat.types";

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
};

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const isPending = message.status === "pending";
  const isFailed = message.status === "failed";
  const isRead = isOwn && !!message.readAt && !isPending && !isFailed;
  const isDelivered = isOwn && !message.readAt && !isPending && !isFailed;

  return (
    <View style={[styles.wrap, isOwn ? styles.wrapOwn : styles.wrapOther]}>
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
          isPending && styles.bubblePending,
          isFailed && styles.bubbleFailed,
        ]}
      >
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
          {message.content}
        </Text>
      </View>
      <View style={[styles.metaRow, isOwn ? styles.metaRowOwn : styles.metaRowOther]}>
        {isPending ? (
          <Ionicons
            name="time-outline"
            size={12}
            color={theme.colors.textTertiary}
            style={styles.metaIcon}
          />
        ) : null}
        {isFailed ? (
          <Ionicons
            name="alert-circle-outline"
            size={12}
            color={theme.colors.error}
            style={styles.metaIcon}
          />
        ) : null}
        {isDelivered ? (
          <Ionicons
            name="checkmark"
            size={12}
            color={theme.colors.textTertiary}
            style={styles.metaIcon}
          />
        ) : null}
        {isRead ? (
          <Ionicons
            name="checkmark-done"
            size={12}
            color={theme.colors.primary}
            style={styles.metaIcon}
          />
        ) : null}
        <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
          {isFailed ? "Failed to send" : formatRelativeTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.sm,
    maxWidth: "82%",
  },

  wrapOwn: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },

  wrapOther: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  bubble: {
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  bubbleOwn: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.radius.sm,
  },

  bubbleOther: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: theme.radius.sm,
  },

  text: {
    ...theme.typography.body,
    lineHeight: 22,
  },

  textOwn: {
    color: theme.colors.white,
  },

  textOther: {
    color: theme.colors.text,
  },

  time: {
    ...theme.typography.caption,
    marginTop: 4,
  },

  timeOwn: {
    color: theme.colors.textTertiary,
    textAlign: "right",
  },

  timeOther: {
    color: theme.colors.textTertiary,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  metaRowOwn: {
    justifyContent: "flex-end",
  },

  metaRowOther: {
    justifyContent: "flex-start",
  },

  metaIcon: {
    marginRight: 4,
  },

  bubblePending: {
    opacity: 0.72,
  },

  bubbleFailed: {
    opacity: 0.85,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
});
