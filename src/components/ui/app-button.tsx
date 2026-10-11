import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { ActivityIndicator, type PressableProps, StyleSheet, Text } from "react-native";
import useNetworkStatus from "@/hooks/use-network-status";
import { colors, shadows } from "@/lib/constants";
import PressableScale from "./pressable-scale";

type Props = PressableProps & {
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
  iconOnly?: boolean;
  label: string;
  loading?: boolean;
  requiresNetwork?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
};

export default function AppButton({
  accessibilityLabel,
  className,
  disabled,
  icon,
  iconOnly = false,
  label,
  loading = false,
  requiresNetwork = false,
  variant = "primary",
  ...props
}: Props) {
  const { isOffline } = useNetworkStatus();
  const isDisabled = disabled || loading || (requiresNetwork && isOffline);
  const primary = variant === "primary";
  const destructive = variant === "destructive";
  const foreground = primary ? colors.white : destructive ? colors.danger : colors.berry;
  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-full border px-5 ${primary ? "border-berry bg-berry" : variant === "secondary" ? "border-outline-soft bg-white" : destructive ? "border-danger/10 bg-danger-soft" : "border-transparent bg-transparent"} ${iconOnly ? "w-[52px] px-0" : ""} ${isDisabled ? "opacity-40" : ""} ${className ?? ""}`}
      disabled={isDisabled}
      haptic={destructive ? "medium" : "light"}
      style={primary ? styles.primary : undefined}
      {...props}
    >
      {loading ? <ActivityIndicator color={foreground} /> : null}
      {!loading && icon ? (
        <MaterialCommunityIcons name={icon} size={20} color={foreground} />
      ) : null}
      {!loading && !iconOnly ? (
        <Text
          className={`font-body-semibold text-[15px] ${primary ? "text-white" : destructive ? "text-danger" : "text-berry"}`}
        >
          {label}
        </Text>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({ primary: shadows.card });
