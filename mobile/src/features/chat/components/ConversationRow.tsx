import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "@/theme";
import { getInitials } from "@/utils/userDisplay";
import { formatRelativeTime } from "@/features/thread/utils/mapThreadDetail";
import type { ConversationListItem } from "@/types/chat.types";
import { useIsUserOnline } from "@/stores/chat.store";
import OnlineStatusDot from "./OnlineStatusDot";

type ConversationRowProps = {
  conversation: ConversationListItem;
  currentUserId?: string;
  onPress: (conversationId: string) => void;
};

export default function ConversationRow({
  conversation,
  currentUserId,
  onPress,
}: ConversationRowProps) {
  const { otherUser, lastMessage, unreadCount } = conversation;
  const isOtherUserOnline = useIsUserOnline(otherUser.id);
  const isOwnLastMessage = lastMessage?.senderId === currentUserId;
  const preview = lastMessage
    ? `${isOwnLastMessage ? "You: " : ""}${lastMessage.content}`
    : "Start the conversation";

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(conversation.id)}
      activeOpacity={0.85}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(otherUser.displayName)}</Text>
        <OnlineStatusDot
          isOnline={isOtherUserOnline}
          size={12}
          style={styles.presenceDot}
        />
        {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
      </View>

      <View style={styles.copy}>
        <View style={styles.topLine}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser.displayName}
          </Text>
          {lastMessage ? (
            <Text style={styles.time}>
              {formatRelativeTime(lastMessage.createdAt)}
            </Text>
          ) : null}
        </View>
        <Text
          style={[styles.preview, unreadCount > 0 && styles.previewUnread]}
          numberOfLines={1}
        >
          {preview}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.card,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  unreadDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },

  presenceDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  avatarText: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  copy: {
    flex: 1,
  },

  topLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },

  name: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },

  time: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },

  preview: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  previewUnread: {
    color: theme.colors.text,
    fontWeight: "600",
  },
});
