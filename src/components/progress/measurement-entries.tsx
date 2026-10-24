import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import { colors, type MeasurementKey, measurementLabel, shadows } from "@/lib/constants";
import { formatDate } from "@/lib/dates";
import { formatBodyMetric } from "@/lib/numbers";

type MeasurementEntry = {
  key: MeasurementKey;
  date: string;
  value: number;
  unit: string;
};
export default function MeasurementEntries({ values }: { values: MeasurementEntry[] }) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [filter, setFilter] = useState<MeasurementKey>(values[0]?.key ?? "waist");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const types = useMemo(() => [...new Set(values.map((entry) => entry.key))], [values]);
  const selectedFilter = types.includes(filter) ? filter : (types[0] ?? filter);
  const entries = useMemo(
    () =>
      values
        .filter((entry) => entry.key === selectedFilter)
        .sort((left, right) => right.date.localeCompare(left.date)),
    [selectedFilter, values],
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
    ({ item }: { item: MeasurementEntry }) => (
      <View className="flex-row items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5">
        <View className="flex-1 gap-0.5">
          <AppText variant="label">{measurementLabel(item.key)}</AppText>
          <AppText variant="caption">{formatDate(item.date)}</AppText>
        </View>
        <AppText variant="label" className="text-berry">
          {formatBodyMetric(item.value)} {item.unit}
        </AppText>
      </View>
    ),
    [],
  );
  const keyExtractor = useCallback((item: MeasurementEntry) => `${item.date}:${item.key}`, []);

  return (
    <>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="View measurement entries"
        accessibilityHint="Opens a dated list with a measurement filter"
        className="min-h-11 flex-row items-center justify-center gap-2 rounded-full bg-petal-soft px-4"
        onPress={() => {
          setFilter(types[0] ?? filter);
          setFilterExpanded(false);
          sheetRef.current?.present();
        }}
      >
        <MaterialCommunityIcons name="format-list-bulleted" size={18} color={colors.berry} />
        <AppText variant="label" className="text-berry">
          View measurement entries
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
        <View className="flex-row items-center justify-between px-5 pb-3 pt-1">
          <View className="flex-1 gap-1">
            <AppText variant="subtitle">Measurement entries</AppText>
            <AppText variant="caption">{entries.length} dated values · newest first</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close measurement entries"
            hitSlop={12}
            onPress={() => sheetRef.current?.dismiss()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
          >
            <MaterialCommunityIcons name="close" size={20} color={colors.berry} />
          </Pressable>
        </View>
        <View className="px-5 pb-3">
          <PressableScale
            accessibilityRole="button"
            accessibilityState={{ expanded: filterExpanded }}
            accessibilityLabel={`Filter measurements: ${measurementLabel(selectedFilter)}`}
            className="min-h-11 flex-row items-center justify-between rounded-2xl border border-outline-soft bg-white px-4"
            onPress={() => setFilterExpanded((expanded) => !expanded)}
          >
            <AppText variant="label">{measurementLabel(selectedFilter)}</AppText>
            <MaterialCommunityIcons
              name={filterExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.berry}
            />
          </PressableScale>
          {filterExpanded ? (
            <BottomSheetScrollView
              style={styles.filterList}
              className="mt-2 rounded-2xl border border-outline-soft bg-white"
              nestedScrollEnabled
            >
              {types.map((option) => (
                <PressableScale
                  key={option}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedFilter === option }}
                  className="min-h-11 flex-row items-center justify-between px-4 py-2"
                  onPress={() => {
                    setFilter(option);
                    setFilterExpanded(false);
                  }}
                >
                  <AppText
                    variant="label"
                    className={selectedFilter === option ? "text-berry" : ""}
                  >
                    {measurementLabel(option)}
                  </AppText>
                  {selectedFilter === option ? (
                    <MaterialCommunityIcons name="check" size={18} color={colors.berry} />
                  ) : null}
                </PressableScale>
              ))}
            </BottomSheetScrollView>
          ) : null}
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
  filterList: { maxHeight: 216 },
  list: { paddingHorizontal: 20, paddingBottom: 32 },
});
