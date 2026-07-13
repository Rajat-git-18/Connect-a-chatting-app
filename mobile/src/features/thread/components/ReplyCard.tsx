import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import theme from "@/theme";
import type { ThreadReply } from "../data/thread-detail.mock";

type ReplyCardProps = {
  reply: ThreadReply;
  onReply?: () => void;
};

export default function ReplyCard({ reply, onReply }: ReplyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{reply.authorInitials}</Text>
        </View>
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{reply.authorName}</Text>
          <Text style={styles.time}>{reply.createdAtLabel}</Text>
        </View>
      </View>

      <Text style={styles.body}>{reply.body}</Text>

      {reply.imageUri ? (
        <Image source={{ uri: reply.imageUri }} style={styles.image} />
      ) : null}

      <View style={styles.actions}>
        <View style={styles.reactions}>
          <View style={styles.reactionPill}>
            <Text style={styles.reactionText}>👍 {reply.helpful}</Text>
          </View>
          <View style={styles.reactionPill}>
            <Text style={styles.reactionText}>💡 {reply.insightful}</Text>
          </View>
          <View style={styles.reactionPill}>
            <Text style={styles.reactionText}>👏 {reply.agree}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onReply}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Reply to this discussion"
        >
          <Text style={styles.replyLink}>Reply</Text>
        </TouchableOpacity>
      </View>
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
    ...theme.shadows.card,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  avatarText: {
    ...theme.typography.caption,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },

  authorMeta: {
    flex: 1,
  },

  authorName: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
  },

  time: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 1,
  },

  body: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },

  image: {
    width: "100%",
    height: 160,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  reactions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    flex: 1,
  },

  reactionPill: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  reactionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  replyLink: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});
