import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import theme from "@/theme";
import { goBack, push } from "@/utils/navigation";
import { getInitials } from "@/utils/userDisplay";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { useConnectionStatus } from "@/hooks/connections/useConnectionStatus";
import { useProfile } from "@/hooks/profile/useProfile";
import type { ConnectionRelationshipStatus } from "@/types/connection.types";

function getConnectButtonLabel(status: ConnectionRelationshipStatus): string {
  switch (status) {
    case "CONNECTED":
      return "Connected";
    case "PENDING_SENT":
      return "Request Sent";
    case "PENDING_RECEIVED":
      return "Respond to Request";
    case "NO_QUESTION":
      return "Question Not Set";
    case "SELF":
      return "Your Profile";
    default:
      return "Connect";
  }
}

function isConnectDisabled(status: ConnectionRelationshipStatus): boolean {
  return (
    status === "CONNECTED" ||
    status === "PENDING_SENT" ||
    status === "NO_QUESTION" ||
    status === "SELF"
  );
}

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = typeof id === "string" ? id : "";

  const { data: currentUser } = useProfile();
  const {
    data: profile,
    isLoading,
    isError,
  } = useUserProfile(userId);
  const { data: connectionStatus, isLoading: isStatusLoading } =
    useConnectionStatus(userId);

  const status = connectionStatus?.status ?? "NONE";
  const isSelf = currentUser?.id === userId || status === "SELF";

  const handleConnect = () => {
    if (isConnectDisabled(status)) return;
    push(`/(protected)/connect/${userId}`);
  };

  if (isLoading || isStatusLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Couldn't load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => goBack()}>
          <Text style={styles.retryText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View
        style={[styles.topBar, { paddingTop: insets.top + theme.spacing.sm }]}
      >
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Profile</Text>
        <View style={styles.iconButtonSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identityCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(profile.displayName)}
            </Text>
          </View>

          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.username}>@{profile.username}</Text>

          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : (
            <Text style={styles.bioEmpty}>No bio yet</Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.threadsCount}</Text>
              <Text style={styles.statLabel}>Threads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.repliesCount}</Text>
              <Text style={styles.statLabel}>Replies</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.reactionsCount}</Text>
              <Text style={styles.statLabel}>Reactions</Text>
            </View>
          </View>
        </View>

        {!isSelf ? (
          <TouchableOpacity
            style={[
              styles.connectButton,
              isConnectDisabled(status) && styles.connectButtonDisabled,
            ]}
            onPress={handleConnect}
            disabled={isConnectDisabled(status)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={
                status === "CONNECTED"
                  ? "checkmark-circle-outline"
                  : status === "PENDING_SENT"
                    ? "time-outline"
                    : "person-add-outline"
              }
              size={18}
              color={
                isConnectDisabled(status)
                  ? theme.colors.textSecondary
                  : theme.colors.white
              }
            />
            <Text
              style={[
                styles.connectButtonText,
                isConnectDisabled(status) && styles.connectButtonTextDisabled,
              ]}
            >
              {getConnectButtonLabel(status)}
            </Text>
          </TouchableOpacity>
        ) : null}

        {status === "PENDING_SENT" ? (
          <Text style={styles.statusHint}>
            Your connection request is waiting for their response.
          </Text>
        ) : null}

        {status === "NO_QUESTION" ? (
          <Text style={styles.statusHint}>
            This user hasn't set a connection question yet.
          </Text>
        ) : null}
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

  identityCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  avatarText: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },

  name: {
    ...theme.typography.h2,
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.text,
  },

  username: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },

  bio: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
    lineHeight: 22,
  },

  bioEmpty: {
    ...theme.typography.body,
    color: theme.colors.textTertiary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: theme.spacing.md,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    width: "100%",
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: theme.colors.border,
  },

  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },

  connectButtonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  connectButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },

  connectButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },

  statusHint: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
