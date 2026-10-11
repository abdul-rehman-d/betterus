import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps, PropsWithChildren } from "react";
import { View } from "react-native";
import { colors } from "@/lib/constants";
import AppText from "./app-text";

export default function InfoCallout({
  children,
  icon = "lightbulb-outline",
}: PropsWithChildren<{ icon?: ComponentProps<typeof MaterialCommunityIcons>["name"] }>) {
  return (
    <View className="flex-row gap-3 rounded-3xl border border-outline-soft bg-white/80 p-4">
      <View className="h-9 w-9 items-center justify-center rounded-2xl bg-gold-soft">
        <MaterialCommunityIcons name={icon} size={19} color={colors.gold} />
      </View>
      <AppText className="flex-1 pt-0.5">{children}</AppText>
    </View>
  );
}
