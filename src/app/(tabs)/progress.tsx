import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View } from "react-native";
import LineChart from "@/components/progress/line-chart";
import AppButton from "@/components/ui/app-button";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import SegmentedControl from "@/components/ui/segmented-control";
import { ContentLoading, EmptyState, InlineError } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { colors, type MeasurementKey, measurementLabel } from "@/lib/constants";
import { startOfRange, toIsoDate } from "@/lib/dates";
import { formatBodyMetric, roundBodyMetric } from "@/lib/numbers";
import { useAllTimeWeightReadings } from "@/hooks/use-all-time-weight-readings";
import { formatWeekSpan, buildWeeklyWeightAverages } from "@/lib/weight-weekly-average";
import { useSession } from "@/providers/session-provider";

type Range = "7" | "30" | "90" | "365";
type WeightView = "daily" | "weekly";

export default function Progress() {
  const { userId } = useSession();
  const [range, setRange] = useState<Range>("30");
  const [weightView, setWeightView] = useState<WeightView>("daily");
  const today = toIsoDate(new Date());
  const dailyRecords = useQuery(
    api.dailyRecords.listProgress,
    userId ? { userId, startDate: startOfRange(today, Number(range)), endDate: today } : "skip",
  );
  const user = useQuery(api.users.get, userId ? { userId } : "skip");
  const allTime = useAllTimeWeightReadings(
    userId,
    today,
    user?.weightUnit ?? null,
    weightView === "weekly" && user !== undefined,
  );

  const dailySeries = useMemo(() => {
    const weight = (dailyRecords ?? []).flatMap((record) =>
      record.weight
        ? [{ date: record.date, value: record.weight.value, unit: record.weight.unit }]
        : [],
    );
    const measurements = new Map<
      MeasurementKey,
      Array<{ date: string; value: number; unit: string }>
    >();
    for (const record of dailyRecords ?? [])
      for (const item of record.measurements)
        measurements.set(item.key, [
          ...(measurements.get(item.key) ?? []),
          { date: record.date, value: item.value, unit: item.unit },
        ]);
    return { weight, measurements };
  }, [dailyRecords]);

  const weeklyAverages = useMemo(
    () =>
      allTime.status === "ready"
        ? buildWeeklyWeightAverages(allTime.readings, user?.weightUnit ?? "kg")
        : [],
    [allTime, user?.weightUnit],
  );
  const loadingDaily = dailyRecords === undefined;
  const loadingWeekly =
    weightView === "weekly" && (allTime.status === "loading" || user === undefined);
  const loading = weightView === "weekly" ? loadingWeekly : loadingDaily;
  const hasDailyData = Boolean(dailySeries.weight.length || dailySeries.measurements.size);

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
        <SegmentedControl<Range>
          value={range}
          onChange={setRange}
          options={[
            { label: "7 days", value: "7" },
            { label: "30 days", value: "30" },
            { label: "90 days", value: "90" },
            { label: "1 year", value: "365" },
          ]}
        />
      ) : null}

      {loading ? (
        <ContentLoading
          label={
            weightView === "weekly" ? "Loading all-time weight history" : "Loading progress graphs"
          }
          variant="chart"
        />
      ) : null}

      {weightView === "weekly" && allTime.status === "error" ? (
        <AppCard className="gap-3">
          <InlineError message={allTime.message} />
          <AppButton label="Try again" variant="secondary" onPress={allTime.retry} />
        </AppCard>
      ) : null}

      {weightView === "daily" && !loadingDaily && !hasDailyData ? (
        <EmptyState
          title="Your trends will appear here"
          body="Add weight or Sunday measurements to build an honest view of your progress."
        />
      ) : null}

      {weightView === "daily" && dailySeries.weight.length ? (
        <ChartCard title="Weight" values={dailySeries.weight} />
      ) : null}
      {weightView === "daily"
        ? Array.from(dailySeries.measurements.entries()).map(([key, values]) => (
            <ChartCard key={key} title={measurementLabel(key)} values={values} />
          ))
        : null}

      {weightView === "weekly" && !loadingWeekly && allTime.status === "ready" ? (
        weeklyAverages.length ? (
          <WeeklyAverageCard values={weeklyAverages} />
        ) : (
          <EmptyState
            title="No weight history yet"
            body="Log a weight to start building your all-time weekly averages."
          />
        )
      ) : null}
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

function WeeklyAverageCard({
  values,
}: {
  values: Array<{
    date: string;
    startDate: string;
    endDate: string;
    value: number;
    unit: string;
    count: number;
  }>;
}) {
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
      <LineChart values={values} />
      <AppText variant="caption">
        Monday–Sunday weeks · {values.length} weeks · each average uses recorded readings only
      </AppText>
      <View className="gap-1 border-t border-outline-soft pt-3">
        <AppText variant="label" className="mb-1 uppercase tracking-wide text-plum">
          Weekly details
        </AppText>
        {[...values].reverse().map((week) => (
          <View
            key={week.startDate}
            accessibilityLabel={`${formatWeekSpan(week.startDate, week.endDate)}, average ${formatBodyMetric(week.value)} ${week.unit}, ${week.count} contributing ${week.count === 1 ? "day" : "days"}`}
            className="flex-row items-center justify-between gap-3 rounded-xl px-2 py-2"
          >
            <View className="flex-1">
              <AppText variant="label">{formatWeekSpan(week.startDate, week.endDate)}</AppText>
              <AppText variant="caption">
                {week.count} contributing {week.count === 1 ? "day" : "days"}
              </AppText>
            </View>
            <AppText variant="label">
              {formatBodyMetric(week.value)} {week.unit}
            </AppText>
          </View>
        ))}
      </View>
    </AppCard>
  );
}
