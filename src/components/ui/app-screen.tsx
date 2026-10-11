import type { PropsWithChildren } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useNetworkStatus from "@/hooks/use-network-status";
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
  const body = (
    <>
      {isOffline ? (
        <AppText className="rounded-2xl bg-petal px-4 py-3 text-center text-berry">
          You’re offline. Saved data stays visible; edits need a connection.
        </AppText>
      ) : null}
      {children}
    </>
  );
  const content =
    scroll && inSheet ? (
      <View style={styles.sheetContent}>{body}</View>
    ) : scroll ? (
      <ScrollView
        className="flex-1"
        contentContainerClassName={`grow gap-5 px-5 py-5 ${bottomInset ? "pb-10" : ""}`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
    ) : (
      <View className="flex-1 px-5 py-5">{body}</View>
    );
  if (inSheet) return content;
  return (
    <SafeAreaView className={`flex-1 bg-blush ${className ?? ""}`} edges={["top", "left", "right"]}>
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
});
