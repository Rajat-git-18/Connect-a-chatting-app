import { useEffect, useMemo, useState } from "react";
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
import {
  getDefaultThreadDetail,
  getThreadDetail,
  type ReplySort,
  type ThreadReactionKey,
  type ThreadReply,
  type ThreadStatus,
} from "../data/thread-detail.mock";

const SORT_OPTIONS: { key: ReplySort; label: string }[] = [
  { key: "most_helpful", label: "Most Helpful" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

function sortReplies(replies: ThreadReply[], sort: ReplySort): ThreadReply[] {
  const copy = [...replies];

  if (sort === "most_helpful") {
    return copy.sort((a, b) => b.helpful - a.helpful);
  }

  if (sort === "newest") {
    return copy;
  }

  return copy.reverse();
}

export default function ThreadDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id, resolved, bestReplyId, solvedBy } = useLocalSearchParams<{
    id?: string;
    resolved?: string;
    bestReplyId?: string;
    solvedBy?: string;
  }>();

  const thread = useMemo(
    () => (id ? getThreadDetail(id) : null) ?? getDefaultThreadDetail(),
    [id]
  );

  const [status, setStatus] = useState<ThreadStatus>(thread.status);
  const [activeBestReplyId, setActiveBestReplyId] = useState<string | null>(
    () => thread.replies.find((reply) => reply.isBest)?.id ?? null
  );
  const [solverName, setSolverName] = useState<string | null>(
    thread.status === "Solved" ? thread.authorName : null
  );

  const [sort, setSort] = useState<ReplySort>("most_helpful");
  const [selectedReaction, setSelectedReaction] =
    useState<ThreadReactionKey | null>(null);
  const [reactions, setReactions] = useState(thread.reactions);
  const [replyDraft, setReplyDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStatus(thread.status);
    setActiveBestReplyId(
      thread.replies.find((reply) => reply.isBest)?.id ?? null
    );
    setSolverName(thread.status === "Solved" ? thread.authorName : null);
    setReactions(thread.reactions);
  }, [thread]);

  useEffect(() => {
    if (resolved !== "1" || !bestReplyId) return;

    setStatus("Solved");
    setActiveBestReplyId(
      Array.isArray(bestReplyId) ? bestReplyId[0] : bestReplyId
    );
    setSolverName(
      Array.isArray(solvedBy) ? solvedBy[0] : solvedBy ?? "Rajat Gupta"
    );
  }, [resolved, bestReplyId, solvedBy]);

  const repliesWithBest = useMemo(() => {
    return thread.replies.map((reply) => ({
      ...reply,
      isBest: reply.id === activeBestReplyId,
    }));
  }, [thread.replies, activeBestReplyId]);

  const bestReply = repliesWithBest.find((reply) => reply.isBest);
  const discussionReplies = sortReplies(
    repliesWithBest.filter((reply) => !reply.isBest),
    sort
  );

  const canResolve = status === "Open" && thread.replies.length > 0;

  const handleReaction = (key: ThreadReactionKey) => {
    setReactions((prev) => {
      const next = { ...prev };

      if (selectedReaction === key) {
        next[key] = Math.max(0, next[key] - 1);
        setSelectedReaction(null);
        return next;
      }

      if (selectedReaction) {
        next[selectedReaction] = Math.max(0, next[selectedReaction] - 1);
      }

      next[key] += 1;
      setSelectedReaction(key);
      return next;
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${thread.title}\n\nJoin the discussion on Connect.`,
      });
    } catch {
      // cancelled
    }
  };

  const openResolve = () => {
    push({
      pathname: "/(protected)/resolve-discussion",
      params: { id: thread.id },
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
    if (!replyDraft.trim()) return;

    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setReplyDraft("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ThreadDetailHeader
          status={status}
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
          {status === "Solved" && solverName ? (
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

          <ThreadContentCard thread={{ ...thread, status }} />

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
            <ReactionBar
              reactions={reactions}
              selected={selectedReaction}
              onSelect={handleReaction}
            />
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
            {discussionReplies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </View>
        </ScrollView>

        {status !== "Closed" && status !== "Discarded" ? (
          <ReplyComposer
            value={replyDraft}
            onChangeText={setReplyDraft}
            onAttach={handleAttach}
            onSubmit={handleSubmitReply}
            paddingBottom={insets.bottom}
            submitting={submitting}
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
});
