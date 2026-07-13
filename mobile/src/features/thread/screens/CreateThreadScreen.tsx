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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";
import { goBack } from "@/utils/navigation";
import CategoryPicker from "../components/CategoryPicker";
import ImageUploadCard from "../components/ImageUploadCard";
import TagChips from "../components/TagChips";
import VisibilitySelector from "../components/VisibilitySelector";
import type {
  ThreadCategory,
  ThreadVisibility,
} from "../constants/thread.constants";

export default function CreateThreadScreen() {
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ThreadCategory | null>(null);
  const [discussion, setDiscussion] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<ThreadVisibility>("public");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    title.trim().length > 0 &&
    category !== null &&
    discussion.trim().length > 0 &&
    !submitting;

  const handlePost = async () => {
    Keyboard.dismiss();

    if (!canSubmit || !category) {
      Alert.alert(
        "Almost there",
        "Add a title, category, and discussion before posting."
      );
      return;
    }

    try {
      setSubmitting(true);

      // UI-only for now — API wiring comes next
      await new Promise((resolve) => setTimeout(resolve, 400));

      Alert.alert("Thread ready", "Your conversation has been prepared.", [
        {
          text: "Done",
          onPress: () => goBack("/(protected)/home"),
        },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View
          style={[
            styles.topBar,
            { paddingTop: insets.top + theme.spacing.sm },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => goBack("/(protected)/home")}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <Text style={styles.topBarTitle}>New Thread</Text>
          <View style={styles.backButtonSpacer} />
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + theme.spacing["4xl"] },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Start a Conversation</Text>
          <Text style={styles.subtitle}>
            Ideas become communities.{"\n"}Questions become answers.
          </Text>

          <View style={styles.card}>
            <View style={styles.field}>
              <Text style={styles.label}>Thread Title</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What's your discussion about?"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.input}
                returnKeyType="next"
                maxLength={120}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Category</Text>
              <CategoryPicker value={category} onChange={setCategory} />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Discussion</Text>
              <TextInput
                value={discussion}
                onChangeText={setDiscussion}
                placeholder="Share the thought that starts it all..."
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
                maxLength={4000}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Image Upload</Text>
              <ImageUploadCard uri={imageUri} onChange={setImageUri} />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Tags <Text style={styles.optional}>(optional)</Text>
              </Text>
              <TagChips selected={tags} onChange={setTags} />
            </View>

            <View style={styles.fieldLast}>
              <Text style={styles.label}>Visibility</Text>
              <VisibilitySelector
                value={visibility}
                onChange={setVisibility}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submit, !canSubmit && styles.submitDisabled]}
            onPress={handlePost}
            disabled={!canSubmit}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Post Thread"
          >
            <Text style={styles.submitText}>
              {submitting ? "Posting..." : "Post Thread"}
            </Text>
          </TouchableOpacity>
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

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonSpacer: {
    width: 40,
  },

  topBarTitle: {
    ...theme.typography.bodySmall,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },

  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },

  title: {
    ...theme.typography.h1,
    fontSize: 30,
    lineHeight: 36,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
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
    minHeight: 148,
    paddingTop: theme.spacing.md,
  },

  submit: {
    marginTop: theme.spacing.xl,
    height: 56,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.soft,
  },

  submitDisabled: {
    opacity: 0.45,
  },

  submitText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
});
