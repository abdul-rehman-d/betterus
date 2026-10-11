import "../../global.css";
import { Epilogue_600SemiBold } from "@expo-google-fonts/epilogue/600SemiBold";
import { Epilogue_700Bold } from "@expo-google-fonts/epilogue/700Bold";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "@/lib/constants";
import { SessionProvider } from "@/providers/session-provider";

void SplashScreen.preventAutoHideAsync();
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl)
  throw new Error(
    "EXPO_PUBLIC_CONVEX_URL is missing. Run `pnpm convex dev --once` to configure it.",
  );
const convex = new ConvexReactClient(convexUrl, { unsavedChangesWarning: false });

export default function RootLayout() {
  const [ready] = useFonts({
    Epilogue_600SemiBold,
    Epilogue_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const finishStartup = useCallback(() => void SplashScreen.hideAsync(), []);
  if (!ready) return null;
  return (
    <SafeAreaProvider>
      <ConvexProvider client={convex}>
        <SessionProvider onReady={finishStartup}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="(modals)"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.65, 1],
              }}
            />
          </Stack>
        </SessionProvider>
      </ConvexProvider>
    </SafeAreaProvider>
  );
}
