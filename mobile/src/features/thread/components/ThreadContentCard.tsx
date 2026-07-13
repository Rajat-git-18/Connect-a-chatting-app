import { View, Text, StyleSheet, Image } from "react-native";
import theme from "@/theme";
import type { ThreadDetail } from "../data/thread-detail.mock";

type ThreadContentCardProps = {
  thread: ThreadDetail;
};

export default function ThreadContentCard({ thread }: ThreadContentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.categoryChip}>
        <Text style={styles.categoryText}>{thread.category}</Text>
      </View>

      <Text style={styles.title}>{thread.title}</Text>

      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{thread.authorInitials}</Text>
        </View>
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{thread.authorName}</Text>
          <Text style={styles.time}>{thread.createdAtLabel}</Text>
        </View>
      </View>

      <Text style={styles.body}>{thread.body}</Text>

      {thread.imageUri ? (
        <Image source={{ uri: thread.imageUri }} style={styles.image} />
      ) : null}

      {thread.tags.length > 0 ? (
        <View style={styles.tags}>
          {thread.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
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
    ...theme.shadows.soft,
  },

  categoryChip: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },

  categoryText: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.2,
  },

  title: {
    ...theme.typography.h2,
    fontSize: 26,
    lineHeight: 34,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm + 2,
  },

  avatarText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.primary,
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
    marginTop: 2,
  },

  body: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 26,
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },

  tag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },

  tagText: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
