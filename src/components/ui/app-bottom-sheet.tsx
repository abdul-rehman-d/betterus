import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import { colors, shadows } from "@/lib/constants";

type Props = PropsWithChildren<{
  onDismiss?: () => void;
  snapPoints?: readonly string[];
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
}>;

function SheetOverlay({ children }: PropsWithChildren) {
  return <FullWindowOverlay>{children}</FullWindowOverlay>;
}

export default function AppBottomSheet({
  children,
  onDismiss = () => router.back(),
  snapPoints = ["72%", "94%"],
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
}: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const points = useMemo(() => [...snapPoints], [snapPoints]);
  const handleDismiss = useCallback(() => {
    Keyboard.dismiss();
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.45}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={points}
        containerComponent={Platform.OS === "ios" ? SheetOverlay : undefined}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        enableContentPanningGesture={enableContentPanningGesture}
        enableDynamicSizing={false}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        onDismiss={handleDismiss}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "none"}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  background: { backgroundColor: colors.background, borderRadius: 32, ...shadows.floating },
  handle: { backgroundColor: colors.outline, width: 42, height: 5 },
});
