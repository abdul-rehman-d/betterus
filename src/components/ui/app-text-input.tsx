import { Text, TextInput, type TextInputProps, View } from "react-native";

type Props = TextInputProps & { error?: string; helper?: string; label?: string; suffix?: string };

export default function AppTextInput({ className, error, helper, label, suffix, ...props }: Props) {
  return (
    <View className="gap-2">
      {label ? <Text className="font-body-semibold text-[15px] text-plum">{label}</Text> : null}
      <View
        className={`min-h-[54px] flex-row items-center rounded-2xl border bg-white px-4 ${error ? "border-danger" : "border-outline"}`}
      >
        <TextInput
          className={`flex-1 font-body text-base text-plum ${className ?? ""}`}
          placeholderTextColor="#9A7E87"
          {...props}
        />
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
