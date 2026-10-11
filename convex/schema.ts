import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const genderValidator = v.union(
  v.literal("woman"),
  v.literal("man"),
  v.literal("non_binary"),
  v.literal("prefer_not_to_say"),
);

export const weightUnitValidator = v.union(v.literal("kg"), v.literal("lb"));

export const measurementUnitValidator = v.union(v.literal("cm"), v.literal("in"));

export const measurementKeyValidator = v.union(
  v.literal("neck"),
  v.literal("shoulders"),
  v.literal("chest_bust"),
  v.literal("underbust"),
  v.literal("waist"),
  v.literal("abdomen_at_navel"),
  v.literal("hips_glutes"),
  v.literal("biceps_relaxed"),
  v.literal("biceps_flexed"),
  v.literal("forearms"),
  v.literal("thighs"),
  v.literal("calves"),
);

export default defineSchema({
  users: defineTable({
    name: v.string(),
    username: v.string(),
    gender: genderValidator,
    timezone: v.string(),
    weightUnit: weightUnitValidator,
    measurementUnit: measurementUnitValidator,
    measurementPreferences: v.array(measurementKeyValidator),
    updatedAt: v.number(),
  }).index("by_username", ["username"]),

  dailyRecords: defineTable({
    userId: v.id("users"),
    date: v.string(),
    weight: v.optional(
      v.object({
        value: v.number(),
        unit: weightUnitValidator,
        recordedAt: v.number(),
      }),
    ),
    measurements: v.optional(
      v.array(
        v.object({
          key: measurementKeyValidator,
          value: v.number(),
          unit: measurementUnitValidator,
          recordedAt: v.number(),
        }),
      ),
    ),
    updatedAt: v.number(),
  }).index("by_userId_and_date", ["userId", "date"]),
});
