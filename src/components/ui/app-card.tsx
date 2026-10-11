import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
export default function AppCard({ className, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <View
      className={`rounded-card border border-outline/60 bg-white p-5 shadow-sm ${className ?? ""}`}
      {...props}
    />
  );
}
