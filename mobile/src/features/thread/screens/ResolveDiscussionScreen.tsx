import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import ResolveReplyCard from "../components/ResolveReplyCard";
import { useThread } from "@/hooks/thread/useThread";
import { useResolveThread } from "@/hooks/thread/useResolveThread";
import { mapApiThreadToUi } from "../utils/mapThreadDetail";

export default function ResolveDiscussionScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const threadId = Array.isArray(id) ? id[0] : id;

  const {
    data: apiThread,
    isLoading,
    isError,
    refetch,
  } = useThread(threadId ?? "");

  const { mutateAsync: resolve, isPending } = useResolveThread(threadId ?? "");

  const thread = useMemo(
    () => (apiThread ? mapApiThreadToUi(apiThread) : null),
    [apiThread]
  );

  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedReply = thread?.replies.find(
    (reply) => reply.id === selectedReplyId
  );

  const handleConfirm = async () => {
    if (!threadId || !selectedReplyId || !selectedReply || isPending) return;

    try {
      await resolve(selectedReplyId);
      setConfirmed(true);

      await new Promise((resolveDelay) => setTimeout(resolveDelay, 900));

      router.replace({
        pathname: "/(protected)/thread/[id]",
        params: {
          id: threadId,
        },
      });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to resolve discussion.";

      Alert.alert("Error", message);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !thread) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Couldn't load replies</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={styles.successSubtitle}>Open → Solved</Text>
          <Text style={styles.successMeta}>
            Solved by {selectedReply.authorName}
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
            (!selectedReplyId || isPending) && styles.primaryButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedReplyId || isPending}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Mark as Best Insight"
        >
          <Text style={styles.primaryButtonText}>
            {isPending ? "Saving..." : "Mark as Best Insight"}
          </Text>
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

  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
  },

  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
  },

  retryText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
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
    fontWeight: "700",
    color: theme.colors.text,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  heading: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
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
    letterSpacing: 0.3,
  },

  threadHintTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 4,
  },

  list: {
    gap: theme.spacing.md,
  },

  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.md + 2,
    alignItems: "center",
  },

  primaryButtonDisabled: {
    opacity: 0.45,
  },

  primaryButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
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
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing["2xl"],
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.soft,
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: "#059669",
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
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },

  successMeta: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: "#059669",
    marginTop: theme.spacing.md,
  },
});
