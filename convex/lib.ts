import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

export const MEASUREMENT_KEYS = [
  "neck",
  "shoulders",
  "chest_bust",
  "underbust",
  "waist",
  "abdomen_at_navel",
  "hips_glutes",
  "biceps_relaxed",
  "biceps_flexed",
  "forearms",
  "thighs",
  "calves",
] as const;

export type MeasurementKey = (typeof MEASUREMENT_KEYS)[number];
export type WeightUnit = "kg" | "lb";
export type MeasurementUnit = "cm" | "in";

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function assertUsername(value: string) {
  if (!/^[a-z0-9_]{3,20}$/.test(value)) {
    throw new Error("Username must be 3–20 lowercase letters, numbers, or underscores.");
  }
}

export function assertName(value: string) {
  const name = value.trim();
  if (name.length < 1 || name.length > 50) throw new Error("Name must be 1–50 characters.");
  return name;
}

export function assertIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Date must use YYYY-MM-DD.");
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error("Date is invalid.");
  }
  return parsed;
}

export function assertSunday(value: string) {
  if (assertIsoDate(value).getUTCDay() !== 0)
    throw new Error("Measurements can only be logged on Sunday.");
}

export function todayInTimeZone(now: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

export function assertPositiveFinite(value: number) {
  if (!Number.isFinite(value) || value <= 0) throw new Error("Enter a number greater than zero.");
}

export function assertPreferences(values: readonly MeasurementKey[]) {
  if (values.length < 1) throw new Error("Choose at least one measurement.");
  if (new Set(values).size !== values.length)
    throw new Error("Measurement choices must be unique.");
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit) {
  if (from === to) return value;
  return from === "kg" ? value * 2.2046226218 : value / 2.2046226218;
}

export function convertMeasurement(value: number, from: MeasurementUnit, to: MeasurementUnit) {
  if (from === to) return value;
  return from === "cm" ? value / 2.54 : value * 2.54;
}

export function roundDisplay(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function assertUser(ctx: MutationCtx, userId: Id<"users">) {
  const user = await ctx.db.get("users", userId);
  if (!user) throw new Error("Profile not found.");
  return user;
}

export async function upsertDailyRecord(
  ctx: MutationCtx,
  userId: Id<"users">,
  date: string,
  update: (record: Doc<"dailyRecords"> | null) => {
    weight?: Doc<"dailyRecords">["weight"];
    measurements?: Doc<"dailyRecords">["measurements"];
  },
) {
  assertIsoDate(date);
  const existing = await ctx.db
    .query("dailyRecords")
    .withIndex("by_userId_and_date", (q) => q.eq("userId", userId).eq("date", date))
    .unique();
  const next = update(existing);
  const hasWeight = next.weight !== undefined;
  const hasMeasurements = Boolean(next.measurements?.length);
  if (!hasWeight && !hasMeasurements) {
    if (existing) await ctx.db.delete("dailyRecords", existing._id);
    return null;
  }
  const payload = { ...next, updatedAt: Date.now() };
  if (existing) {
    await ctx.db.replace("dailyRecords", existing._id, { userId, date, ...payload });
    return existing._id;
  }
  return await ctx.db.insert("dailyRecords", { userId, date, ...payload });
}
