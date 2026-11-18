
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProvider } from "../context/AppContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProvider>
        <StatusBar style="auto" />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="task/[id]" />
          <Stack.Screen name="exam/[id]" />
        </Stack>
      </AppProvider>
    </ThemeProvider>
  );
}
