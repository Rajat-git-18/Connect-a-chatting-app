import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "access_token";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

/** Read userId from JWT payload (display/client use only). */
export async function getUserIdFromToken(): Promise<string | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const data = JSON.parse(atob(padded)) as { userId?: string };
    return data.userId ?? null;
  } catch {
    return null;
  }
}