import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import type { ThreadReply } from "../data/thread-detail.mock";

type ResolveReplyCardProps = {
  reply: ThreadReply;
  selected: boolean;
  onSelect: () => void;
};

export default function ResolveReplyCard({
  reply,
  selected,
  onSelect,
}: ResolveReplyCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Select reply by ${reply.authorName}`}
    >
      <View style={styles.topRow}>
        <View style={styles.authorRow}>
          <View style={[styles.avatar, selected && styles.avatarSelected]}>
            <Text
              style={[styles.avatarText, selected && styles.avatarTextSelected]}
            >
              {reply.authorInitials}
            </Text>
          </View>
          <Text style={styles.authorName}>{reply.authorName}</Text>
        </View>

        <View style={[styles.check, selected && styles.checkSelected]}>
          {selected ? (
            <Ionicons name="checkmark" size={16} color={theme.colors.white} />
          ) : null}
        </View>
      </View>

      <Text style={styles.body}>{reply.body}</Text>

      <View style={styles.counts}>
        <View style={styles.countPill}>
          <Text style={styles.countText}>👍 {reply.helpful} Helpful</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>💡 {reply.insightful} Insightful</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    ...theme.shadows.card,
  },

  cardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
    ...theme.shadows.soft,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm + 2,
  },

  avatarSelected: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primaryLight,
  },

  avatarText: {
    ...theme.typography.caption,
    fontWeight: "700",
    color: theme.colors.textSecondary,
  },

  avatarTextSelected: {
    color: theme.colors.primary,
  },

  authorName: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
    flexShrink: 1,
  },

  check: {
    width: 26,
    height: 26,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  checkSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  body: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },

  counts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

  countPill: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  countText: {
    ...theme.typography.caption,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },
});
