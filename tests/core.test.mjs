import assert from "node:assert/strict";
import test from "node:test";
import {
  assertIsoDate,
  assertSunday,
  assertUsername,
  convertMeasurement,
  convertWeight,
  normalizeUsername,
  todayInTimeZone,
} from "../convex/lib.ts";
import { buildChartGeometry } from "../src/lib/chart.ts";
import { calendarGrid, isSunday } from "../src/lib/dates.ts";

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
  assert.deepEqual(buildChartGeometry([], 300), { path: "", points: [] });
  assert.equal(buildChartGeometry([{ date: "2026-10-11", value: 72 }], 300).points[0].x, 150);
  const gapped = buildChartGeometry(
    [
      { date: "2026-10-01", value: 72 },
      { date: "2026-10-03", value: 71 },
    ],
    300,
  );
  assert.equal(gapped.path.split("M").length - 1, 2);
});
