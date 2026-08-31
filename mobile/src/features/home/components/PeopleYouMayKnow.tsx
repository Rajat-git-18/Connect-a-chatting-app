import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import theme from "@/theme";
import { push } from "@/utils/navigation";
import { getInitials } from "@/utils/userDisplay";
import { useConnectionSuggestions } from "@/hooks/connections/useConnectionSuggestions";

export default function PeopleYouMayKnow() {
  const { data: people = [], isLoading, isError } = useConnectionSuggestions();

  if (isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>People You May Know</Text>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || people.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.heading}>People You May Know</Text>
        <Text style={styles.emptyText}>
          {isError
            ? "Couldn't load suggestions right now."
            : "No new people to connect with yet. Set your connection question on Profile to get started."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>People You May Know</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {people.map((person) => (
          <View key={person.id} style={styles.card}>
            <TouchableOpacity
              style={styles.profileTapArea}
              onPress={() => push(`/(protected)/user/${person.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.avatar}>
                <Text style={styles.initials}>
                  {getInitials(person.displayName)}
                </Text>
              </View>

              <Text style={styles.name} numberOfLines={1}>
                {person.displayName}
              </Text>
              <Text style={styles.handle} numberOfLines={1}>
                @{person.username}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => push(`/(protected)/connect/${person.id}`)}
              activeOpacity={0.85}
            >
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl,
  },

  heading: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },

  row: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  card: {
    width: 148,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.card,
  },

  profileTapArea: {
    alignItems: "center",
    width: "100%",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },

  initials: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  name: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },

  handle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginBottom: theme.spacing.md,
  },

  connectButton: {
    width: "100%",
    height: 36,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  connectText: {
    ...theme.typography.caption,
    fontWeight: "600",
    color: theme.colors.white,
  },
});
