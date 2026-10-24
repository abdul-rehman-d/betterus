import "react-native-gesture-handler";
import "../../global.css";
import { Epilogue_600SemiBold } from "@expo-google-fonts/epilogue/600SemiBold";
import { Epilogue_700Bold } from "@expo-google-fonts/epilogue/700Bold";
import { PlusJakartaSans_400Regular } from "@expo-google-fonts/plus-jakarta-sans/400Regular";
import { PlusJakartaSans_600SemiBold } from "@expo-google-fonts/plus-jakarta-sans/600SemiBold";
import { PlusJakartaSans_700Bold } from "@expo-google-fonts/plus-jakarta-sans/700Bold";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ConvexProvider, ConvexReactClient, useQuery } from "convex/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { api } from "@/convex/_generated/api";
import { colors } from "@/lib/constants";
import { SessionProvider, useSession } from "@/providers/session-provider";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ConvexProvider client={convex}>
          <ThemeProvider>
            <SessionProvider onReady={finishStartup}>
              <BottomSheetModalProvider>
                <ThemedApp />
              </BottomSheetModalProvider>
            </SessionProvider>
          </ThemeProvider>
        </ConvexProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedApp() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator isDark={isDark} />
    </>
  );
}

function AppNavigator({ isDark }: { isDark: boolean }) {
  const session = useSession();
  const user = useQuery(api.users.get, session.userId ? { userId: session.userId } : "skip");
  const canOnboard = !session.userId || user === null;
  const hasProfile = Boolean(user);

  useEffect(() => {
    if (session.userId && user === null) void session.clearUserId();
  }, [session, user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? "#1D1218" : colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={canOnboard}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={hasProfile}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="profile/edit" />
        <Stack.Screen name="profile/units" />
        <Stack.Screen name="profile/measurements" />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: "transparentModal",
            animation: "fade",
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
