import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";

export type TabKey = "home" | "chats" | "friends" | "profile";

type TabItem = {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabItem[] = [
  {
    key: "home",
    label: "Home",
    icon: "home-outline",
    iconActive: "home",
  },
  {
    key: "chats",
    label: "Chats",
    icon: "chatbubbles-outline",
    iconActive: "chatbubbles",
  },
  {
    key: "friends",
    label: "Friends",
    icon: "people-outline",
    iconActive: "people",
  },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
];

type GlassTabBarProps = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function GlassTabBar({ active, onChange }: GlassTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, theme.spacing.sm) },
      ]}
    >
      <View style={styles.shell}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidFill]} />
        )}

        <View style={styles.row}>
          {TABS.map((tab) => {
            const isActive = tab.key === active;

            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => onChange(tab.key)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
              >
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={22}
                  color={
                    isActive ? theme.colors.primary : theme.colors.textTertiary
                  }
                />
                <Text
                  style={[styles.label, isActive && styles.labelActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: 0,
  },

  shell: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    ...theme.shadows.float,
  },

  androidFill: {
    backgroundColor: "rgba(255, 255, 255, 0.94)",
  },

  row: {
    flexDirection: "row",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: theme.spacing.xs,
  },

  label: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontWeight: "500",
  },

  labelActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
