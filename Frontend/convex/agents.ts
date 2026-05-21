import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('demoAgents').order('desc').collect();
  },
});

export const add = mutation({
  args: {
    objectId: v.string(),
    name: v.string(),
    totalExecutions: v.number(),
    successfulExecutions: v.number(),
    failedExecutions: v.number(),
    uptimeScore: v.number(),
    totalVolume: v.number(),
    successRate: v.number(),
    avgSlippage: v.number(),
    isFlagged: v.boolean(),
    badge: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('demoAgents', { ...args, createdAt: Date.now() });
    return { id, ...args };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query('demoAgents').collect();
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: all.length };
  },
});
