import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { push } from "@/utils/navigation";
import HomeHeader from "../components/HomeHeader";
import HomeSearchBar from "../components/HomeSearchBar";
import HomeGreeting from "../components/HomeGreeting";
import CreateThreadCard from "../components/CreateThreadCard";
import TrendingDiscussions from "../components/TrendingDiscussions";
import PeopleYouMayKnow from "../components/PeopleYouMayKnow";
import GlassTabBar, { type TabKey } from "../components/GlassTabBar";
import ProfileScreen from "@/features/profile/screens/ProfileScreen";

function PlaceholderTab({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [search, setSearch] = useState("");

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {activeTab === "home" ? (
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
          keyboardShouldPersistTaps="handled"
        >
          <HomeHeader />
          <HomeSearchBar value={search} onChangeText={setSearch} />
          <HomeGreeting name="Rajat" />
          <CreateThreadCard
            onPress={() => push("/(protected)/create-thread")}
          />
          <TrendingDiscussions
            onPressItem={(threadId) =>
              push(`/(protected)/thread/${threadId}`)
            }
          />
          <PeopleYouMayKnow />
        </ScrollView>
      ) : activeTab === "profile" ? (
        <ProfileScreen />
      ) : (
        <View
          style={[
            styles.content,
            styles.flex,
            {
              paddingTop: insets.top + theme.spacing.xl,
              paddingBottom: 120 + insets.bottom,
            },
          ]}
        >
          {activeTab === "chats" && (
            <PlaceholderTab
              title="Chats"
              subtitle="Your conversations will appear here."
            />
          )}
          {activeTab === "friends" && (
            <PlaceholderTab
              title="Friends"
              subtitle="Find and manage your connections."
            />
          )}
        </View>
      )}

      <GlassTabBar active={activeTab} onChange={setActiveTab} />
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

  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  placeholderTitle: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },

  placeholderSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
});
