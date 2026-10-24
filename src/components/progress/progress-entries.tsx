import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, shadows } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";

export type ProgressEntry = { date: string; value: number; unit: string };

/** Reusable dated reading list for any progress series. */
export default function ProgressEntries({
  title,
  values,
}: {
  title: string;
  values: ProgressEntry[];
}) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const entries = useMemo(
    () => [...values].sort((a, b) => b.date.localeCompare(a.date)),
    [values],
  );
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
  const renderEntry = useCallback(
    ({ item }: { item: ProgressEntry }) => (
      <View className="flex-row items-center justify-between rounded-2xl bg-white px-4 py-3.5">
        <View className="flex-1 gap-0.5">
          <AppText variant="label">{formatDate(item.date)}</AppText>
          <AppText variant="caption">Recorded</AppText>
        </View>
        <AppText variant="label" className="text-berry">
          {formatBodyMetric(item.value)} {item.unit}
        </AppText>
      </View>
    ),
    [],
  );
  const keyExtractor = useCallback((item: ProgressEntry) => item.date, []);

  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`View all ${entries.length} ${title.toLowerCase()} entries`}
        accessibilityHint="Opens a newest-first list of dated readings"
        className="min-h-11 flex-row items-center justify-center gap-2 rounded-full bg-petal-soft px-4"
        onPress={() => sheetRef.current?.present()}
      >
        <MaterialCommunityIcons name="format-list-bulleted" size={18} color={colors.berry} />
        <AppText variant="label" className="text-berry">
          View entries · {entries.length}
        </AppText>
      </PressableScale>
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={["72%", "94%"]}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <View className="flex-row items-center justify-between px-5 pb-4 pt-1">
          <View className="gap-1">
            <AppText variant="subtitle">{title} entries</AppText>
            <AppText variant="caption">{entries.length} dated readings · newest first</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close entries"
            hitSlop={12}
            onPress={() => sheetRef.current?.dismiss()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <MaterialCommunityIcons name="close" size={20} color={colors.berry} />
          </Pressable>
        </View>
        {entries.length ? (
          <BottomSheetFlatList
            data={entries}
            keyExtractor={keyExtractor}
            renderItem={renderEntry}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={Separator}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="mx-5 items-center gap-2 rounded-3xl bg-white px-6 py-10">
            <MaterialCommunityIcons name="calendar-blank-outline" size={30} color={colors.berry} />
            <AppText variant="label">No entries in this period</AppText>
            <AppText className="text-center">Recorded values will appear here with their dates.</AppText>
          </View>
        )}
      </BottomSheetModal>
    </>
  );
}

function Separator() {
  return <View className="h-2" />;
}

const styles = StyleSheet.create({
  background: { backgroundColor: colors.background, borderRadius: 32, ...shadows.floating },
  handle: { backgroundColor: colors.outline, width: 42, height: 5 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
});
