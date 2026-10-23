import type { WeightUnit } from "@/lib/constants";
import { addDays, fromIsoDate } from "@/lib/dates";
import { roundBodyMetric } from "@/lib/numbers";

export type WeightReading = { date: string; value: number; unit: WeightUnit };
export type WeeklyWeightAverage = {
  /** Monday of the calendar week; used as the chart's x coordinate. */
  date: string;
  startDate: string;
  endDate: string;
  value: number;
  unit: WeightUnit;
  count: number;
};

const KG_TO_LB = 2.2046226218;

function convertWeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) return value;
  return from === "kg" ? value * KG_TO_LB : value / KG_TO_LB;
}

function mondayOf(date: string) {
  const weekday = fromIsoDate(date).getDay();
  return addDays(date, -((weekday + 6) % 7));
}

/**
 * Average recorded readings per Monday–Sunday week. Units are normalized before
 * averaging, weeks without readings are omitted, and partial weeks are retained.
 */
export function buildWeeklyWeightAverages(
  readings: WeightReading[],
  displayUnit: WeightUnit,
): WeeklyWeightAverage[] {
  const weeks = new Map<string, { total: number; count: number }>();
  for (const reading of readings) {
    const startDate = mondayOf(reading.date);
    const bucket = weeks.get(startDate) ?? { total: 0, count: 0 };
    bucket.total += convertWeight(reading.value, reading.unit, displayUnit);
    bucket.count += 1;
    weeks.set(startDate, bucket);
  }

  return [...weeks.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([startDate, bucket]) => ({
      date: startDate,
      startDate,
      endDate: addDays(startDate, 6),
      value: roundBodyMetric(bucket.total / bucket.count),
      unit: displayUnit,
      count: bucket.count,
    }));
}

export function formatWeekSpan(startDate: string, endDate: string) {
  const start = fromIsoDate(startDate);
  const end = fromIsoDate(endDate);
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString(undefined, {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    year: start.getFullYear() === end.getFullYear() ? undefined : "numeric",
  });
  return `${startLabel}–${endLabel}`;
}
