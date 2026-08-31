import { useState } from "react";
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
import { useLocalSearchParams } from "expo-router";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import { getInitials } from "@/utils/userDisplay";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { useUserGetToKnowMe } from "@/hooks/connections/useUserGetToKnowMe";
import { useSendConnectionRequest } from "@/hooks/connections/useSendConnectionRequest";

const MIN_ANSWER_LENGTH = 10;
const MAX_ANSWER_LENGTH = 500;

export default function SendConnectionRequestScreen() {
  const insets = useSafeAreaInsets();
  const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>();
  const userId = typeof userIdParam === "string" ? userIdParam : "";

  const { data: profile, isLoading: isProfileLoading } = useUserProfile(userId);
  const { data: question, isLoading: isQuestionLoading } =
    useUserGetToKnowMe(userId);
  const { mutateAsync: sendRequest, isPending } =
    useSendConnectionRequest(userId);

  const [answer, setAnswer] = useState("");

  const trimmedAnswer = answer.trim();
  const canSend =
    trimmedAnswer.length >= MIN_ANSWER_LENGTH &&
    trimmedAnswer.length <= MAX_ANSWER_LENGTH &&
    !isPending &&
    !!question;

  const handleSend = async () => {
    Keyboard.dismiss();

    if (!question) {
      Alert.alert(
        "Question unavailable",
        "This user hasn't set a connection question yet."
      );
      return;
    }

    if (trimmedAnswer.length < MIN_ANSWER_LENGTH) {
      Alert.alert(
        "Answer too short",
        `Share at least ${MIN_ANSWER_LENGTH} characters so they get to know you.`
      );
      return;
    }

    try {
      await sendRequest({
        receiverId: userId,
        answer: trimmedAnswer,
      });

      Alert.alert(
        "Request sent",
        `Your connection request was sent to ${profile?.displayName ?? "this user"}.`,
        [{ text: "OK", onPress: () => goBack() }]
      );
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Could not send your connection request. Please try again.";

      Alert.alert("Error", message);
    }
  };

  if (isProfileLoading || isQuestionLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!profile || !question) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>
          {!profile
            ? "Couldn't load this profile"
            : "This user hasn't set a connection question yet"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => goBack()}>
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
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>Connect</Text>

          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.sendButtonText,
                !canSend && styles.sendButtonTextDisabled,
              ]}
            >
              {isPending ? "Sending..." : "Send"}
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
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(profile.displayName)}
              </Text>
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.userName}>{profile.displayName}</Text>
              <Text style={styles.userHandle}>@{profile.username}</Text>
            </View>
          </View>

          <Text style={styles.heading}>Answer to connect</Text>
          <Text style={styles.subheading}>
            {profile.displayName} asks everyone who wants to connect:
          </Text>

          <View style={styles.questionCard}>
            <View style={styles.questionBadge}>
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.questionBadgeText}>Get To Know Me</Text>
            </View>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Your answer</Text>
            <TextInput
              value={answer}
              onChangeText={setAnswer}
              placeholder="Share something thoughtful and personal..."
              placeholderTextColor={theme.colors.textTertiary}
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
              maxLength={MAX_ANSWER_LENGTH}
            />
            <Text style={styles.charCount}>
              {trimmedAnswer.length}/{MAX_ANSWER_LENGTH}
            </Text>
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

  sendButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },

  sendButtonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  sendButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    color: theme.colors.white,
  },

  sendButtonTextDisabled: {
    color: theme.colors.textTertiary,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    ...theme.typography.body,
    fontWeight: "700",
    color: theme.colors.primary,
  },

  userCopy: {
    flex: 1,
  },

  userName: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  userHandle: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },

  heading: {
    ...theme.typography.h1,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subheading: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },

  questionCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  questionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: theme.spacing.sm,
  },

  questionBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  questionText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    lineHeight: 28,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  label: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
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
    minHeight: 160,
    paddingTop: theme.spacing.md,
  },

  charCount: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    textAlign: "right",
    marginTop: theme.spacing.sm,
  },
});
