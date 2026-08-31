import { View, Text, StyleSheet } from "react-native";
import theme from "@/theme";
import type { ThreadReactionKey } from "../data/thread-detail.mock";

const REACTIONS: {
  key: ThreadReactionKey;
  emoji: string;
  label: string;
}[] = [
  { key: "helpful", emoji: "👍", label: "Helpful" },
  { key: "insightful", emoji: "💡", label: "Insightful" },
  { key: "appreciate", emoji: "❤️", label: "Appreciate" },
  { key: "agree", emoji: "👏", label: "Agree" },
];

type ReactionBarProps = {
  reactions: Record<ThreadReactionKey, number>;
};

/** Display-only summary of reaction totals for the thread. */
export default function ReactionBar({ reactions }: ReactionBarProps) {
  const total = Object.values(reactions).reduce((sum, n) => sum + n, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.heading}>Reactions</Text>
        <Text style={styles.total}>{total} total</Text>
      </View>

      <View style={styles.row}>
        {REACTIONS.map((item) => {
          const count = reactions[item.key] ?? 0;

          return (
            <View key={item.key} style={styles.chip}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.count}>{count}</Text>
            </View>
          );
        })}
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
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },

  heading: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
  },

  total: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  chip: {
    flexGrow: 1,
    flexBasis: "45%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.sm + 2,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  emoji: {
    fontSize: 14,
  },

  label: {
    ...theme.typography.caption,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    flex: 1,
  },

  count: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.textTertiary,
  },
});
