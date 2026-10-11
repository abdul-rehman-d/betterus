import { Stack } from "expo-router";
import { OnboardingProvider } from "@/providers/onboarding-provider";
export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
    </OnboardingProvider>
  );
}
