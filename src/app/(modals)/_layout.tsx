import { Stack } from "expo-router";
export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}
