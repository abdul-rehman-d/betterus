import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { View } from "react-native";
import AppText from "@/components/ui/app-text";
import useAppColors from "@/hooks/use-app-colors";

export default function StepIntro({
  body,
  eyebrow,
  icon,
  title,
}: {
  body: string;
  eyebrow: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
}) {
  const palette = useAppColors();
  return (
    <View className="gap-4">
      <View className="h-[58px] w-[58px] items-center justify-center rounded-[21px] border border-petal bg-petal-soft">
        <MaterialCommunityIcons name={icon} size={27} color={palette.berry} />
      </View>
      <View className="gap-2">
        <AppText variant="label" className="uppercase tracking-[1.5px] text-berry">
          {eyebrow}
        </AppText>
        <AppText variant="display">{title}</AppText>
        <AppText>{body}</AppText>
      </View>
    </View>
  );
}
