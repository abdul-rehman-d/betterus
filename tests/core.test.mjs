import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIsoDate,
  assertSunday,
  assertUsername,
  convertMeasurement,
  convertWeight,
  normalizeUsername,
  roundDisplay,
  todayInTimeZone,
} from "../convex/lib.ts";
import { buildChartGeometry, dateTickOffsets } from "../src/lib/chart.ts";
import { calendarGrid, isSunday } from "../src/lib/dates.ts";
import { formatBodyMetric, roundBodyMetric } from "../src/lib/numbers.ts";
import { buildWeeklyWeightAverages } from "../src/lib/weight-weekly-average.ts";

test("normalizes and validates usernames", () => {
  assert.equal(normalizeUsername("  Better_User  "), "better_user");
  assert.doesNotThrow(() => assertUsername("better_user"));
  assert.throws(() => assertUsername("No spaces"));
});

test("converts units without drift in stored values", () => {
  const kg = 72.4;
  assert.ok(Math.abs(convertWeight(convertWeight(kg, "kg", "lb"), "lb", "kg") - kg) < 1e-9);
  const cm = 81.2;
  assert.ok(
    Math.abs(convertMeasurement(convertMeasurement(cm, "cm", "in"), "in", "cm") - cm) <
      1e-9,
  );
});

test("rounds and formats body metrics to two decimal places", () => {
  assert.equal(roundDisplay(72.456), 72.46);
  assert.equal(roundBodyMetric(72.454), 72.45);
  assert.equal(formatBodyMetric(72.5), "72.50");
});

test("validates logical dates and Sundays", () => {
  assert.doesNotThrow(() => assertIsoDate("2026-10-11"));
  assert.throws(() => assertIsoDate("2026-02-30"));
  assert.doesNotThrow(() => assertSunday("2026-10-11"));
  assert.equal(isSunday("2026-10-11"), true);
  assert.throws(() => assertSunday("2026-10-12"));
});

test("calculates today in a user's timezone", () => {
  const instant = new Date("2026-10-10T21:30:00.000Z");
  assert.equal(todayInTimeZone(instant, "Asia/Karachi"), "2026-10-11");
  assert.equal(todayInTimeZone(instant, "America/Los_Angeles"), "2026-10-10");
});

test("calendar grids are stable six-week ranges", () => {
  const grid = calendarGrid("2026-10-01");
  assert.equal(grid.length, 42);
  assert.equal(grid[0].date, "2026-09-27");
  assert.equal(grid[41].date, "2026-11-07");
});

test("chart geometry handles empty, single, and gapped series", () => {
  const options = {
    startDate: "2026-10-01",
    endDate: "2026-10-11",
    left: 54,
    right: 12,
    top: 14,
    bottom: 35,
  };
  const empty = buildChartGeometry([], 300, 184, options);
  assert.deepEqual(empty.points, []);
  assert.deepEqual(empty.segments, []);
  const single = buildChartGeometry([{ date: "2026-10-11", value: 72 }], 300, 184, options);
  assert.equal(single.points[0].x, 283);
  assert.ok(single.yTicks.some((tick) => tick < 72));
  assert.ok(single.yTicks.some((tick) => tick > 72));
  const gapped = buildChartGeometry(
    [
      { date: "2026-10-01", value: 72 },
      { date: "2026-10-03", value: 71 },
    ],
    300,
    184,
    options,
  );
  assert.equal(gapped.segments.length, 2);
  assert.ok(gapped.points[0].x < gapped.points[1].x);
});

test("date ticks span the selected range, including all-time ranges", () => {
  assert.deepEqual(dateTickOffsets(7), [0, 3, 6]);
  assert.equal(dateTickOffsets(30).at(-1), 29);
  assert.equal(dateTickOffsets(1100).at(-1), 1099);
});

test("weekly weight averages use Monday–Sunday weeks and include partial weeks", () => {
  const weeks = buildWeeklyWeightAverages(
    [
      { date: "2026-10-11", value: 72, unit: "kg" },
      { date: "2026-10-05", value: 70, unit: "kg" },
      { date: "2026-10-12", value: 75, unit: "kg" },
    ],
    "kg",
  );
  assert.deepEqual(
    weeks.map(({ startDate, count, value }) => ({ startDate, count, value })),
    [
      { startDate: "2026-10-05", count: 2, value: 71 },
      { startDate: "2026-10-12", count: 1, value: 75 },
    ],
  );
});
