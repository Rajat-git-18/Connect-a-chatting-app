import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import type { MyDiscussion } from "../data/my-discussions.mock";
import type { ThreadStatus } from "@/features/thread/data/thread-detail.mock";

const STATUS_STYLES: Record<
  ThreadStatus,
  { bg: string; border: string; text: string }
> = {
  Open: {
    bg: theme.colors.primarySoft,
    border: theme.colors.primaryLight,
    text: theme.colors.primary,
  },
  Solved: {
    bg: "#ECFDF5",
    border: "#A7F3D0",
    text: "#059669",
  },
  Closed: {
    bg: theme.colors.surface,
    border: theme.colors.border,
    text: theme.colors.textSecondary,
  },
  Discarded: {
    bg: "#FEF2F2",
    border: "#FECACA",
    text: "#B91C1C",
  },
};

type DiscussionListCardProps = {
  item: MyDiscussion;
  onPress: () => void;
};

export default function DiscussionListCard({
  item,
  onPress,
}: DiscussionListCardProps) {
  const statusStyle = STATUS_STYLES[item.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.status}`}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.border,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>
            {item.status}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textTertiary}
        />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      <Text style={styles.category}>{item.category}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {item.replyCount} {item.replyCount === 1 ? "reply" : "replies"}
        </Text>
        <View style={styles.dot} />
        <Text style={styles.meta}>{item.reactionCount} reactions</Text>
        <View style={styles.dot} />
        <Text style={styles.meta}>{item.createdAtLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm + 2,
  },

  badge: {
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    borderWidth: 1,
  },

  badgeText: {
    ...theme.typography.caption,
    fontWeight: "700",
  },

  title: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
    lineHeight: 22,
  },

  category: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: theme.spacing.sm,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing.sm + 2,
  },

  meta: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.textTertiary,
    marginHorizontal: 8,
  },
});
