import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import type { ThreadStatus } from "../data/thread-detail.mock";

type ThreadDetailHeaderProps = {
  status: ThreadStatus;
  onBack: () => void;
  onShare: () => void;
  onResolve?: () => void;
  canResolve?: boolean;
  paddingTop: number;
};

export default function ThreadDetailHeader({
  status,
  onBack,
  onShare,
  onResolve,
  canResolve = false,
  paddingTop,
}: ThreadDetailHeaderProps) {
  const isSolved = status === "Solved";

  return (
    <View style={[styles.bar, { paddingTop }]}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onBack}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={[styles.badge, isSolved && styles.badgeSolved]}>
        <View style={[styles.badgeDot, isSolved && styles.badgeDotSolved]} />
        <Text style={[styles.badgeText, isSolved && styles.badgeTextSolved]}>
          {status}
        </Text>
      </View>

      <View style={styles.actions}>
        {canResolve ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onResolve}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Resolve discussion"
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onShare}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Share thread"
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },

  badgeSolved: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },

  badgeDotSolved: {
    backgroundColor: "#059669",
  },

  badgeText: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.primary,
  },

  badgeTextSolved: {
    color: "#059669",
  },
});
