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
import { useGetToKnowMe } from "@/hooks/connections/useGetToKnowMe";
import { useUpsertGetToKnowMe } from "@/hooks/connections/useUpsertGetToKnowMe";
import {
  DEFAULT_GET_TO_KNOW_ME_QUESTION,
  SUGGESTED_CONNECTION_QUESTIONS,
} from "../constants/connectionQuestion.constants";

const MIN_LENGTH = 10;
const MAX_LENGTH = 200;

export default function ConnectionQuestionScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useGetToKnowMe();
  const { mutateAsync: saveQuestion, isPending } = useUpsertGetToKnowMe();

  const [question, setQuestion] = useState(DEFAULT_GET_TO_KNOW_ME_QUESTION);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || isLoading) return;

    if (data?.question) {
      setQuestion(data.question);
    }

    setInitialized(true);
  }, [data, initialized, isLoading]);

  const trimmedQuestion = question.trim();
  const canSave =
    trimmedQuestion.length >= MIN_LENGTH &&
    trimmedQuestion.length <= MAX_LENGTH &&
    !isPending &&
    trimmedQuestion !== (data?.question ?? "").trim();

  const handleSave = async () => {
    Keyboard.dismiss();

    if (trimmedQuestion.length < MIN_LENGTH) {
      Alert.alert(
        "Question too short",
        `Use at least ${MIN_LENGTH} characters so others know what to answer.`
      );
      return;
    }

    try {
      await saveQuestion({ question: trimmedQuestion });

      Alert.alert("Question saved", "Others will answer this when connecting with you.", [
        { text: "OK", onPress: () => goBack() },
      ]);
    } catch {
      Alert.alert("Error", "Could not save your connection question. Please try again.");
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

  if (isError) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Couldn't load your question</Text>
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

          <Text style={styles.topBarTitle}>Connection Question</Text>

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Save connection question"
          >
            <Text
              style={[
                styles.saveButtonText,
                !canSave && styles.saveButtonTextDisabled,
              ]}
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
          <Text style={styles.heading}>Your connection question</Text>
          <Text style={styles.subheading}>
            When someone wants to connect, they'll answer this question first.
            Make it personal so you get meaningful requests.
          </Text>

          <View style={styles.previewCard}>
            <View style={styles.previewBadge}>
              <Ionicons
                name="help-circle-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.previewBadgeText}>Get To Know Me</Text>
            </View>
            <Text style={styles.previewQuestion}>
              {trimmedQuestion || "Your question will appear here"}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Question</Text>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="What would you like people to answer?"
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
                maxLength={MAX_LENGTH}
              />
              <Text style={styles.charCount}>
                {trimmedQuestion.length}/{MAX_LENGTH}
              </Text>
            </View>
          </View>

          <Text style={styles.suggestionsTitle}>Suggested questions</Text>
          <View style={styles.suggestions}>
            {SUGGESTED_CONNECTION_QUESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionChip,
                  trimmedQuestion === suggestion && styles.suggestionChipActive,
                ]}
                onPress={() => setQuestion(suggestion)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    trimmedQuestion === suggestion &&
                      styles.suggestionTextActive,
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
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

  previewCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },

  previewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: theme.spacing.sm,
  },

  previewBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  previewQuestion: {
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
    marginBottom: theme.spacing.lg,
    ...theme.shadows.soft,
  },

  field: {
    marginBottom: 0,
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
    minHeight: 120,
    paddingTop: theme.spacing.md,
  },

  charCount: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    textAlign: "right",
    marginTop: theme.spacing.sm,
  },

  suggestionsTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },

  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  suggestionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  suggestionChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryLight,
  },

  suggestionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },

  suggestionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
