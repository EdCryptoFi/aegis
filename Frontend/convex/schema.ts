import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  demoAgents: defineTable({
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
    createdAt: v.number(),
  }),
});
