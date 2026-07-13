import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "@/theme";

const TRENDING = [
  {
    id: "1",
    title: "Building in public: what actually works?",
    meta: "128 replies · Community",
  },
  {
    id: "2",
    title: "Best ways to grow a close-knit network",
    meta: "86 replies · Career",
  },
  {
    id: "3",
    title: "Design systems that feel human",
    meta: "54 replies · Design",
  },
];

type TrendingDiscussionsProps = {
  onPressItem?: (id: string) => void;
};

export default function TrendingDiscussions({
  onPressItem,
}: TrendingDiscussionsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Trending Discussions</Text>

      <View style={styles.list}>
        {TRENDING.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onPressItem?.(item.id)}
          >
            <View style={styles.accent} />
            <View style={styles.copy}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.meta}>{item.meta}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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

  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadows.card,
  },

  accent: {
    width: 4,
    backgroundColor: theme.colors.primary,
  },

  copy: {
    flex: 1,
    padding: theme.spacing.md,
  },

  title: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
  },

  meta: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
