import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import theme from "@/theme";
import { router } from "expo-router";
import { getToken, removeToken } from "@/services/auth/auth.service";
import { getCurrentUser } from "@/services/api/auth.api";

export default function SplashScreen() {
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
        // Animate Progress Bar
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
      
            return prev + 2;
          });
        }, 40);
      
        // Check Authentication
        const checkAuth = async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000));
      
          const token = await getToken();
      
          

          if (!token) {
              router.replace("/(auth)/login");
              return;
          }
          
          try {
              await getCurrentUser(token);
          
              router.replace("/(protected)/home");
          } catch {
              await removeToken();
          
              router.replace("/(auth)/login");
          }
        };
      
        checkAuth();
      
        return () => clearInterval(interval);
      }, []);
  
    return (
      <View style={styles.container}>

      {/* Temporary Logo */}
      <View style={styles.logoCircle}>
        <Text style={styles.logoLetter}>C</Text>
      </View>

      {/* App Name */}
      <Text style={styles.title}>
        CONNECT
      </Text>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Connect People. Build Together.
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.loadingText}>
        Loading...
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: theme.spacing.xl,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor: theme.colors.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: theme.spacing.lg,
  },

  logoLetter: {
    color: theme.colors.white,

    fontSize: 42,

    fontWeight: "700",
  },

  title: {
    ...theme.typography.h1,

    color: theme.colors.text,

    letterSpacing: 5,

    marginBottom: theme.spacing.sm,
  },

  tagline: {
    ...theme.typography.body,

    color: theme.colors.textSecondary,

    textAlign: "center",

    marginBottom: theme.spacing["4xl"],
  },

  progressContainer: {
    width: "70%",

    height: 6,

    backgroundColor: theme.colors.border,

    borderRadius: theme.radius.full,

    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
},

  loadingText: {
    ...theme.typography.bodySmall,

    color: theme.colors.textSecondary,

    marginTop: theme.spacing.md,
  },
});