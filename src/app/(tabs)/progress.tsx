import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, useReducedMotion } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import LineChart from "@/components/progress/line-chart";
import ProgressEntries from "@/components/progress/progress-entries";
import WeeklyAverageEntries from "@/components/progress/weekly-average-entries";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import PressableScale from "@/components/ui/pressable-scale";
import SegmentedControl from "@/components/ui/segmented-control";
import { ContentLoading, EmptyState, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, type MeasurementKey, measurementLabel } from "@/lib/constants";
import { addDays, formatDate, isSunday, startOfRange, toIsoDate } from "@/lib/dates";
import { formatBodyMetric, roundBodyMetric } from "@/lib/numbers";
import { useAllTimeWeightReadings } from "@/hooks/use-all-time-weight-readings";
import { buildWeeklyWeightAverages, type WeeklyWeightAverage } from "@/lib/weight-weekly-average";
import { useSession } from "@/providers/session-provider";

type Range = "7" | "30" | "90" | "365";
type WeightView = "daily" | "weekly";
export default function Progress() {
  const { userId } = useSession();
  const [range, setRange] = useState<Range>("30");
  const [weightView, setWeightView] = useState<WeightView>("daily");
  const [measurementsExpanded, setMeasurementsExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const today = toIsoDate(new Date());
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const [endDate, setEndDate] = useState(today);
  const startDate = startOfRange(endDate, Number(range));
  const changeRange = (nextRange: Range) => {
    setRange(nextRange);
    setEndDate(today);
  };
  const moveWindow = (direction: -1 | 1) => {
    setEndDate((currentEnd) => {
      const shiftedEnd = addDays(currentEnd, direction * Number(range));
      return direction > 0 && shiftedEnd > today ? today : shiftedEnd;
    });
  };
  const swipe = Gesture.Pan()
    .activeOffsetX([-18, 18])
    .failOffsetY([-12, 12])
    .runOnJS(true)
    .onEnd((event) => {
      if (Math.abs(event.translationX) < 56 && Math.abs(event.velocityX) < 500) return;
      moveWindow(event.translationX < 0 ? -1 : 1);
    });
  const records = useQuery(
    api.dailyRecords.listProgress,
    userId ? { userId, startDate, endDate } : "skip",
  );
  const allTime = useAllTimeWeightReadings(
    userId,
    today,
    user?.weightUnit ?? null,
    weightView === "weekly" && user !== undefined,
  );
  const series = useMemo(() => {
    const weight = (records ?? []).flatMap((record) =>
      record.weight
        ? [{ date: record.date, value: record.weight.value, unit: record.weight.unit }]
        : [],
    );
    const measurements = new Map<
      MeasurementKey,
      Array<{ date: string; value: number; unit: string }>
    >();
    for (const record of records ?? [])
      for (const item of record.measurements)
        measurements.set(item.key, [
          ...(measurements.get(item.key) ?? []),
          { date: record.date, value: item.value, unit: item.unit },
        ]);
    return { weight, measurements };
  }, [records]);
  const loading = records === undefined;
  const hasData = Boolean(series.weight.length || series.measurements.size);
  const weeklyAverages = useMemo(
    () =>
      allTime.status === "ready"
        ? buildWeeklyWeightAverages(allTime.readings, user?.weightUnit ?? "kg")
        : [],
    [allTime, user?.weightUnit],
  );
  const loadingWeekly =
    weightView === "weekly" && (allTime.status === "loading" || user === undefined);
  const measurementEntries = useMemo(() => {
    const entries = Array.from(series.measurements.entries());
    const preferenceOrder = user?.measurementPreferences ?? [];
    return entries.sort(([left], [right]) => {
      const leftIndex = preferenceOrder.indexOf(left);
      const rightIndex = preferenceOrder.indexOf(right);
      return (
        (leftIndex < 0 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex < 0 ? Number.MAX_SAFE_INTEGER : rightIndex)
      );
    });
  }, [series.measurements, user?.measurementPreferences]);
  const latestMeasurement = measurementEntries
    .flatMap(([key, values]) => {
      const latest = values.at(-1);
      return latest ? [{ key, ...latest }] : [];
    })
    .sort((left, right) => right.date.localeCompare(left.date))[0];
  return (
    <AppScreen bottomInset={false}>
      <View className="gap-2">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-petal-soft">
            <MaterialCommunityIcons
              name="chart-timeline-variant-shimmer"
              size={15}
              color={colors.berry}
            />
          </View>
          <AppText variant="label" className="uppercase tracking-[1.5px] text-berry">
            Your trends
          </AppText>
        </View>
        <AppText variant="display">Progress</AppText>
        <AppText>Small entries add up. See how your body changes over time.</AppText>
      </View>
      <View className="gap-2">
        <AppText variant="label" className="uppercase tracking-wide text-plum">
          Weight view
        </AppText>
        <SegmentedControl<WeightView>
          value={weightView}
          onChange={setWeightView}
          options={[
            { label: "Daily", value: "daily" },
            { label: "Weekly average · All time", value: "weekly" },
          ]}
        />
      </View>
      {weightView === "daily" ? (
        <>
          <SegmentedControl<Range>
            value={range}
            onChange={changeRange}
            options={[
              { label: "7 days", value: "7" },
              { label: "30 days", value: "30" },
              { label: "90 days", value: "90" },
              { label: "1 year", value: "365" },
            ]}
          />
          <GestureDetector gesture={swipe}>
            <View
              accessibilityRole="adjustable"
              accessibilityLabel={`${range} day progress, ${formatDate(startDate)} to ${formatDate(endDate)}`}
              accessibilityActions={[
                { name: "decrement", label: "Earlier period" },
                { name: "increment", label: "Later period" },
              ]}
              onAccessibilityAction={(event) =>
                moveWindow(event.nativeEvent.actionName === "decrement" ? -1 : 1)
              }
            >
              <AppText variant="caption" className="text-center">
                {formatDate(startDate, { month: "short", day: "numeric", year: "numeric" })} –{" "}
                {formatDate(endDate, { month: "short", day: "numeric", year: "numeric" })}
              </AppText>
              {loading ? <ContentLoading label="Loading progress graphs" variant="chart" /> : null}
              {!loading && !hasData ? (
                <EmptyState
                  title="Your trends will appear here"
                  body="Add weight or Sunday measurements to build an honest view of your progress."
                />
              ) : null}
              {!loading && series.weight.length ? (
                <ChartCard
                  title="Weight"
                  values={series.weight}
                  startDate={startDate}
                  endDate={endDate}
                  maxGapDays={1.5}
                />
              ) : null}
              {!loading ? (
                <AppCard className="gap-4">
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ expanded: measurementsExpanded }}
                    accessibilityLabel={`Measurements, ${measurementEntries.length} ${measurementEntries.length === 1 ? "type" : "types"}${latestMeasurement ? `, latest ${measurementLabel(latestMeasurement.key)} ${formatBodyMetric(latestMeasurement.value)} ${latestMeasurement.unit}` : ""}`}
                    className="min-h-12 flex-row items-center gap-3"
                    onPress={() => setMeasurementsExpanded((expanded) => !expanded)}
                  >
                    <View className="h-11 w-11 items-center justify-center rounded-2xl bg-petal-soft">
                      <MaterialCommunityIcons name="tape-measure" size={22} color={colors.berry} />
                    </View>
                    <View className="flex-1 gap-0.5">
                      <AppText variant="subtitle">Measurements</AppText>
                      <AppText variant="caption">
                        {latestMeasurement
                          ? `${measurementEntries.length} tracked · Latest ${measurementLabel(latestMeasurement.key)} ${formatBodyMetric(latestMeasurement.value)} ${latestMeasurement.unit}`
                          : "No measurements in this range"}
                      </AppText>
                    </View>
                    <AppText variant="caption" className="text-berry">
                      {measurementEntries.length}
                    </AppText>
                    <MaterialCommunityIcons
                      name={measurementsExpanded ? "chevron-up" : "chevron-down"}
                      size={22}
                      color={colors.muted}
                    />
                  </PressableScale>
                  {measurementsExpanded ? (
                    <Animated.View
                      entering={reduceMotion ? undefined : FadeInDown.duration(220)}
                      className="gap-4"
                    >
                      {measurementEntries.length ? (
                        measurementEntries.map(([key, values]) => (
                          <ChartCard
                            key={key}
                            title={measurementLabel(key)}
                            values={values}
                            startDate={startDate}
                            endDate={endDate}
                            maxGapDays={9}
                          />
                        ))
                      ) : (
                        <View className="gap-3 rounded-2xl bg-petal-soft/60 p-4">
                          <AppText variant="subtitle">No measurements in this range</AppText>
                          <AppText variant="caption">
                            Log your measurements on a Sunday to see how they change over time.
                          </AppText>
                          <AppButton
                            label="Log measurements"
                            icon="plus"
                            onPress={() => {
                              const date = new Date();
                              while (!isSunday(toIsoDate(date))) date.setDate(date.getDate() - 1);
                              router.push({
                                pathname: "/(modals)/measurements",
                                params: { date: toIsoDate(date) },
                              });
                            }}
                          />
                        </View>
                      )}
                    </Animated.View>
                  ) : null}
                </AppCard>
              ) : null}
            </View>
          </GestureDetector>
        </>
      ) : (
        <>
          {loadingWeekly ? (
            <ContentLoading label="Loading all-time weight history" variant="chart" />
          ) : null}
          {allTime.status === "error" ? (
            <AppCard className="gap-3">
              <InlineError message={allTime.message} />
              <AppButton label="Try again" variant="secondary" onPress={allTime.retry} />
            </AppCard>
          ) : null}
          {!loadingWeekly && allTime.status === "ready" ? (
            weeklyAverages.length ? (
              <WeeklyAverageCard values={weeklyAverages} />
            ) : (
              <EmptyState
                title="No weight history yet"
                body="Log a weight to start building your all-time weekly averages."
              />
            )
          ) : null}
        </>
      )}
    </AppScreen>
  );
}
function ChartCard({
  title,
  values,
  startDate,
  endDate,
  maxGapDays,
}: {
  title: string;
  values: Array<{ date: string; value: number; unit: string }>;
  startDate: string;
  endDate: string;
  maxGapDays: number;
}) {
  const orderedValues = [...values].sort((a, b) => a.date.localeCompare(b.date));
  const first = orderedValues[0];
  const latest = orderedValues.at(-1) ?? first;
  const change = roundBodyMetric(latest.value - first.value);
  return (
    <AppCard className="gap-2 overflow-hidden">
      <View className="flex-row items-end justify-between">
        <View>
          <AppText variant="label" className="uppercase text-berry">
            {title}
          </AppText>
          <View className="flex-row items-end gap-1">
            <AppText variant="metric">{formatBodyMetric(latest.value)}</AppText>
            <AppText className="mb-1">{latest.unit}</AppText>
          </View>
        </View>
        <View
          className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${change > 0 ? "bg-petal-soft" : "bg-success-soft"}`}
        >
          <MaterialCommunityIcons
            name={change > 0 ? "trending-up" : change < 0 ? "trending-down" : "minus"}
            size={16}
            color={change > 0 ? colors.berry : colors.success}
          />
          <AppText variant="label" className={change > 0 ? "text-berry" : "text-success"}>
            {change > 0 ? "+" : ""}
            {formatBodyMetric(change)} {latest.unit}
          </AppText>
        </View>
      </View>
      <LineChart
        title={title}
        values={orderedValues}
        startDate={startDate}
        endDate={endDate}
        maxGapDays={maxGapDays}
      />
      <ProgressEntries title={title} values={orderedValues} />
      <AppText variant="caption">
        {values.length === 1
          ? "One entry in this range"
          : `${values.length} entries · missing dates are left as gaps`}
      </AppText>
    </AppCard>
  );
}

function WeeklyAverageCard({ values }: { values: WeeklyWeightAverage[] }) {
  const first = values[0];
  const latest = values.at(-1) ?? first;
  const change = roundBodyMetric(latest.value - first.value);
  return (
    <AppCard className="gap-3 overflow-hidden">
      <View className="flex-row items-end justify-between">
        <View>
          <AppText variant="label" className="uppercase text-berry">
            Weekly average · All time
          </AppText>
          <View className="flex-row items-end gap-1">
            <AppText variant="metric">{formatBodyMetric(latest.value)}</AppText>
            <AppText className="mb-1">{latest.unit}</AppText>
          </View>
        </View>
        <View className="rounded-full bg-petal-soft px-3 py-1.5">
          <AppText variant="label" className="text-berry">
            {change > 0 ? "+" : ""}
            {formatBodyMetric(change)} {latest.unit}
          </AppText>
        </View>
      </View>
      <LineChart
        title="Weekly average weight"
        values={values}
        startDate={first.date}
        endDate={latest.endDate > toIsoDate(new Date()) ? toIsoDate(new Date()) : latest.endDate}
        maxGapDays={9}
      />
      <AppText variant="caption">
        Monday–Sunday weeks · {values.length} weeks · each average uses recorded readings only
      </AppText>
      <WeeklyAverageEntries values={values} />
    </AppCard>
  );
}
