import { Pressable, Text, View } from "react-native";
type Props<T extends string> = {
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};
export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row rounded-full bg-petal-soft p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={`min-h-12 flex-1 items-center justify-center rounded-full px-2 ${selected ? "bg-berry" : ""}`}
            onPress={() => onChange(option.value)}
          >
            <Text
              className={`text-center font-body-semibold text-sm ${selected ? "text-white" : "text-plum"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
