import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { push } from "@/utils/navigation";
import type { FriendsTabKey } from "@/types/connection.types";
import { useConnections } from "@/hooks/connections/useConnections";
import { useIncomingConnectionRequests } from "@/hooks/connections/useIncomingConnectionRequests";
import { useOutgoingConnectionRequests } from "@/hooks/connections/useOutgoingConnectionRequests";
import { useAcceptConnectionRequest } from "@/hooks/connections/useAcceptConnectionRequest";
import { useRejectConnectionRequest } from "@/hooks/connections/useRejectConnectionRequest";
import { useCancelConnectionRequest } from "@/hooks/connections/useCancelConnectionRequest";
import ConnectionRequestCard from "../components/ConnectionRequestCard";
import FriendCard from "../components/FriendCard";

const TABS: { key: FriendsTabKey; label: string }[] = [
  { key: "connected", label: "Connected" },
  { key: "incoming", label: "Received" },
  { key: "sent", label: "Sent" },
];

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FriendsTabKey>("connected");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const {
    data: connections = [],
    isLoading: isConnectionsLoading,
    isError: isConnectionsError,
  } = useConnections();
  const {
    data: incoming = [],
    isLoading: isIncomingLoading,
    isError: isIncomingError,
  } = useIncomingConnectionRequests();
  const {
    data: outgoing = [],
    isLoading: isOutgoingLoading,
    isError: isOutgoingError,
  } = useOutgoingConnectionRequests();

  const { mutateAsync: acceptRequest } = useAcceptConnectionRequest();
  const { mutateAsync: rejectRequest } = useRejectConnectionRequest();
  const { mutateAsync: cancelRequest } = useCancelConnectionRequest();

  const isLoading =
    activeTab === "connected"
      ? isConnectionsLoading
      : activeTab === "incoming"
        ? isIncomingLoading
        : isOutgoingLoading;

  const isError =
    activeTab === "connected"
      ? isConnectionsError
      : activeTab === "incoming"
        ? isIncomingError
        : isOutgoingError;

  const handleAccept = async (requestId: string, name: string) => {
    setProcessingId(requestId);
    try {
      await acceptRequest(requestId);
      Alert.alert("Connected", `You are now connected with ${name}.`);
    } catch {
      Alert.alert("Error", "Could not accept this request. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = (requestId: string, name: string) => {
    Alert.alert(
      "Decline request?",
      `Decline the connection request from ${name}?`,
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: async () => {
            setProcessingId(requestId);
            try {
              await rejectRequest(requestId);
            } catch {
              Alert.alert(
                "Error",
                "Could not decline this request. Please try again."
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleCancel = (requestId: string) => {
    Alert.alert(
      "Cancel request?",
      "This will withdraw your pending connection request.",
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Cancel Request",
          style: "destructive",
          onPress: async () => {
            setProcessingId(requestId);
            try {
              await cancelRequest(requestId);
            } catch {
              Alert.alert(
                "Error",
                "Could not cancel this request. Please try again."
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (isError) {
      return (
        <EmptyState
          title="Something went wrong"
          subtitle="We couldn't load your connections right now."
        />
      );
    }

    if (activeTab === "connected") {
      if (connections.length === 0) {
        return (
          <EmptyState
            title="No connections yet"
            subtitle="Accept requests or connect with people from Home to build your network."
          />
        );
      }

      return connections.map((connection) => (
        <FriendCard
          key={connection.id}
          connection={connection}
          onPress={(userId) => push(`/(protected)/user/${userId}`)}
        />
      ));
    }

    if (activeTab === "incoming") {
      if (incoming.length === 0) {
        return (
          <EmptyState
            title="No incoming requests"
            subtitle="When someone answers your connection question, their request will appear here."
          />
        );
      }

      return incoming.map((request) => (
        <ConnectionRequestCard
          key={request.id}
          request={request}
          variant="incoming"
          onPressUser={(userId) => push(`/(protected)/user/${userId}`)}
          onAccept={() =>
            handleAccept(request.id, request.sender.displayName)
          }
          onReject={() =>
            handleReject(request.id, request.sender.displayName)
          }
          isProcessing={processingId === request.id}
        />
      ));
    }

    if (outgoing.length === 0) {
      return (
        <EmptyState
          title="No sent requests"
          subtitle="Requests you send from someone's profile will show up here while pending."
        />
      );
    }

    return outgoing.map((request) => (
      <ConnectionRequestCard
        key={request.id}
        request={request}
        variant="outgoing"
        onPressUser={(userId) => push(`/(protected)/user/${userId}`)}
        onCancel={() => handleCancel(request.id)}
        isProcessing={processingId === request.id}
      />
    ));
  };

  return (
    <View style={styles.screen}>
      <View style={{ paddingTop: insets.top + theme.spacing.md }}>
        <Text style={styles.pageTitle}>Friends</Text>
        <Text style={styles.pageSubtitle}>
          Manage connections and pending requests
        </Text>

        <View style={styles.segmentedControl}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            const count =
              tab.key === "incoming"
                ? incoming.length
                : tab.key === "sent"
                  ? outgoing.length
                  : connections.length;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    isActive && styles.segmentLabelActive,
                  ]}
                >
                  {tab.label}
                  {count > 0 ? ` (${count})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
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

  segmentedControl: {
    flexDirection: "row",
    marginHorizontal: theme.spacing.lg,
    padding: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
  },

  segmentActive: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.soft,
  },

  segmentLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },

  segmentLabelActive: {
    color: theme.colors.primary,
  },

  loaderWrap: {
    paddingVertical: theme.spacing["2xl"],
    alignItems: "center",
  },

  emptyState: {
    paddingVertical: theme.spacing["2xl"],
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
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
