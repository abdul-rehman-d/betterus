import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, View } from "react-native";
import { colors } from "@/lib/constants";
import AppText from "./app-text";
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-blush">
      <ActivityIndicator color={colors.berry} />
      <AppText>{label}</AppText>
    </View>
  );
}
export function EmptyState({
  icon = "chart-line",
  title,
  body,
}: {
  icon?: "chart-line" | "calendar-blank";
  title: string;
  body: string;
}) {
  return (
    <View className="items-center gap-2 rounded-card bg-petal-soft p-8">
      <MaterialCommunityIcons name={icon} size={34} color={colors.berry} />
      <AppText variant="subtitle" className="text-center">
        {title}
      </AppText>
      <AppText className="text-center">{body}</AppText>
    </View>
  );
}
export function InlineError({ message }: { message: string | null }) {
  return message ? (
    <AppText accessibilityRole="alert" className="text-danger">
      {message}
    </AppText>
  ) : null;
}
