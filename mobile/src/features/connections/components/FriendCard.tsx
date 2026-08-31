import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import { getInitials } from "@/utils/userDisplay";
import { formatRelativeTime } from "@/features/thread/utils/mapThreadDetail";
import type { ConnectionFriendItem } from "@/types/connection.types";

type FriendCardProps = {
  connection: ConnectionFriendItem;
  onPress: (userId: string) => void;
};

export default function FriendCard({ connection, onPress }: FriendCardProps) {
  const { user } = connection;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(user.id)}
      activeOpacity={0.85}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(user.displayName)}</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.handle}>@{user.username}</Text>
        {user.bio ? (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        ) : null}
        <Text style={styles.connectedAt}>
          Connected {formatRelativeTime(connection.connectedAt)}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.textTertiary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.card,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  copy: {
    flex: 1,
  },

  name: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.text,
  },

  handle: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },

  bio: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  connectedAt: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginTop: 6,
  },
});
