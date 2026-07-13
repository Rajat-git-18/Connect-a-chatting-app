type AuthErrorContext = "login" | "register" | "forgot-password";

function getStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status;
}

function getServerMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const response = (error as { response?: { data?: { message?: unknown } } })
    .response;
  const message = response?.data?.message;
  return typeof message === "string" ? message.trim() : undefined;
}

function isNetworkError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const err = error as { code?: string; message?: string };
  return (
    err.code === "ERR_NETWORK" ||
    err.message === "Network Error" ||
    err.code === "ECONNABORTED"
  );
}

const SERVER_MESSAGE_MAP: Record<string, string> = {
  "Invalid email/username or password.":
    "Incorrect email or password. Please try again.",
  "Email already exists":
    "An account with this email already exists. Try logging in instead.",
  "Username is already taken":
    "This username is already taken. Please choose another one.",
  "User not found.": "We couldn’t find an account with those details.",
};

export function getAuthErrorMessage(
  error: unknown,
  context: AuthErrorContext = "login"
): string {
  if (isNetworkError(error)) {
    const err = error as { code?: string };
    if (err.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }
    return "Unable to connect. Check your internet connection and try again.";
  }

  const serverMessage = getServerMessage(error);
  if (serverMessage && SERVER_MESSAGE_MAP[serverMessage]) {
    return SERVER_MESSAGE_MAP[serverMessage];
  }

  if (serverMessage) {
    return serverMessage;
  }

  const status = getStatus(error);

  if (status === 401) {
    return context === "login"
      ? "Incorrect email or password. Please try again."
      : "Your session expired. Please sign in again.";
  }

  if (status === 409) {
    return "This account information is already in use. Please try different details.";
  }

  if (status === 422 || status === 400) {
    return "Please check your details and try again.";
  }

  if (status && status >= 500) {
    return "We’re having trouble on our side. Please try again in a moment.";
  }

  if (context === "register") {
    return "We couldn’t create your account. Please try again.";
  }

  if (context === "forgot-password") {
    return "We couldn’t send a reset link. Please try again.";
  }

  return "Unable to sign in. Please try again.";
}
