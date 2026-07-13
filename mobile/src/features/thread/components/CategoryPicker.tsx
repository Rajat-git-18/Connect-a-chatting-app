import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";
import {
  THREAD_CATEGORIES,
  type ThreadCategory,
} from "../constants/thread.constants";

type CategoryPickerProps = {
  value: ThreadCategory | null;
  onChange: (category: ThreadCategory) => void;
};

export default function CategoryPicker({
  value,
  onChange,
}: CategoryPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Select category"
      >
        <Text
          style={[styles.triggerText, !value && styles.placeholder]}
          numberOfLines={1}
        >
          {value ?? "Choose a category"}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.colors.textTertiary}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>Category</Text>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {THREAD_CATEGORIES.map((category) => {
                const selected = category === value;

                return (
                  <TouchableOpacity
                    key={category}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => {
                      onChange(category);
                      setOpen(false);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.colors.primary}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    height: 52,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  triggerText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  placeholder: {
    color: theme.colors.textTertiary,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.28)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing["3xl"],
    maxHeight: "55%",
  },

  sheetTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  option: {
    height: 52,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },

  optionSelected: {
    backgroundColor: theme.colors.primarySoft,
  },

  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },

  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
