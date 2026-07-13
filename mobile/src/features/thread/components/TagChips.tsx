import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "@/theme";
import { SUGGESTED_TAGS } from "../constants/thread.constants";

type TagChipsProps = {
  selected: string[];
  onChange: (tags: string[]) => void;
};

export default function TagChips({ selected, onChange }: TagChipsProps) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((item) => item !== tag));
      return;
    }

    onChange([...selected, tag]);
  };

  return (
    <View style={styles.row}>
      {SUGGESTED_TAGS.map((tag) => {
        const active = selected.includes(tag);

        return (
          <TouchableOpacity
            key={tag}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => toggle(tag)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  chipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  chipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  chipTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
