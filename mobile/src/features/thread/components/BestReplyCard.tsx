import { View, Text, StyleSheet } from "react-native";
import theme from "@/theme";
import type { ThreadReply } from "../data/thread-detail.mock";

type BestReplyCardProps = {
  reply: ThreadReply;
};

export default function BestReplyCard({ reply }: BestReplyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <Text style={styles.badgeEmoji}>⭐</Text>
        <Text style={styles.badgeText}>Best Insight</Text>
      </View>

      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{reply.authorInitials}</Text>
        </View>
        <View>
          <Text style={styles.authorName}>{reply.authorName}</Text>
          <Text style={styles.time}>{reply.createdAtLabel}</Text>
        </View>
      </View>

      <Text style={styles.body}>{reply.body}</Text>

      <Text style={styles.helpful}>👍 {reply.helpful} found this helpful</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: theme.spacing.md,
  },

  badgeEmoji: {
    fontSize: 14,
  },

  badgeText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 0.2,
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
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },

  avatarText: {
    ...theme.typography.caption,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  authorName: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
  },

  time: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },

  body: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },

  helpful: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: theme.spacing.md,
  },
});
