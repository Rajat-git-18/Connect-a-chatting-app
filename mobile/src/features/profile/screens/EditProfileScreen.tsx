import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { data: profile, isLoading, isError } = useProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setBio(profile.bio ?? "");
  }, [profile]);

  const trimmedName = displayName.trim();
  const canSave =
    trimmedName.length >= 2 &&
    !isPending &&
    !!profile &&
    (trimmedName !== profile.displayName ||
      bio.trim() !== (profile.bio ?? "").trim());

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!canSave) {
      if (trimmedName.length < 2) {
        Alert.alert("Display name required", "Use at least 2 characters.");
      }
      return;
    }

    try {
      await updateProfile({
        displayName: trimmedName,
        bio: bio.trim() || undefined,
      });

      Alert.alert("Profile updated", "Your changes have been saved.", [
        {
          text: "OK",
          onPress: () => goBack(),
        },
      ]);
    } catch {
      Alert.alert("Error", "Could not update profile. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Couldn't load profile</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[styles.topBar, { paddingTop: insets.top + theme.spacing.sm }]}
        >
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => goBack()}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>Edit Profile</Text>

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save profile"
          >
            <Text
              style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}
            >
              {isPending ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + theme.spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heading}>Edit your profile</Text>
          <Text style={styles.subheading}>
            Update how you appear on Connect. Email and username can't be changed.
          </Text>

          <View style={styles.avatarPreview}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {trimmedName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "?"}
              </Text>
            </View>
            <Text style={styles.previewName}>
              {trimmedName || "Your name"}
            </Text>
            <Text style={styles.previewUsername}>@{profile.username}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Display name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="How others see you"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={60}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Bio <Text style={styles.optional}>(optional)</Text>
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell the community a little about yourself"
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
                maxLength={280}
              />
              <Text style={styles.charCount}>{bio.length}/280</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <View style={styles.lockedLabelRow}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.lockedBadge}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={12}
                    color={theme.colors.textTertiary}
                  />
                  <Text style={styles.lockedBadgeText}>Unique</Text>
                </View>
              </View>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>@{profile.username}</Text>
              </View>
            </View>

            <View style={[styles.field, styles.fieldLast]}>
              <View style={styles.lockedLabelRow}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.lockedBadge}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={12}
                    color={theme.colors.textTertiary}
                  />
                  <Text style={styles.lockedBadgeText}>Locked</Text>
                </View>
              </View>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>{profile.email}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  flex: {
    flex: 1,
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },

  errorTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    textAlign: "center",
  },

  retryButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
  },

  retryText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  topBarTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },

  saveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },

  saveButtonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  saveButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },

  saveButtonTextDisabled: {
    color: theme.colors.textTertiary,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  heading: {
    ...theme.typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.text,
  },

  subheading: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },

  avatarPreview: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },

  avatarText: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },

  previewName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  previewUsername: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  field: {
    marginBottom: theme.spacing.lg,
  },

  fieldLast: {
    marginBottom: 0,
  },

  label: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  optional: {
    fontWeight: "400",
    color: theme.colors.textTertiary,
  },

  lockedLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },

  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  lockedBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontWeight: "600",
  },

  input: {
    minHeight: 52,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === "ios" ? theme.spacing.md : 12,
    ...theme.typography.body,
    color: theme.colors.text,
  },

  textArea: {
    minHeight: 120,
    paddingTop: theme.spacing.md,
  },

  charCount: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    textAlign: "right",
    marginTop: theme.spacing.sm,
  },

  readOnlyField: {
    minHeight: 52,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
  },

  readOnlyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
