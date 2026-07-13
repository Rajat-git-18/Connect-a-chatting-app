import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen name="home" />
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
        name="resolve-discussion"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
