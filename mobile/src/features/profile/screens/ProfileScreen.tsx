import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import theme from "@/theme";
import { push } from "@/utils/navigation";
import { removeToken } from "@/services/auth/auth.service";
import { queryClient } from "@/lib/queryClient";
import { useProfile } from "@/hooks/profile/useProfile";
import { useGetToKnowMe } from "@/hooks/connections/useGetToKnowMe";

type MenuItem = {
  key: string;
  label: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  destructive?: boolean;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    data: profile,
    isLoading,
    isError,
  } = useProfile();
  const { data: getToKnowMe, isLoading: isQuestionLoading } = useGetToKnowMe();

  const handleLogout = async () => {
    await removeToken();
    queryClient.clear();
    router.replace("/(auth)/login");
  };

  const menuItems: MenuItem[] = [
    {
      key: "threads",
      label: "My Threads",
      subtitle: "Discussions you’ve started",
      icon: "chatbubbles-outline",
      onPress: () => push("/(protected)/my-discussions"),
    },
    {
      key: "saved",
      label: "Saved Insights",
      subtitle: "Replies you bookmarked",
      icon: "bookmark-outline",
      onPress: () => {},
    },
    {
      key: "settings",
      label: "Settings",
      subtitle: "Privacy, notifications, account",
      icon: "settings-outline",
      onPress: () => {},
    },
  ];

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Unable to load profile.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + theme.spacing.md,
            paddingBottom: 120 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>
        <Text style={styles.pageSubtitle}>
          Your identity on Connect
        </Text>

        <View style={styles.identityCard}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => push("/(protected)/edit-profile")}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.displayName
                .split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.bio ? (
            <Text style={styles.bio}>{profile.bio}</Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="mail-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.metaText}>{profile.email}</Text>
            </View>
          </View>

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

        <TouchableOpacity
          style={styles.connectionCard}
          onPress={() => push("/(protected)/connection-question")}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Edit connection question"
        >
          <View style={styles.connectionHeader}>
            <View style={styles.connectionIcon}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.connectionCopy}>
              <Text style={styles.connectionTitle}>Connection Question</Text>
              <Text style={styles.connectionSubtitle}>
                Others answer this before sending a request
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textTertiary}
            />
          </View>

          <View style={styles.connectionPreview}>
            {isQuestionLoading ? (
              <Text style={styles.connectionPreviewText}>Loading...</Text>
            ) : getToKnowMe?.question ? (
              <Text style={styles.connectionPreviewQuestion}>
                {getToKnowMe.question}
              </Text>
            ) : (
              <Text style={styles.connectionPreviewEmpty}>
                Tap to set your question
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuRow,
                index < menuItems.length - 1 && styles.menuRowBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.menuCopy}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons
            name="log-out-outline"
            size={18}
            color={theme.colors.error}
          />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
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
  },

  pageTitle: {
    ...theme.typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.text,
  },

  pageSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },

  identityCard: {
    position: "relative",
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  editButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
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

  metaRow: {
    marginTop: theme.spacing.md,
    width: "100%",
    alignItems: "center",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  metaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
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

  connectionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  connectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },

  connectionIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  connectionCopy: {
    flex: 1,
  },

  connectionTitle: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
  },

  connectionSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  connectionPreview: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  connectionPreviewQuestion: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },

  connectionPreviewEmpty: {
    ...theme.typography.body,
    color: theme.colors.textTertiary,
    fontStyle: "italic",
  },

  connectionPreviewText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },

  menuCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },

  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  menuCopy: {
    flex: 1,
  },

  menuLabel: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
  },

  menuSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  logoutText: {
    ...theme.typography.button,
    color: theme.colors.error,
  },
});
