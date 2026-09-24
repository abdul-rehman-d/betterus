import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  handler(ctx, args) {
    return ctx.db.insert("tasks", {
      text: args.text,
      is_completed: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    is_completed: v.boolean(),
  },
  handler(ctx, args) {
    return ctx.db.patch("tasks", args.id, {
      is_completed: args.is_completed,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler(ctx, args) {
    return ctx.db.delete("tasks", args.id);
  },
});
