import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type CreateThreadCardProps = {
  onPress?: () => void;
};

export default function CreateThreadCard({ onPress }: CreateThreadCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Create Thread"
    >
      <View style={styles.iconWrap}>
        <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>Create Thread</Text>
        <Text style={styles.subtitle}>
          Share an idea, ask a question, or start a discussion
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
    marginBottom: theme.spacing.xl,
    ...theme.shadows.soft,
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  copy: {
    flex: 1,
  },

  title: {
    ...theme.typography.h3,
    fontSize: 17,
    lineHeight: 22,
    color: theme.colors.text,
  },

  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
