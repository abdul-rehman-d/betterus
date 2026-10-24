import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import useAppColors from "@/hooks/use-app-colors";
import { colors, shadows } from "@/lib/constants";
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
  const palette = useAppColors();
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      className={`min-h-[74px] flex-1 flex-row items-center gap-3 rounded-3xl border p-4 ${selected ? "border-berry bg-petal-soft" : "border-outline-soft"}`}
      haptic="selection"
      onPress={onPress}
      style={[
        selected ? styles.selected : styles.resting,
        { backgroundColor: selected ? palette.petalSoft : palette.white },
      ]}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={24} color={palette.berry} /> : null}
      <AppText variant="label" className="flex-1">
        {label}
      </AppText>
      <MaterialCommunityIcons
        name={selected ? "check-circle" : "circle-outline"}
        size={23}
        color={selected ? palette.berry : palette.outline}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  resting: shadows.card,
  selected: { ...shadows.card, shadowColor: colors.berry, shadowOpacity: 0.13 },
});
