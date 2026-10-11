import { View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { colors, shadows } from "@/lib/constants";
import PressableScale from "./pressable-scale";

type Props<T extends string> = {
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};
export default function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row rounded-full border border-outline-soft bg-white/70 p-1.5">
      {options.map((option) => (
        <SegmentOption
          key={option.value}
          label={option.label}
          selected={option.value === value}
          onPress={() => onChange(option.value)}
        />
      ))}
    </View>
  );
}

function SegmentOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(selected ? colors.berry : "rgba(255,255,255,0)", {
        duration: 180,
      }),
      transform: [{ scale: withSpring(selected ? 1 : 0.98, { damping: 18, stiffness: 300 }) }],
    }),
    [selected],
  );
  const textStyle = useAnimatedStyle(
    () => ({
      color: withTiming(interpolateColor(selected ? 1 : 0, [0, 1], [colors.plum, colors.white]), {
        duration: 160,
      }),
    }),
    [selected],
  );
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className="min-h-11 flex-1"
      haptic="selection"
      onPress={onPress}
    >
      <Animated.View
        className="min-h-11 flex-1 items-center justify-center rounded-full px-2"
        style={[selected ? shadows.card : undefined, animatedStyle]}
      >
        <Animated.Text className="text-center font-body-semibold text-[13px]" style={textStyle}>
          {label}
        </Animated.Text>
      </Animated.View>
    </PressableScale>
  );
}
