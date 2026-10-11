import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { shadows } from "@/lib/constants";

type Props = PropsWithChildren<ViewProps> & { flush?: boolean };

export default function AppCard({ className, flush = false, style, ...props }: Props) {
  return (
    <View
      className={`rounded-card border border-white/80 bg-white ${flush ? "" : "p-5"} ${className ?? ""}`}
      style={[styles.card, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({ card: shadows.card });
