import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { View } from "react-native";
import useAppColors from "@/hooks/use-app-colors";
import AppText from "./app-text";
import PressableScale from "./pressable-scale";
export default function PageHeader({ title, close = false }: { title: string; close?: boolean }) {
  const palette = useAppColors();
  const { dismiss } = useBottomSheetModal();
  return (
    <View className="flex-row items-center gap-3">
      <PressableScale
        accessibilityLabel={close ? "Close" : "Go back"}
        className="h-12 w-12 items-center justify-center rounded-full border border-outline-soft"
        style={{ backgroundColor: palette.white }}
        haptic="light"
        onPress={() => (close ? dismiss() : router.back())}
      >
        <MaterialCommunityIcons
          name={close ? "close" : "arrow-left"}
          size={24}
          color={palette.plum}
        />
      </PressableScale>
      <AppText variant="title" className="flex-1">
        {title}
      </AppText>
    </View>
  );
}
