import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack, push } from "@/utils/navigation";
import DiscussionListCard from "../components/DiscussionListCard";
import {
  MY_DISCUSSIONS,
  filterDiscussions,
  getDiscussionSummary,
  type DiscussionFilter,
} from "../data/my-discussions.mock";

const FILTERS: DiscussionFilter[] = [
  "All",
  "Open",
  "Solved",
  "Closed",
  "Discarded",
];

export default function MyDiscussionsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<DiscussionFilter>("All");

  const summary = useMemo(
    () => getDiscussionSummary(MY_DISCUSSIONS),
    []
  );

  const items = useMemo(
    () => filterDiscussions(MY_DISCUSSIONS, filter),
    [filter]
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.topBar, { paddingTop: insets.top + theme.spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBack("/(protected)/home")}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>My Discussions</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>My Discussions</Text>
        <Text style={styles.subheading}>
          A calm overview of conversations you’ve started.
        </Text>

        <View style={styles.summaryGrid}>
          <SummaryCard label="Open" value={summary.open} accent />
          <SummaryCard label="Solved" value={summary.solved} />
          <SummaryCard label="Closed" value={summary.closed} />
          <SummaryCard label="Total Replies" value={summary.totalReplies} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentRow}
          style={styles.segmentScroll}
        >
          {FILTERS.map((option) => {
            const active = filter === option;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => setFilter(option)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    active && styles.segmentTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.list}>
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No discussions here</Text>
              <Text style={styles.emptySubtitle}>
                Start a new conversation to fill this space.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <DiscussionListCard
                key={item.id}
                item={item}
                onPress={() => push(`/(protected)/thread/${item.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + theme.spacing.lg }]}
        onPress={() => push("/(protected)/create-thread")}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Start Discussion"
      >
        <Ionicons name="add" size={22} color={theme.colors.white} />
        <Text style={styles.fabText}>Start Discussion</Text>
      </TouchableOpacity>
    </View>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <View style={[styles.summaryCard, accent && styles.summaryCardAccent]}>
      <Text style={[styles.summaryValue, accent && styles.summaryValueAccent]}>
        {value}
      </Text>
      <Text style={[styles.summaryLabel, accent && styles.summaryLabelAccent]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  flex: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonSpacer: {
    width: 40,
  },

  topBarTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  heading: {
    ...theme.typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.text,
  },

  subheading: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },

  summaryCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.card,
  },

  summaryCardAccent: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  summaryValue: {
    ...theme.typography.h2,
    fontSize: 26,
    lineHeight: 32,
    color: theme.colors.text,
  },

  summaryValueAccent: {
    color: theme.colors.primary,
  },

  summaryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginTop: 4,
  },

  summaryLabelAccent: {
    color: theme.colors.primary,
  },

  segmentScroll: {
    marginBottom: theme.spacing.lg,
    marginHorizontal: -theme.spacing.lg,
  },

  segmentRow: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  segment: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  segmentActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  segmentText: {
    ...theme.typography.bodySmall,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },

  segmentTextActive: {
    color: theme.colors.white,
    fontWeight: "700",
  },

  list: {
    gap: theme.spacing.md,
  },

  empty: {
    paddingVertical: theme.spacing["3xl"],
    alignItems: "center",
  },

  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  emptySubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },

  fab: {
    position: "absolute",
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 52,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.float,
  },

  fabText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },
});
