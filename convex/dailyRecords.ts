import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  assertIsoDate,
  assertPositiveFinite,
  assertSunday,
  assertUser,
  convertMeasurement,
  convertWeight,
  type MeasurementKey,
  roundDisplay,
  upsertDailyRecord,
} from "./lib";
import { measurementKeyValidator, measurementUnitValidator, weightUnitValidator } from "./schema";

const measurementResultValidator = v.object({
  key: measurementKeyValidator,
  value: v.number(),
  unit: measurementUnitValidator,
  recordedAt: v.number(),
});

const recordResultValidator = v.object({
  date: v.string(),
  weight: v.optional(
    v.object({ value: v.number(), unit: weightUnitValidator, recordedAt: v.number() }),
  ),
  measurements: v.array(measurementResultValidator),
});

function presentRecord(
  record: {
    date: string;
    weight?: { value: number; unit: "kg" | "lb"; recordedAt: number };
    measurements?: Array<{
      key: MeasurementKey;
      value: number;
      unit: "cm" | "in";
      recordedAt: number;
    }>;
  },
  user: { weightUnit: "kg" | "lb"; measurementUnit: "cm" | "in" },
) {
  return {
    date: record.date,
    weight: record.weight
      ? {
          value: roundDisplay(
            convertWeight(record.weight.value, record.weight.unit, user.weightUnit),
          ),
          unit: user.weightUnit,
          recordedAt: record.weight.recordedAt,
        }
      : undefined,
    measurements: (record.measurements ?? []).map((measurement) => ({
      ...measurement,
      value: roundDisplay(
        convertMeasurement(measurement.value, measurement.unit, user.measurementUnit),
      ),
      unit: user.measurementUnit,
    })),
  };
}

export const getByDate = query({
  args: { userId: v.id("users"), date: v.string() },
  returns: v.union(recordResultValidator, v.null()),
  handler: async (ctx, args) => {
    assertIsoDate(args.date);
    const user = await ctx.db.get("users", args.userId);
    if (!user) return null;
    const record = await ctx.db
      .query("dailyRecords")
      .withIndex("by_userId_and_date", (q) => q.eq("userId", args.userId).eq("date", args.date))
      .unique();
    return record ? presentRecord(record, user) : null;
  },
});

export const listRange = query({
  args: { userId: v.id("users"), startDate: v.string(), endDate: v.string() },
  returns: v.array(recordResultValidator),
  handler: async (ctx, args) => {
    assertIsoDate(args.startDate);
    assertIsoDate(args.endDate);
    if (args.startDate > args.endDate) throw new Error("Start date must be before end date.");
    const user = await ctx.db.get("users", args.userId);
    if (!user) return [];
    const records = await ctx.db
      .query("dailyRecords")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", args.userId).gte("date", args.startDate).lte("date", args.endDate),
      )
      .take(370);
    return records.map((record) => presentRecord(record, user));
  },
});

export const listProgress = query({
  args: { userId: v.id("users"), startDate: v.string(), endDate: v.string() },
  returns: v.array(recordResultValidator),
  handler: async (ctx, args) => {
    assertIsoDate(args.startDate);
    assertIsoDate(args.endDate);
    if (args.startDate > args.endDate) throw new Error("Start date must be before end date.");
    const user = await ctx.db.get("users", args.userId);
    if (!user) return [];
    const records = await ctx.db
      .query("dailyRecords")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", args.userId).gte("date", args.startDate).lte("date", args.endDate),
      )
      .take(370);
    return records.map((record) => presentRecord(record, user));
  },
});

export const setWeight = mutation({
  args: { userId: v.id("users"), date: v.string(), value: v.number(), unit: weightUnitValidator },
  returns: v.null(),
  handler: async (ctx, args) => {
    await assertUser(ctx, args.userId);
    assertPositiveFinite(args.value);
    await upsertDailyRecord(ctx, args.userId, args.date, (record) => ({
      weight: { value: roundDisplay(args.value), unit: args.unit, recordedAt: Date.now() },
      measurements: record?.measurements,
    }));
    return null;
  },
});

export const removeWeight = mutation({
  args: { userId: v.id("users"), date: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await assertUser(ctx, args.userId);
    await upsertDailyRecord(ctx, args.userId, args.date, (record) => ({
      measurements: record?.measurements,
    }));
    return null;
  },
});

export const setMeasurements = mutation({
  args: {
    userId: v.id("users"),
    date: v.string(),
    measurements: v.array(
      v.object({ key: measurementKeyValidator, value: v.number(), unit: measurementUnitValidator }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await assertUser(ctx, args.userId);
    assertSunday(args.date);
    if (new Set(args.measurements.map((item) => item.key)).size !== args.measurements.length) {
      throw new Error("Each measurement can only be entered once.");
    }
    for (const item of args.measurements) assertPositiveFinite(item.value);
    await upsertDailyRecord(ctx, args.userId, args.date, (record) => ({
      weight: record?.weight,
      measurements: args.measurements.map((item) => ({
        ...item,
        value: roundDisplay(item.value),
        recordedAt: Date.now(),
      })),
    }));
    return null;
  },
});

export const removeMeasurement = mutation({
  args: { userId: v.id("users"), date: v.string(), key: measurementKeyValidator },
  returns: v.null(),
  handler: async (ctx, args) => {
    await assertUser(ctx, args.userId);
    assertSunday(args.date);
    await upsertDailyRecord(ctx, args.userId, args.date, (record) => ({
      weight: record?.weight,
      measurements: record?.measurements?.filter((item) => item.key !== args.key),
    }));
    return null;
  },
});
