import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import theme from "@/theme";
import type { ThreadVisibility } from "../constants/thread.constants";

type VisibilitySelectorProps = {
  value: ThreadVisibility;
  onChange: (value: ThreadVisibility) => void;
};

const OPTIONS: { value: ThreadVisibility; label: string; hint: string }[] = [
  {
    value: "public",
    label: "Public",
    hint: "Anyone on Connect can join",
  },
  {
    value: "friends",
    label: "Friends",
    hint: "Only people you connect with",
  },
];

export default function VisibilitySelector({
  value,
  onChange,
}: VisibilitySelectorProps) {
  return (
    <View style={styles.list}>
      {OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(option.value)}
            activeOpacity={0.85}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? <View style={styles.radioDot} /> : null}
            </View>

            <View style={styles.copy}>
              <Text style={styles.label}>{option.label}</Text>
              <Text style={styles.hint}>{option.hint}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },

  optionSelected: {
    borderColor: theme.colors.primaryLight,
    backgroundColor: theme.colors.primarySoft,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: theme.colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },

  copy: {
    flex: 1,
  },

  label: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
  },

  hint: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
