import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Thread } from "@/types/thread.types";
import theme from "@/theme";

type ThreadCardProps = {
  thread: Thread;
  onPress?: (id: string) => void;
  onPressAuthor?: (authorId: string) => void;
};

export default function ThreadCard({
  thread,
  onPress,
  onPressAuthor,
}: ThreadCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => onPress?.(thread.id)}
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onPressAuthor?.(thread.author.id)}
          activeOpacity={0.85}
          disabled={!onPressAuthor}
        >
          <Text style={styles.displayName}>
            {thread.author.displayName}
          </Text>

          <Text style={styles.username}>
            @{thread.author.username}
          </Text>
        </TouchableOpacity>

        <View style={styles.statusBadge}>
          <Text style={styles.status}>
            {thread.status}
          </Text>
        </View>
      </View>

      {/* Title */}

      <Text style={styles.title}>
        {thread.title}
      </Text>

      {/* Discussion */}

      <Text
        style={styles.discussion}
        numberOfLines={2}
      >
        {thread.discussion}
      </Text>

      {/* Tags */}

      <View style={styles.tagsContainer}>
        {thread.tags.map((item) => (
          <View
            key={item.tag.id}
            style={styles.tag}
          >
            <Text style={styles.tagText}>
              #{item.tag.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {thread.category}
        </Text>

        <Text style={styles.footerText}>
          💬 {thread._count.replies}
        </Text>

        <Text style={styles.footerText}>
          ❤️ {thread._count.reactions}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  displayName: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.text,
  },

  username: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  statusBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },

  title: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },

  discussion: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.md,
  },

  tag: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.md,
  },

  footerText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});