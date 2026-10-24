import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import useAppColors from "@/hooks/use-app-colors";
import { shadows } from "@/lib/constants";
import AppCard from "./app-card";
import AppText from "./app-text";
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  const palette = useAppColors();
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      className="flex-1 items-center justify-center gap-4 px-8"
      style={{ backgroundColor: palette.background }}
    >
      <View
        className="h-16 w-16 items-center justify-center rounded-3xl"
        style={[styles.card, { backgroundColor: palette.white }]}
      >
        <ActivityIndicator color={palette.berry} />
      </View>
      <AppText className="text-center">{label}</AppText>
    </Animated.View>
  );
}

export function ContentLoading({
  label = "Loading…",
  variant = "card",
}: {
  label?: string;
  variant?: "card" | "chart" | "form" | "profile";
}) {
  const opacity = useSharedValue(0.48);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 0.62;
      return;
    }
    opacity.value = withRepeat(withTiming(0.88, { duration: 850 }), -1, true);
    return () => cancelAnimation(opacity);
  }, [opacity, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cards = variant === "profile" ? ["identity", "units", "measurements"] : [variant];

  return (
    <View accessible accessibilityLabel={label} accessibilityRole="progressbar" className="gap-4">
      {cards.map((card) => (
        <AppCard key={card} className="gap-4">
          <Animated.View style={pulseStyle} className="gap-4">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 rounded-2xl bg-petal-soft" />
              <View className="flex-1 gap-2">
                <View className="h-3 w-24 rounded-full bg-outline-soft" />
                <View className="h-5 w-40 rounded-full bg-petal" />
              </View>
            </View>
            {variant === "chart" ? (
              <View className="h-36 justify-evenly rounded-3xl bg-petal-soft/60 px-4">
                {[0, 1, 2].map((line) => (
                  <View key={line} className="h-px bg-outline" />
                ))}
              </View>
            ) : null}
            {variant === "form" ? (
              <>
                <View className="h-[58px] rounded-[20px] bg-petal-soft" />
                <View className="h-[52px] rounded-full bg-petal" />
              </>
            ) : null}
            {variant === "card" || variant === "profile" ? (
              <View className="h-[52px] rounded-full bg-petal-soft" />
            ) : null}
          </Animated.View>
        </AppCard>
      ))}
    </View>
  );
}
export function EmptyState({
  icon = "chart-line",
  title,
  body,
}: {
  icon?: "chart-line" | "calendar-blank";
  title: string;
  body: string;
}) {
  const palette = useAppColors();
  return (
    <Animated.View
      entering={FadeInDown.duration(380)}
      className="items-center gap-3 rounded-card border p-8"
      style={[styles.card, { backgroundColor: palette.white, borderColor: palette.outlineSoft }]}
    >
      <View className="h-16 w-16 items-center justify-center rounded-3xl bg-petal-soft">
        <MaterialCommunityIcons name={icon} size={31} color={palette.berry} />
      </View>
      <AppText variant="subtitle" className="text-center">
        {title}
      </AppText>
      <AppText className="text-center">{body}</AppText>
    </Animated.View>
  );
}
export function InlineError({ message }: { message: string | null }) {
  const palette = useAppColors();
  return message ? (
    <View className="flex-row items-center gap-2 rounded-2xl bg-danger-soft px-4 py-3">
      <MaterialCommunityIcons name="alert-circle-outline" size={19} color={palette.danger} />
      <AppText accessibilityRole="alert" className="flex-1 text-danger">
        {message}
      </AppText>
    </View>
  ) : null;
}

const styles = StyleSheet.create({ card: shadows.card });
