import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
  } from "react-native";
  
  import theme from "@/theme";
  import { push } from "@/utils/navigation";
  import AuthHeader from "../components/AuthHeader";
  import GoogleSignInButton from "../components/GoogleSignInButton";
  
  export default function LoginScreen() {
    return (
      <View style={styles.container}>
  
        <AuthHeader />
  
        <TextInput
          placeholder="Email or Username"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
        />
  
        <TextInput
          placeholder="Password"
          secureTextEntry
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
        />
  
        <TouchableOpacity onPress={() => push("/forgot-password")}>
          <Text style={styles.forgot}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>
            LOGIN
          </Text>
        </TouchableOpacity>
  
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>
  
        <GoogleSignInButton />
  
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?
          </Text>
  
          <TouchableOpacity onPress={() => push("/register")}>
            <Text style={styles.signup}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
  
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      padding: theme.spacing.xl,
    },
  
    input: {
      height: 56,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
  
      paddingHorizontal: theme.spacing.md,
  
      marginBottom: theme.spacing.md,
  
      color: theme.colors.text,
    },
  
    forgot: {
      alignSelf: "flex-end",
      color: theme.colors.primary,
  
      marginBottom: theme.spacing.xl,
    },
  
    loginButton: {
      height: 56,
      backgroundColor: theme.colors.primary,
  
      borderRadius: theme.radius.lg,
  
      justifyContent: "center",
      alignItems: "center",
    },
  
    loginText: {
      color: theme.colors.white,
      ...theme.typography.button,
    },
  
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: theme.spacing.xl,
    },
  
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
  
    or: {
      marginHorizontal: theme.spacing.md,
      color: theme.colors.textSecondary,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: theme.spacing["2xl"],
    },
  
    footerText: {
      color: theme.colors.textSecondary,
    },
  
    signup: {
      color: theme.colors.primary,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
  });