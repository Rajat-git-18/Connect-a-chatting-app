import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Keyboard,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme from "@/theme";

interface AuthScreenShellProps {
  children: ReactNode;
  /** center = login/forgot; top = long forms like register */
  contentAlign?: "center" | "top";
}

export default function AuthScreenShell({
  children,
  contentAlign = "center",
}: AuthScreenShellProps) {
  const insets = useSafeAreaInsets();
  const isTopAligned = contentAlign === "top";

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            isTopAligned ? styles.contentTop : styles.contentCenter,
            {
              paddingTop: isTopAligned
                ? Math.max(insets.top, theme.spacing.md)
                : Math.max(insets.top, theme.spacing.lg),
              paddingBottom: Math.max(
                insets.bottom + theme.spacing.xl,
                theme.spacing["2xl"]
              ),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          bounces
        >
          <Pressable
            style={[
              styles.pressable,
              isTopAligned ? styles.pressableTop : styles.pressableCenter,
            ]}
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            {children}
          </Pressable>
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

  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
  },

  contentCenter: {
    justifyContent: "center",
  },

  contentTop: {
    justifyContent: "flex-start",
  },

  pressable: {
    width: "100%",
  },

  pressableCenter: {
    flexGrow: 1,
    justifyContent: "center",
  },

  pressableTop: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
});
