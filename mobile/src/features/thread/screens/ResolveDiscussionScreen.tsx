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
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import ResolveReplyCard from "../components/ResolveReplyCard";
import {
  getDefaultThreadDetail,
  getThreadDetail,
} from "../data/thread-detail.mock";

const SOLVER_NAME = "Rajat Gupta";

export default function ResolveDiscussionScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const thread = useMemo(
    () => (id ? getThreadDetail(id) : null) ?? getDefaultThreadDetail(),
    [id]
  );

  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedReply = thread.replies.find(
    (reply) => reply.id === selectedReplyId
  );

  const handleConfirm = async () => {
    if (!selectedReplyId || !selectedReply || submitting) return;

    setSubmitting(true);
    setConfirmed(true);

    // Brief elegant success beat — no system dialog.
    await new Promise((resolve) => setTimeout(resolve, 900));

    router.replace({
      pathname: "/(protected)/thread/[id]",
      params: {
        id: thread.id,
        resolved: "1",
        bestReplyId: selectedReplyId,
        solvedBy: SOLVER_NAME,
      },
    });
  };

  if (confirmed && selectedReply) {
    return (
      <View style={[styles.screen, styles.successScreen]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <Ionicons
              name="checkmark"
              size={32}
              color={theme.colors.white}
            />
          </View>
          <Text style={styles.successTitle}>Marked as Best Insight</Text>
          <Text style={styles.successSubtitle}>
            Open → Solved
          </Text>
          <Text style={styles.successMeta}>
            Solved by {SOLVER_NAME}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.topBar, { paddingTop: insets.top + theme.spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => goBack(`/(protected)/thread/${thread.id}`)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Resolve</Text>
        <View style={styles.backButtonSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Resolve Discussion</Text>
        <Text style={styles.subtitle}>
          Choose the reply that contributed the most to this discussion.
        </Text>

        <View style={styles.threadHint}>
          <Text style={styles.threadHintLabel}>Discussion</Text>
          <Text style={styles.threadHintTitle} numberOfLines={2}>
            {thread.title}
          </Text>
        </View>

        <View style={styles.list}>
          {thread.replies.map((reply) => (
            <ResolveReplyCard
              key={reply.id}
              reply={reply}
              selected={selectedReplyId === reply.id}
              onSelect={() => setSelectedReplyId(reply.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing.md) },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!selectedReplyId || submitting) && styles.primaryButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedReplyId || submitting}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Mark as Best Insight"
        >
          <Text style={styles.primaryButtonText}>Mark as Best Insight</Text>
        </TouchableOpacity>
      </View>
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

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },

  threadHint: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  threadHintLabel: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  threadHintTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
  },

  list: {
    gap: theme.spacing.md,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.float,
  },

  primaryButton: {
    height: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.soft,
  },

  primaryButtonDisabled: {
    opacity: 0.45,
  },

  primaryButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },

  successScreen: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  successCard: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing["3xl"],
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.soft,
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },

  successTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
  },

  successSubtitle: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: theme.spacing.sm,
  },

  successMeta: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
