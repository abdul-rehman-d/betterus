import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, type PressableProps, Text } from "react-native";
import useNetworkStatus from "@/hooks/use-network-status";
import { colors } from "@/lib/constants";

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
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`min-h-12 flex-row items-center justify-center gap-2 rounded-full px-5 active:opacity-75 ${primary ? "bg-berry" : variant === "secondary" ? "bg-petal-soft" : "bg-transparent"} ${iconOnly ? "w-12 px-0" : ""} ${isDisabled ? "opacity-40" : ""} ${className ?? ""}`}
      disabled={isDisabled}
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
    </Pressable>
  );
}
