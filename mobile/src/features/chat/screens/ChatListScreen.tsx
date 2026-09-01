import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { push } from "@/utils/navigation";
import { useConversations } from "@/hooks/chat/useConversations";
import { useProfile } from "@/hooks/profile/useProfile";
import ConversationRow from "../components/ConversationRow";

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
        Message someone you're connected with from their profile or the Friends
        tab.
      </Text>
    </View>
  );
}

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();
  const { data: conversations = [], isLoading, isError } = useConversations();

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top + theme.spacing.md }}>
        <Text style={styles.pageTitle}>Chats</Text>
        <Text style={styles.pageSubtitle}>
          Messages with your connections
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Couldn't load chats</Text>
          <Text style={styles.emptySubtitle}>Pull to refresh and try again.</Text>
        </View>
      ) : conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 120 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {conversations.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              currentUserId={profile?.id}
              onPress={(conversationId) =>
                push(`/(protected)/chat/${conversationId}`)
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  pageTitle: {
    ...theme.typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
  },

  pageSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },

  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
  },

  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
});
