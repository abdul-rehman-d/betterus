import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import useAppColors from "@/hooks/use-app-colors";
import { colors, shadows } from "@/lib/constants";

type Props = TextInputProps & {
  error?: string;
  helper?: string;
  inSheet?: boolean;
  label?: string;
  suffix?: string;
};

export default function AppTextInput({
  className,
  error,
  helper,
  inSheet = false,
  label,
  style,
  suffix,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const palette = useAppColors();
  const { onBlur, onFocus } = props;
  return (
    <View className="gap-2">
      {label ? (
        <Text className="font-body-semibold text-[15px]" style={{ color: palette.plum }}>
          {label}
        </Text>
      ) : null}
      <View
        className={`min-h-[58px] flex-row items-center rounded-[20px] border px-4 ${error ? "border-danger" : focused ? "border-berry" : "border-outline-soft"}`}
        style={[
          focused ? styles.focused : styles.resting,
          {
            backgroundColor: palette.white,
            borderColor: error ? palette.danger : focused ? palette.berry : palette.outlineSoft,
          },
        ]}
      >
        {inSheet ? (
          <BottomSheetTextInput
            {...props}
            placeholderTextColor={palette.mutedLight}
            style={[styles.sheetInput, { color: palette.plum }, style]}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
          />
        ) : (
          <TextInput
            {...props}
            className={`flex-1 font-body text-base ${className ?? ""}`}
            placeholderTextColor={palette.mutedLight}
            style={[{ color: palette.plum }, style]}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
          />
        )}
        {suffix ? <Text className="font-body-semibold text-muted">{suffix}</Text> : null}
      </View>
      {error || helper ? (
        <Text
          accessibilityRole={error ? "alert" : undefined}
          className={`px-1 font-body text-xs ${error ? "text-danger" : "text-muted"}`}
        >
          {error ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheetInput: {
    flex: 1,
    color: colors.plum,
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
  },
  resting: shadows.card,
  focused: {
    ...shadows.card,
    shadowColor: colors.berry,
    shadowOpacity: 0.13,
  },
});
