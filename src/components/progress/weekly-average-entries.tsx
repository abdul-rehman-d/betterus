import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import { colors, shadows } from "@/lib/constants";
import { formatBodyMetric } from "@/lib/numbers";
import { formatWeekSpan, type WeeklyWeightAverage } from "@/lib/weight-weekly-average";

export default function WeeklyAverageEntries({ values }: { values: WeeklyWeightAverage[] }) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const entries = useMemo(() => [...values].reverse(), [values]);
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
    ({ item }: { item: WeeklyWeightAverage }) => (
      <View
        accessibilityLabel={`${formatWeekSpan(item.startDate, item.endDate)}, average ${formatBodyMetric(item.value)} ${item.unit}, ${item.count} contributing ${item.count === 1 ? "day" : "days"}`}
        className="flex-row items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5"
      >
        <View className="flex-1 gap-0.5">
          <AppText variant="label">{formatWeekSpan(item.startDate, item.endDate)}</AppText>
          <AppText variant="caption">
            {item.count} contributing {item.count === 1 ? "day" : "days"}
          </AppText>
        </View>
        <AppText variant="label" className="text-berry">
          {formatBodyMetric(item.value)} {item.unit}
        </AppText>
      </View>
    ),
    [],
  );
  const keyExtractor = useCallback((item: WeeklyWeightAverage) => item.startDate, []);

  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`View all ${entries.length} weekly weight averages`}
        accessibilityHint="Opens a newest-first list of weekly averages"
        className="min-h-11 flex-row items-center justify-center gap-2 rounded-full bg-petal-soft px-4"
        onPress={() => sheetRef.current?.present()}
      >
        <MaterialCommunityIcons name="format-list-bulleted" size={18} color={colors.berry} />
        <AppText variant="label" className="text-berry">
          View weekly averages · {entries.length}
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
            <AppText variant="subtitle">Weekly weight averages</AppText>
            <AppText variant="caption">{entries.length} weeks · newest first</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close weekly averages"
            hitSlop={12}
            onPress={() => sheetRef.current?.dismiss()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <MaterialCommunityIcons name="close" size={20} color={colors.berry} />
          </Pressable>
        </View>
        <BottomSheetFlatList
          data={entries}
          keyExtractor={keyExtractor}
          renderItem={renderEntry}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={Separator}
          showsVerticalScrollIndicator={false}
        />
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
