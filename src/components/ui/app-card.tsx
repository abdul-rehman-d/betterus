import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import useAppColors from "@/hooks/use-app-colors";
import { shadows } from "@/lib/constants";

type Props = PropsWithChildren<ViewProps> & { flush?: boolean };

export default function AppCard({ className, flush = false, style, ...props }: Props) {
  const colors = useAppColors();
  return (
    <View
      className={`rounded-card border ${flush ? "" : "p-5"} ${className ?? ""}`}
      style={[
        styles.card,
        { backgroundColor: colors.white, borderColor: colors.outlineSoft },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({ card: { ...shadows.card, borderWidth: 1 } });
