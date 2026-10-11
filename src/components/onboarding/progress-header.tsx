import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { colors } from "@/lib/constants";
import AppText from "@/components/ui/app-text";
export default function ProgressHeader({ step }: { step: number }) {
  return (
    <View className="mb-4 flex-row items-center gap-4">
      <Pressable
        accessibilityLabel="Go back"
        className="h-12 w-12 items-center justify-center rounded-full bg-petal-soft"
        onPress={() => (step > 1 ? router.back() : router.replace("/"))}
      >
        <MaterialCommunityIcons name="arrow-left" size={25} color={colors.plum} />
      </Pressable>
      <View className="flex-1 flex-row gap-2">
        {[1, 2, 3, 4].map((n) => (
          <View
            key={n}
            className={`h-2 flex-1 rounded-full ${n <= step ? "bg-berry" : "bg-petal"}`}
          />
        ))}
      </View>
      <AppText variant="label">{step} of 4</AppText>
    </View>
  );
}
