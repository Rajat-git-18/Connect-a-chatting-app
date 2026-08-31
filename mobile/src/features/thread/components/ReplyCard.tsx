import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import theme from "@/theme";
import type { ThreadReactionKey, ThreadReply } from "../data/thread-detail.mock";

const REACTION_OPTIONS: {
  key: ThreadReactionKey;
  emoji: string;
  label: string;
}[] = [
  { key: "helpful", emoji: "👍", label: "Helpful" },
  { key: "insightful", emoji: "💡", label: "Insightful" },
  { key: "appreciate", emoji: "❤️", label: "Appreciate" },
  { key: "agree", emoji: "👏", label: "Agree" },
];

type ReplyCardProps = {
  reply: ThreadReply;
  selectedReactions?: Partial<Record<ThreadReactionKey, boolean>>;
  pickerOpen?: boolean;
  onTogglePicker?: () => void;
  onSelectReaction?: (key: ThreadReactionKey) => void;
  reacting?: boolean;
};

export default function ReplyCard({
  reply,
  selectedReactions = {},
  pickerOpen = false,
  onTogglePicker,
  onSelectReaction,
  reacting = false,
}: ReplyCardProps) {
  const counts: Record<ThreadReactionKey, number> = {
    helpful: reply.helpful,
    insightful: reply.insightful,
    appreciate: reply.appreciate ?? 0,
    agree: reply.agree,
  };

  const visibleReactions = REACTION_OPTIONS.filter(
    (item) => counts[item.key] > 0 || selectedReactions[item.key]
  );

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
          {visibleReactions.length === 0 ? (
            <Text style={styles.noReactions}>No reactions yet</Text>
          ) : (
            visibleReactions.map((item) => {
              const active = Boolean(selectedReactions[item.key]);

              return (
                <View
                  key={item.key}
                  style={[styles.reactionPill, active && styles.reactionPillActive]}
                >
                  <Text
                    style={[
                      styles.reactionText,
                      active && styles.reactionTextActive,
                    ]}
                  >
                    {item.emoji} {counts[item.key]}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        <TouchableOpacity
          onPress={onTogglePicker}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="React to this reply"
        >
          <Text style={styles.replyLink}>
            {pickerOpen ? "Close" : "Reply"}
          </Text>
        </TouchableOpacity>
      </View>

      {pickerOpen ? (
        <View style={styles.picker}>
          <Text style={styles.pickerLabel}>React with</Text>
          <View style={styles.pickerRow}>
            {REACTION_OPTIONS.map((item) => {
              const active = Boolean(selectedReactions[item.key]);

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.pickerChip, active && styles.pickerChipActive]}
                  onPress={() => onSelectReaction?.(item.key)}
                  disabled={reacting}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active, disabled: reacting }}
                  accessibilityLabel={item.label}
                >
                  <Text style={styles.pickerEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.pickerChipText,
                      active && styles.pickerChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
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

  noReactions: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },

  reactionPill: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  reactionPillActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  reactionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  reactionTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },

  replyLink: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },

  picker: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  pickerLabel: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  pickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  pickerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  pickerChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  pickerEmoji: {
    fontSize: 14,
  },

  pickerChipText: {
    ...theme.typography.caption,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },

  pickerChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
});
