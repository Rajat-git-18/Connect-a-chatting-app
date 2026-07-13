import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import theme from "@/theme";

const PEOPLE = [
  { id: "1", name: "Aanya Mehta", handle: "@aanya", initials: "AM" },
  { id: "2", name: "Kabir Shah", handle: "@kabir", initials: "KS" },
  { id: "3", name: "Mia Chen", handle: "@mia", initials: "MC" },
  { id: "4", name: "Noah Patel", handle: "@noah", initials: "NP" },
];

type PeopleYouMayKnowProps = {
  onConnect?: (id: string) => void;
};

export default function PeopleYouMayKnow({ onConnect }: PeopleYouMayKnowProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>People You May Know</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {PEOPLE.map((person) => (
          <View key={person.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>{person.initials}</Text>
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {person.name}
            </Text>
            <Text style={styles.handle} numberOfLines={1}>
              {person.handle}
            </Text>

            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => onConnect?.(person.id)}
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
