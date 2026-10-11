import { LinearGradient } from "expo-linear-gradient";
import { Children, isValidElement, type PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useNetworkStatus from "@/hooks/use-network-status";
import { colors } from "@/lib/constants";
import AppText from "./app-text";

type Props = PropsWithChildren<ViewProps> & {
  bottomInset?: boolean;
  inSheet?: boolean;
  scroll?: boolean;
};
export default function AppScreen({
  children,
  className,
  scroll = true,
  bottomInset = true,
  inSheet = false,
}: Props) {
  const { isOffline } = useNetworkStatus();
  const reduceMotion = useReducedMotion();
  const body = (
    <>
      {isOffline ? (
        <View className="flex-row items-center rounded-2xl border border-outline-soft bg-white px-4 py-3">
          <View className="mr-3 h-2.5 w-2.5 rounded-full bg-gold" />
          <AppText className="flex-1">
            You’re offline. Saved data stays visible; edits need a connection.
          </AppText>
        </View>
      ) : null}
      {Children.toArray(children).map((child, index) => (
        <Animated.View
          key={isValidElement(child) ? child.key : String(child)}
          entering={
            reduceMotion
              ? undefined
              : FadeInDown.delay(Math.min(index, 6) * 55)
                  .duration(420)
                  .withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] })
          }
        >
          {child}
        </Animated.View>
      ))}
    </>
  );
  const content =
    scroll && inSheet ? (
      <View style={styles.sheetContent}>{body}</View>
    ) : scroll ? (
      <ScrollView
        className="flex-1"
        contentContainerClassName={`grow gap-6 px-5 pt-5 ${bottomInset ? "pb-12" : "pb-32"}`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
    ) : (
      <View className="flex-1 gap-6 px-5 py-5">{body}</View>
    );
  if (inSheet) return content;
  return (
    <SafeAreaView className={`flex-1 bg-blush ${className ?? ""}`} edges={["top", "left", "right"]}>
      <LinearGradient
        colors={[colors.background, colors.backgroundDeep, colors.background]}
        locations={[0, 0.58, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheetContent: { gap: 20 },
  glow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255, 215, 228, 0.42)",
  },
  glowTop: { top: -130, right: -90 },
  glowBottom: { bottom: 80, left: -170, opacity: 0.45 },
});
