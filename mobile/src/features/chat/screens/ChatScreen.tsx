import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import { useProfile } from "@/hooks/profile/useProfile";
import { useConversation } from "@/hooks/chat/useConversation";
import { useMessages } from "@/hooks/chat/useMessages";
import { useSendMessage } from "@/hooks/chat/useSendMessage";
import { useMarkConversationRead } from "@/hooks/chat/useMarkConversationRead";
import { useConnectionStatus } from "@/hooks/connections/useConnectionStatus";
import { useChatUiStore, useIsOtherUserTyping, useIsUserOnline } from "@/stores/chat.store";
import OnlineStatusDot from "../components/OnlineStatusDot";
import { useTypingEmitter, stopTyping } from "@/hooks/chat/useTypingEmitter";
import MessageBubble from "../components/MessageBubble";
import ChatComposer from "../components/ChatComposer";
import TypingIndicator from "../components/TypingIndicator";
import type { ChatMessage } from "@/types/chat.types";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = typeof id === "string" ? id : "";

  const { data: profile } = useProfile();
  const { data: conversation, isLoading: isConversationLoading } =
    useConversation(conversationId);
  const { data: connectionStatus, isLoading: isConnectionLoading } =
    useConnectionStatus(conversation?.otherUser.id ?? "");
  const canSendMessages =
    isConnectionLoading || connectionStatus?.status === "CONNECTED";
  const showReadOnlyBanner =
    !isConnectionLoading && connectionStatus?.status !== "CONNECTED";
  const {
    data,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);
  const { mutate: sendMessage } = useSendMessage(conversationId);
  const { mutate: markRead } = useMarkConversationRead(conversationId);
  const setActiveConversationId = useChatUiStore(
    (state) => state.setActiveConversationId
  );
  const isOtherUserTyping = useIsOtherUserTyping(conversationId);
  const isOtherUserOnline = useIsUserOnline(conversation?.otherUser.id);
  const [draft, setDraft] = useState("");

  useTypingEmitter(conversationId, canSendMessages ? draft : "");

  useEffect(() => {
    if (!conversationId) return;
    setActiveConversationId(conversationId);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  const messages = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page) => page.messages);
  }, [data]);

  useEffect(() => {
    if (!conversationId) return;
    markRead();
  }, [conversationId, markRead]);

  const handleSend = () => {
    const content = draft.trim();
    if (!content) return;

    stopTyping(conversationId);
    setDraft("");
    sendMessage(
      { content },
      {
        onError: () => {
          setDraft(content);
        },
      }
    );
  };

  const handleLoadOlder = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <MessageBubble
        message={item}
        isOwn={item.senderId === profile?.id}
      />
    ),
    [profile?.id]
  );

  if (isConversationLoading || isMessagesLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Conversation not found</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => goBack()}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View
        style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}
      >
        <TouchableOpacity style={styles.iconButton} onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversation.otherUser.displayName}
          </Text>
          {isOtherUserTyping ? (
            <View style={styles.typingRow}>
              <Text style={styles.typingLabel}>typing</Text>
              <TypingIndicator visible />
            </View>
          ) : (
            <View style={styles.statusRow}>
              <OnlineStatusDot isOnline={isOtherUserOnline} size={8} />
              <Text style={styles.headerSubtitle}>
                {isOtherUserOnline ? "Online" : "Offline"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.iconButtonSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0 && styles.messagesEmptyContent,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatTitle}>Say hello</Text>
              <Text style={styles.emptyChatSubtitle}>
                Send the first message to {conversation.otherUser.displayName}.
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                color={theme.colors.primary}
                style={styles.loadOlder}
              />
            ) : null
          }
          onEndReached={handleLoadOlder}
          onEndReachedThreshold={0.2}
          showsVerticalScrollIndicator={false}
        />

        {!showReadOnlyBanner ? null : (
          <View style={styles.readOnlyBanner}>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.readOnlyText}>
              You are no longer connected. This chat is read-only.
            </Text>
          </View>
        )}

        <ChatComposer
          value={draft}
          onChangeText={setDraft}
          onSend={handleSend}
          disabled={!canSendMessages}
          isSending={false}
          placeholder={
            canSendMessages
              ? "Type a message..."
              : "Reconnect to send messages"
          }
        />
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
  },

  backLink: {
    marginTop: theme.spacing.lg,
  },

  backLinkText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.white,
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

  iconButtonSpacer: {
    width: 40,
  },

  headerCopy: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },

  headerTitle: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.text,
  },

  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  typingLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginRight: 4,
    fontStyle: "italic",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },

  messagesContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  messagesEmptyContent: {
    flex: 1,
    justifyContent: "center",
  },

  emptyChat: {
    transform: [{ scaleY: -1 }],
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  emptyChatTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  emptyChatSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },

  loadOlder: {
    paddingVertical: theme.spacing.md,
    transform: [{ scaleY: -1 }],
  },

  readOnlyBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  readOnlyText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
});
