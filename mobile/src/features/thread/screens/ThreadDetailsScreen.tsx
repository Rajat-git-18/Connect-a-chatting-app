import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
  Share,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack, push } from "@/utils/navigation";
import ThreadDetailHeader from "../components/ThreadDetailHeader";
import ThreadContentCard from "../components/ThreadContentCard";
import ReactionBar from "../components/ReactionBar";
import BestReplyCard from "../components/BestReplyCard";
import ReplyCard from "../components/ReplyCard";
import ReplyComposer from "../components/ReplyComposer";
import { useThread } from "@/hooks/thread/useThread";
import { useCreateReply } from "@/hooks/thread/useCreateReply";
import { useReactToReply } from "@/hooks/thread/useReactToReply";
import { getUserIdFromToken } from "@/services/auth/auth.service";
import type { ReplySort, ThreadReactionKey } from "../data/thread-detail.mock";
import {
  API_TO_UI_REACTION,
  mapApiThreadToUi,
  sortReplies,
  UI_TO_API_REACTION,
} from "../utils/mapThreadDetail";

const SORT_OPTIONS: { key: ReplySort; label: string }[] = [
  { key: "most_helpful", label: "Most Helpful" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

type ReplyReactionState = {
  counts: Record<ThreadReactionKey, number>;
  selected: Partial<Record<ThreadReactionKey, boolean>>;
};

export default function ThreadDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const threadId = Array.isArray(id) ? id[0] : id;

  const {
    data: apiThread,
    isLoading,
    isError,
    refetch,
  } = useThread(threadId ?? "");

  const { mutateAsync: submitReply, isPending: isReplying } = useCreateReply(
    threadId ?? ""
  );
  const { mutateAsync: reactToReply } = useReactToReply(threadId ?? "");

  const [sort, setSort] = useState<ReplySort>("most_helpful");
  const [userId, setUserId] = useState<string | null>(null);
  const [pickerReplyId, setPickerReplyId] = useState<string | null>(null);
  const [replyReactions, setReplyReactions] = useState<
    Record<string, ReplyReactionState>
  >({});
  const [replyDraft, setReplyDraft] = useState("");

  // Tracks in-flight reaction toggles per `${replyId}:${key}` so a rapid
  // second tap on the same emoji can't fire an out-of-order request.
  const inFlightReactions = useRef<Set<string>>(new Set());

  const thread = useMemo(
    () => (apiThread ? mapApiThreadToUi(apiThread) : null),
    [apiThread]
  );

  useEffect(() => {
    getUserIdFromToken().then(setUserId);
  }, []);

  // Sync per-reply reaction counts + current user's selections from API.
  useEffect(() => {
    if (!apiThread) return;

    const next: Record<string, ReplyReactionState> = {};

    for (const reply of apiThread.replies ?? []) {
      const selected: Partial<Record<ThreadReactionKey, boolean>> = {};

      if (userId) {
        for (const reaction of reply.reactions ?? []) {
          if (reaction.userId === userId) {
            selected[API_TO_UI_REACTION[reaction.type]] = true;
          }
        }
      }

      next[reply.id] = {
        selected,
        counts: {
          helpful: (reply.reactions ?? []).filter((r) => r.type === "HELPFUL")
            .length,
          insightful: (reply.reactions ?? []).filter(
            (r) => r.type === "INSIGHTFUL"
          ).length,
          appreciate: (reply.reactions ?? []).filter((r) => r.type === "LIKE")
            .length,
          agree: (reply.reactions ?? []).filter((r) => r.type === "AGREE")
            .length,
        },
      };
    }

    setReplyReactions(next);
  }, [apiThread, userId]);

  const repliesWithBest = useMemo(() => {
    if (!thread) return [];

    return thread.replies.map((reply) => {
      const local = replyReactions[reply.id];

      return {
        ...reply,
        isBest: Boolean(reply.isBest),
        helpful: local?.counts.helpful ?? reply.helpful,
        insightful: local?.counts.insightful ?? reply.insightful,
        appreciate: local?.counts.appreciate ?? reply.appreciate,
        agree: local?.counts.agree ?? reply.agree,
      };
    });
  }, [thread, replyReactions]);

  const bestReply = repliesWithBest.find((reply) => reply.isBest);
  const discussionReplies = sortReplies(
    repliesWithBest.filter((reply) => !reply.isBest),
    sort
  );

  const canResolve =
    thread?.status === "Open" && (thread.replies?.length ?? 0) > 0;

  // Live totals for the display-only Reactions card.
  const reactionTotals = useMemo(() => {
    const totals: Record<ThreadReactionKey, number> = {
      helpful: 0,
      insightful: 0,
      appreciate: 0,
      agree: 0,
    };

    for (const reaction of apiThread?.reactions ?? []) {
      totals[API_TO_UI_REACTION[reaction.type]] += 1;
    }

    for (const state of Object.values(replyReactions)) {
      totals.helpful += state.counts.helpful;
      totals.insightful += state.counts.insightful;
      totals.appreciate += state.counts.appreciate;
      totals.agree += state.counts.agree;
    }

    return totals;
  }, [apiThread?.reactions, replyReactions]);

  const handleReplyReaction = async (
    replyId: string,
    key: ThreadReactionKey
  ) => {
    if (!threadId) return;

    const flightKey = `${replyId}:${key}`;

    // Ignore a repeat tap on the same emoji while its request is in flight.
    if (inFlightReactions.current.has(flightKey)) return;
    inFlightReactions.current.add(flightKey);

    // Read the freshest state via a functional updater so back-to-back taps
    // on different emojis stay consistent, then compute the toggle from it.
    let wasSelected = false;

    setReplyReactions((prev) => {
      const current = prev[replyId] ?? {
        counts: { helpful: 0, insightful: 0, appreciate: 0, agree: 0 },
        selected: {},
      };

      wasSelected = Boolean(current.selected[key]);

      return {
        ...prev,
        [replyId]: {
          selected: { ...current.selected, [key]: !wasSelected },
          counts: {
            ...current.counts,
            [key]: Math.max(0, current.counts[key] + (wasSelected ? -1 : 1)),
          },
        },
      };
    });

    try {
      await reactToReply({
        replyId,
        type: UI_TO_API_REACTION[key],
      });
    } catch {
      // Roll back exactly the change we made.
      setReplyReactions((prev) => {
        const current = prev[replyId];
        if (!current) return prev;

        return {
          ...prev,
          [replyId]: {
            selected: { ...current.selected, [key]: wasSelected },
            counts: {
              ...current.counts,
              [key]: Math.max(0, current.counts[key] + (wasSelected ? 1 : -1)),
            },
          },
        };
      });
      Alert.alert("Error", "Could not update reaction. Please try again.");
    } finally {
      inFlightReactions.current.delete(flightKey);
    }
  };

  const handleShare = async () => {
    if (!thread) return;

    try {
      await Share.share({
        message: `${thread.title}\n\nJoin the discussion on Connect.`,
      });
    } catch {
      // cancelled
    }
  };

  const openResolve = () => {
    if (!threadId) return;

    push({
      pathname: "/(protected)/resolve-discussion",
      params: { id: threadId },
    });
  };

  const handleAttach = async () => {
    const ImagePicker = await import("expo-image-picker");
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photos needed",
        "Allow photo access to attach an image to your reply."
      );
      return;
    }

    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
    });
  };

  const handleSubmitReply = async () => {
    Keyboard.dismiss();
    if (!threadId || !replyDraft.trim() || isReplying) return;

    try {
      await submitReply(replyDraft.trim());
      setReplyDraft("");
    } catch {
      Alert.alert("Error", "Failed to post reply. Please try again.");
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
        <Text style={styles.errorTitle}>Couldn't load discussion</Text>
        <Text style={styles.errorSubtitle}>
          Check your connection and try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => goBack("/(protected)/home")}
          activeOpacity={0.85}
        >
          <Text style={styles.backLink}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const solverName =
    thread.status === "Solved"
      ? bestReply?.authorName ?? thread.authorName
      : null;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ThreadDetailHeader
          status={thread.status}
          onBack={() => goBack("/(protected)/home")}
          onShare={handleShare}
          onResolve={openResolve}
          canResolve={canResolve}
          paddingTop={insets.top + theme.spacing.sm}
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: theme.spacing["3xl"] },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {thread.status === "Solved" && solverName ? (
            <View style={styles.solvedBanner}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#059669"
              />
              <Text style={styles.solvedBannerText}>
                Solved by {solverName}
              </Text>
            </View>
          ) : null}

          <ThreadContentCard thread={thread} />

          {canResolve ? (
            <TouchableOpacity
              style={styles.resolveCard}
              onPress={openResolve}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Resolve discussion"
            >
              <View style={styles.resolveIcon}>
                <Ionicons
                  name="ribbon-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.resolveCopy}>
                <Text style={styles.resolveTitle}>Resolve Discussion</Text>
                <Text style={styles.resolveSubtitle}>
                  Choose the Best Insight and mark this thread Solved.
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          ) : null}

          <View style={styles.section}>
            <ReactionBar reactions={reactionTotals} />
          </View>

          <View style={styles.section}>
            <View style={styles.repliesHeader}>
              <View>
                <Text style={styles.sectionTitle}>Discussion</Text>
                <Text style={styles.sectionMeta}>
                  {thread.replies.length}{" "}
                  {thread.replies.length === 1 ? "reply" : "replies"}
                </Text>
              </View>
            </View>

            <View style={styles.sortRow}>
              <Text style={styles.sortLabel}>Sort by</Text>
              <View style={styles.sortChips}>
                {SORT_OPTIONS.map((option) => {
                  const active = sort === option.key;

                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[styles.sortChip, active && styles.sortChipActive]}
                      onPress={() => setSort(option.key)}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.sortChipText,
                          active && styles.sortChipTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {bestReply ? (
            <View style={styles.section}>
              <BestReplyCard reply={bestReply} />
            </View>
          ) : null}

          <View style={styles.replyList}>
            {discussionReplies.length === 0 && !bestReply ? (
              <Text style={styles.emptyReplies}>
                No replies yet. Be the first to join the discussion.
              </Text>
            ) : (
              discussionReplies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  selectedReactions={replyReactions[reply.id]?.selected}
                  pickerOpen={pickerReplyId === reply.id}
                  onTogglePicker={() =>
                    setPickerReplyId((current) =>
                      current === reply.id ? null : reply.id
                    )
                  }
                  onSelectReaction={(key) =>
                    handleReplyReaction(reply.id, key)
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        {thread.status !== "Closed" && thread.status !== "Discarded" ? (
          <ReplyComposer
            value={replyDraft}
            onChangeText={setReplyDraft}
            onAttach={handleAttach}
            onSubmit={handleSubmitReply}
            paddingBottom={insets.bottom}
            submitting={isReplying}
          />
        ) : null}
      </KeyboardAvoidingView>
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

  errorSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
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

  backLink: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  solvedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    marginBottom: theme.spacing.md,
  },

  solvedBannerText: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: "#059669",
  },

  resolveCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
  },

  resolveIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  resolveCopy: {
    flex: 1,
  },

  resolveTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  resolveSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  section: {
    marginTop: theme.spacing.lg,
  },

  repliesHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  sectionMeta: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  sortRow: {
    gap: theme.spacing.sm,
  },

  sortLabel: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.textTertiary,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  sortChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  sortChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  sortChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  sortChipText: {
    ...theme.typography.caption,
    fontWeight: "500",
    color: theme.colors.textSecondary,
  },

  sortChipTextActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },

  replyList: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  emptyReplies: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingVertical: theme.spacing.xl,
  },
});
