import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import { colors } from "@/lib/constants";
export default function ProgressHeader({ step }: { step: number }) {
  return (
    <View className="mb-4 flex-row items-center gap-4">
      {step > 1 ? (
        <PressableScale
          accessibilityLabel="Go back"
          className="h-12 w-12 items-center justify-center rounded-full border border-outline-soft bg-white"
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={25} color={colors.plum} />
        </PressableScale>
      ) : null}
      <View className="flex-1 flex-row gap-2">
        {[1, 2, 3, 4].map((n) => (
          <Animated.View
            key={n}
            layout={LinearTransition.springify().damping(18)}
            className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-berry" : "bg-petal"}`}
          />
        ))}
      </View>
      <AppText variant="label">{step} of 4</AppText>
    </View>
  );
}
