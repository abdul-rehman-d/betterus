import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import LineChart from "@/components/progress/line-chart";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import SegmentedControl from "@/components/ui/segmented-control";
import { ContentLoading, EmptyState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, type MeasurementKey, measurementLabel } from "@/lib/constants";
import { addDays, formatDate, startOfRange, toIsoDate } from "@/lib/dates";
import { formatBodyMetric, roundBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

type Range = "7" | "30" | "90" | "365";
export default function Progress() {
  const { userId } = useSession();
  const [range, setRange] = useState<Range>("30");
  const today = toIsoDate(new Date());
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
            <ChartCard title="Weight" values={series.weight} />
          ) : null}
          {!loading
            ? Array.from(series.measurements.entries()).map(([key, values]) => (
                <ChartCard key={key} title={measurementLabel(key)} values={values} />
              ))
            : null}
        </View>
      </GestureDetector>
    </AppScreen>
  );
}
function ChartCard({
  title,
  values,
}: {
  title: string;
  values: Array<{ date: string; value: number; unit: string }>;
}) {
  const first = values[0];
  const latest = values.at(-1) ?? first;
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
      <LineChart values={values} />
      <AppText variant="caption">
        {values.length === 1
          ? "One entry in this range"
          : `${values.length} entries · missing dates are left as gaps`}
      </AppText>
    </AppCard>
  );
}
