import * as Haptics from "expo-haptics";
import type { PropsWithChildren } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PropsWithChildren<
  PressableProps & {
    haptic?: "none" | "selection" | "light" | "medium";
    pressedScale?: number;
  }
>;

export default function PressableScale({
  children,
  disabled,
  haptic = "light",
  onPress,
  onPressIn,
  onPressOut,
  pressedScale = 0.975,
  style,
  ...props
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...props}
      disabled={disabled}
      onPress={(event) => {
        if (haptic === "selection") void Haptics.selectionAsync();
        if (haptic === "light") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (haptic === "medium") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.(event);
      }}
      onPressIn={(event) => {
        scale.value = withSpring(pressedScale, { damping: 18, stiffness: 420 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, { damping: 16, stiffness: 360 });
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
