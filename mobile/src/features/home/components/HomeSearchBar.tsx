import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type HomeSearchBarProps = {
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function HomeSearchBar({
  value,
  onChangeText,
}: HomeSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={18}
        color={theme.colors.textTertiary}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search people, communities and threads"
        placeholderTextColor={theme.colors.textTertiary}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  icon: {
    marginRight: theme.spacing.sm,
  },

  input: {
    flex: 1,
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    paddingVertical: 0,
  },
});
