import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import { colors } from "@/lib/constants";
import AppText from "@/components/ui/app-text";
export default function SelectionCard({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className={`min-h-[72px] flex-1 flex-row items-center gap-3 rounded-3xl border p-4 ${selected ? "border-berry bg-petal" : "border-outline bg-white"}`}
      onPress={onPress}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={24} color={colors.berry} /> : null}
      <AppText variant="label" className="flex-1">
        {label}
      </AppText>
      <MaterialCommunityIcons
        name={selected ? "check-circle" : "circle-outline"}
        size={23}
        color={selected ? colors.berry : colors.outline}
      />
    </Pressable>
  );
}
