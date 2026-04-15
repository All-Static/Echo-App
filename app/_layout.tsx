import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login screen */}
      <Stack.Screen name="index" />

      {/* Tabs group (this is CRITICAL) */}
      <Stack.Screen name="(tabs)" />

      {/* Other screens */}
      <Stack.Screen name="create-account" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}