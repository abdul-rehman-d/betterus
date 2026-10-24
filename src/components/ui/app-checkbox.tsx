import Ionicons from "@expo/vector-icons/Ionicons";
import type { PressableProps } from "react-native";
import useAppColors from "@/hooks/use-app-colors";
import PressableScale from "./pressable-scale";

type AppCheckboxProps = Omit<PressableProps, "onPress"> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function AppCheckbox({
  className,
  disabled,
  onValueChange,
  value,
  ...props
}: AppCheckboxProps) {
  const palette = useAppColors();
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled: Boolean(disabled) }}
      className={`h-8 w-8 items-center justify-center ${className ?? ""}`}
      disabled={disabled}
      hitSlop={8}
      haptic="selection"
      onPress={() => onValueChange(!value)}
      {...props}
    >
      <Ionicons
        name={value ? "checkbox" : "square-outline"}
        size={26}
        color={disabled ? palette.mutedLight : palette.plum}
      />
    </PressableScale>
  );
}
