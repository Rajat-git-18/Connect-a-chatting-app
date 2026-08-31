import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import theme from "@/theme";
import ThreadCard from "./ThreadCard";
import { Thread } from "@/types/thread.types";

type TrendingDiscussionsProps = {
  threads: Thread[];
  isLoading: boolean;
  onPressItem?: (id: string) => void;
  onPressAuthor?: (authorId: string) => void;
};

export default function TrendingDiscussions({
  threads = [],
  isLoading,
  onPressItem,
  onPressAuthor,
}: TrendingDiscussionsProps) {
  const items = Array.isArray(threads) ? threads : [];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Trending Discussions</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>
          No discussions found.
        </Text>
      ) : (
        <View style={styles.list}>
          {items.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onPress={onPressItem}
              onPressAuthor={onPressAuthor}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },

  heading: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  list: {
    gap: theme.spacing.sm,
  },

  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginVertical: theme.spacing.lg,
  },
});