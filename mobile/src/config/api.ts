import { Platform } from "react-native";
import Constants from "expo-constants";

const API_PORT = 5001;

/**
 * On a physical phone, `localhost` is the phone — not your Mac.
 * Prefer the Metro host IP Expo already discovered (same Wi‑Fi).
 */
function getDevApiBaseUrl(): string {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    // Older manifests
    (Constants as { manifest?: { debuggerHost?: string } }).manifest
      ?.debuggerHost;

  const host = hostUri?.split(":")[0]?.trim();

  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:${API_PORT}/api`;
  }

  // Android emulator → host machine
  if (Platform.OS === "android") {
    return `http://10.0.2.2:${API_PORT}/api`;
  }

  // iOS Simulator
  return `http://localhost:${API_PORT}/api`;
}

export const API_URL = __DEV__
  ? getDevApiBaseUrl()
  : "https://api.connect.com";
