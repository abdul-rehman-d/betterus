import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { View } from "react-native";
import LineChart from "@/components/progress/line-chart";
import AppCard from "@/components/ui/app-card";
import AppScreen from "@/components/ui/app-screen";
import AppText from "@/components/ui/app-text";
import SegmentedControl from "@/components/ui/segmented-control";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { api } from "@/convex/_generated/api";
import { measurementLabel, type MeasurementKey } from "@/lib/constants";
import { startOfRange, toIsoDate } from "@/lib/dates";
import { formatBodyMetric, roundBodyMetric } from "@/lib/numbers";
import { useSession } from "@/providers/session-provider";

type Range = "7" | "30" | "90" | "365";
export default function Progress() {
  const { userId } = useSession();
  const [range, setRange] = useState<Range>("30");
  const today = toIsoDate(new Date());
  const records = useQuery(
    api.dailyRecords.listProgress,
    userId ? { userId, startDate: startOfRange(today, Number(range)), endDate: today } : "skip",
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
  if (records === undefined) return <LoadingState />;
  const hasData = Boolean(series.weight.length || series.measurements.size);
  return (
    <AppScreen bottomInset={false}>
      <AppText variant="display">Progress</AppText>
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
      {!hasData ? (
        <EmptyState
          title="Your trends will appear here"
          body="Add weight or Sunday measurements to build an honest view of your progress."
        />
      ) : null}
      {series.weight.length ? <ChartCard title="Weight" values={series.weight} /> : null}
      {Array.from(series.measurements.entries()).map(([key, values]) => (
        <ChartCard key={key} title={measurementLabel(key)} values={values} />
      ))}
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
    <AppCard>
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
        <AppText className={change > 0 ? "text-berry" : "text-success"}>
          {change > 0 ? "+" : ""}
          {formatBodyMetric(change)} {latest.unit}
        </AppText>
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
