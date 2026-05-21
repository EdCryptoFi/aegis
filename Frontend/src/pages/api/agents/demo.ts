import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, serverError, sanitizeString, validatePositiveInt } from '../../../lib/api-utils';

const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL || '';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { limited, remaining } = checkRateLimit(req, 'relaxed');
        if (limited) return rateLimitResponse(res, 60_000);
        res.setHeader('X-RateLimit-Remaining', String(remaining));

        if (CONVEX_SITE_URL) {
          const upstream = await fetch(`${CONVEX_SITE_URL}/agents`);
          const data = await upstream.json();
          return res.status(200).json(data);
        }

        const sorted = [...fallbackStore].sort((a, b) => b.createdAt - a.createdAt);
        return res.status(200).json({ success: true, count: sorted.length, agents: sorted });
      }

      case 'POST': {
        const { limited, remaining } = checkRateLimit(req, 'moderate');
        if (limited) return rateLimitResponse(res, 60_000);
        res.setHeader('X-RateLimit-Remaining', String(remaining));

        const body = req.body || {};
        const entry = {
          objectId: sanitizeString(body.objectId, 100) || `0xDEMO_${Date.now().toString(36).toUpperCase()}`,
          name: sanitizeString(body.name, 60) || 'Demo Agent',
          totalExecutions: validatePositiveInt(body.totalExecutions) ?? 0,
          successfulExecutions: validatePositiveInt(body.successfulExecutions) ?? 0,
          failedExecutions: validatePositiveInt(body.failedExecutions) ?? 0,
          uptimeScore: body.uptimeScore ?? 0,
          totalVolume: validatePositiveInt(body.totalVolume) ?? 0,
          successRate: validatePositiveInt(body.successRate) ?? 0,
          avgSlippage: validatePositiveInt(body.avgSlippage) ?? 0,
          isFlagged: body.isFlagged === true,
          badge: ['none', 'bronze', 'silver', 'gold'].includes(body.badge) ? body.badge : 'none',
        };

        if (CONVEX_SITE_URL) {
          const upstream = await fetch(`${CONVEX_SITE_URL}/agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
          });
          const data = await upstream.json();
          return res.status(201).json(data);
        }

        const fallbackEntry = { id: `demo_${Date.now()}`, ...entry, createdAt: Date.now() };
        fallbackStore.push(fallbackEntry);
        return res.status(201).json({ success: true, agent: fallbackEntry });
      }

      case 'DELETE': {
        const { limited } = checkRateLimit(req, 'strict');
        if (limited) return rateLimitResponse(res, 120_000);

        if (CONVEX_SITE_URL) {
          const upstream = await fetch(`${CONVEX_SITE_URL}/agents`, { method: 'DELETE' });
          const data = await upstream.json();
          return res.status(200).json(data);
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
