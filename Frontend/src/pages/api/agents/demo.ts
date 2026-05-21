import type { NextApiRequest, NextApiResponse } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { anyApi } from 'convex/server';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, serverError, sanitizeString, validatePositiveInt } from '../../../lib/api-utils';

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || '';

// In-memory fallback when Convex is not configured
interface DemoAgentEntry {
  id: string;
  objectId: string;
  name: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  uptimeScore: number;
  totalVolume: number;
  successRate: number;
  avgSlippage: number;
  isFlagged: boolean;
  badge: string;
  createdAt: number;
}
const fallbackStore: DemoAgentEntry[] = [];

function getConvex(): ConvexHttpClient | null {
  if (!CONVEX_URL) return null;
  return new ConvexHttpClient(CONVEX_URL);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const convex = getConvex();

    switch (req.method) {
      case 'GET': {
        const { limited, remaining } = checkRateLimit(req, 'relaxed');
        if (limited) return rateLimitResponse(res, 60_000);
        res.setHeader('X-RateLimit-Remaining', String(remaining));

        if (convex) {
          const agents = await convex.query(anyApi.agents.list, {});
          return res.status(200).json({ success: true, count: agents.length, agents });
        }

        const sorted = [...fallbackStore].sort((a, b) => b.createdAt - a.createdAt);
        return res.status(200).json({ success: true, count: sorted.length, agents: sorted });
      }

      case 'POST': {
        const { limited, remaining } = checkRateLimit(req, 'moderate');
        if (limited) return rateLimitResponse(res, 60_000);
        res.setHeader('X-RateLimit-Remaining', String(remaining));

        const body = req.body || {};
        const totalExecs = validatePositiveInt(body.totalExecutions) ?? 0;
        const successes = validatePositiveInt(body.successfulExecutions) ?? 0;
        const failures = validatePositiveInt(body.failedExecutions) ?? 0;
        const volume = validatePositiveInt(body.totalVolume) ?? 0;
        const successRate = validatePositiveInt(body.successRate) ?? 0;
        const slippage = validatePositiveInt(body.avgSlippage) ?? 0;

        const entry = {
          objectId: sanitizeString(body.objectId, 100) || `0xDEMO_${Date.now().toString(36).toUpperCase()}`,
          name: sanitizeString(body.name, 60) || `Demo Agent`,
          totalExecutions: totalExecs,
          successfulExecutions: successes,
          failedExecutions: failures,
          uptimeScore: body.uptimeScore ?? Math.min(100, Math.max(0, successRate)),
          totalVolume: volume,
          successRate,
          avgSlippage: slippage,
          isFlagged: body.isFlagged === true,
          badge: ['none', 'bronze', 'silver', 'gold'].includes(body.badge) ? body.badge : 'none',
        };

        if (convex) {
          const result = await convex.mutation(anyApi.agents.add, entry);
          return res.status(201).json({ success: true, agent: result });
        }

        const fallbackEntry = { id: `demo_${Date.now()}`, ...entry, createdAt: Date.now() };
        fallbackStore.push(fallbackEntry);
        return res.status(201).json({ success: true, agent: fallbackEntry });
      }

      case 'DELETE': {
        const { limited } = checkRateLimit(req, 'strict');
        if (limited) return rateLimitResponse(res, 120_000);

        if (convex) {
          await convex.mutation(anyApi.agents.clear, {});
          return res.status(200).json({ success: true, message: 'Store cleared' });
        }

        fallbackStore.length = 0;
        return res.status(200).json({ success: true, message: 'Store cleared' });
      }

      default:
        return methodNotAllowed(res, ['GET', 'POST', 'DELETE']);
    }
  } catch (error: unknown) {
    serverError(res, error, `${req.method} /api/agents/demo`);
  }
}
