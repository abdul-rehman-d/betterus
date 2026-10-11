import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertName, assertPreferences, assertUsername, normalizeUsername } from "./lib";
import schema, {
  genderValidator,
  measurementKeyValidator,
  measurementUnitValidator,
  weightUnitValidator,
} from "./schema";

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  returns: v.object({ available: v.boolean(), normalized: v.string(), valid: v.boolean() }),
  handler: async (ctx, args) => {
    const normalized = normalizeUsername(args.username);
    const valid = /^[a-z0-9_]{3,20}$/.test(normalized);
    if (!valid) return { available: false, normalized, valid };
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", normalized))
      .unique();
    return { available: existing === null, normalized, valid };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    username: v.string(),
    gender: genderValidator,
    timezone: v.string(),
    weightUnit: weightUnitValidator,
    measurementUnit: measurementUnitValidator,
    measurementPreferences: v.array(measurementKeyValidator),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    const username = normalizeUsername(args.username);
    assertUsername(username);
    const name = assertName(args.name);
    assertPreferences(args.measurementPreferences);
    if (!args.timezone.trim()) throw new Error("Timezone is required.");
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
    if (existing) throw new Error("That username is already taken.");
    return await ctx.db.insert("users", { ...args, name, username, updatedAt: Date.now() });
  },
});

export const get = query({
  args: { userId: v.id("users") },
  returns: v.union(schema.doc("users"), v.null()),
  handler: async (ctx, args) => await ctx.db.get("users", args.userId),
});

export const updateProfile = mutation({
  args: { userId: v.id("users"), name: v.string(), gender: genderValidator },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get("users", args.userId);
    if (!user) throw new Error("Profile not found.");
    await ctx.db.patch("users", args.userId, {
      name: assertName(args.name),
      gender: args.gender,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const updateUnits = mutation({
  args: {
    userId: v.id("users"),
    weightUnit: weightUnitValidator,
    measurementUnit: measurementUnitValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get("users", args.userId);
    if (!user) throw new Error("Profile not found.");
    await ctx.db.patch("users", args.userId, {
      weightUnit: args.weightUnit,
      measurementUnit: args.measurementUnit,
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const updateMeasurementPreferences = mutation({
  args: { userId: v.id("users"), measurementPreferences: v.array(measurementKeyValidator) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get("users", args.userId);
    if (!user) throw new Error("Profile not found.");
    assertPreferences(args.measurementPreferences);
    await ctx.db.patch("users", args.userId, {
      measurementPreferences: args.measurementPreferences,
      updatedAt: Date.now(),
    });
    return null;
  },
});
