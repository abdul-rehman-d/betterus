import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { colors } from "@/lib/constants";
import AppText from "./app-text";
export default function PageHeader({ title, close = false }: { title: string; close?: boolean }) {
  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityLabel={close ? "Close" : "Go back"}
        className="h-11 w-11 items-center justify-center rounded-full bg-petal-soft"
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons
          name={close ? "close" : "arrow-left"}
          size={24}
          color={colors.plum}
        />
      </Pressable>
      <AppText variant="title" className="flex-1">
        {title}
      </AppText>
    </View>
  );
}
