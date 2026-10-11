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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, bottomInset && styles.scrollBottomInset]}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        {body}
      </ScrollView>
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
  scroll: { flex: 1 },
  scrollBottomInset: { paddingBottom: 40 },
  scrollContent: { flexGrow: 1, gap: 20, paddingHorizontal: 20, paddingVertical: 20 },
});
