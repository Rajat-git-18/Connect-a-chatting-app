import { Stack } from "expo-router";
import ChatSocketProvider from "@/features/chat/components/ChatSocketProvider";

export default function ProtectedLayout() {
  return (
    <ChatSocketProvider>
      <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          animation: "none",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="create-thread"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="thread/[id]"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="my-discussions"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="connection-question"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="connect/[userId]"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="resolve-discussion"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
    </Stack>
    </ChatSocketProvider>
  );
}
