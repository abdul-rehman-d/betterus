import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "@/lib/constants";

type Props = PropsWithChildren<{ snapPoints?: readonly string[] }>;

export default function AppBottomSheet({ children, snapPoints = ["72%", "94%"] }: Props) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const points = useMemo(() => [...snapPoints], [snapPoints]);

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.35}
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
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        enablePanDownToClose
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        onDismiss={() => router.back()}
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, overflow: "hidden" },
  background: { backgroundColor: colors.background, borderRadius: 30 },
  handle: { backgroundColor: colors.outline, width: 44 },
});
