import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, serverError, sanitizeString, validatePositiveInt } from '../../../lib/api-utils';
import { getObjectFields } from '../../../lib/sui-client';

const KNOWN_AGENTS = [
  '0xfe3cb0c9dd9e147b860034ae9ec5591f10f6a35517e5d2bd6023a9aa86bd1a2a',
  '0xf0f9bb84452f9e401383a80b25b36b7643d5ee2c548338ad9899f5f7105af8ed',
  '0x32247adc0cb1a5aef74657c1be09f5b87d5effbc6b7ff7fd96fcc929d72377ca',
];

const VALID_SORTS = ['uptime', 'volume', 'executions'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const { limited, remaining, resetInMs } = checkRateLimit(req, 'relaxed');
  if (limited) return rateLimitResponse(res, resetInMs);

  try {
    const sort = VALID_SORTS.includes(req.query.sort as string) ? req.query.sort as string : 'uptime';
    const trust = sanitizeString(req.query.trust);
    const minExecutions = validatePositiveInt(req.query.minExecutions);

    const agents: any[] = [];

    for (const objectId of KNOWN_AGENTS) {
      try {
        const fields = await getObjectFields(objectId);

        if (fields) {
          const totalExecutions = Number(fields.total_executions);
          const successfulExecutions = Number(fields.successful_executions);
          const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 100;

          let trustLevel = 'Low';
          if (fields.is_flagged) {
            trustLevel = 'Flagged';
          } else if (successRate >= 95 && totalExecutions >= 50) {
            trustLevel = 'High';
          } else if (successRate >= 80 && totalExecutions >= 10) {
            trustLevel = 'Medium';
          }

          if (trust && trust !== 'all' && trustLevel !== trust) continue;
          if (minExecutions !== null && totalExecutions < minExecutions) continue;

          agents.push({
            objectId,
            agentId: fields.agent_id,
            totalExecutions,
            successfulExecutions,
            failedExecutions: Number(fields.failed_executions),
            totalVolume: Number(fields.total_volume),
            uptimeScore: Number(fields.uptime_score),
            successRate: Math.round(successRate),
            isFlagged: fields.is_flagged,
            trustLevel,
            walrusBlobId: fields.walrus_blob_id?.vec?.[0] || fields.walrus_blob_id?.fields?.vec?.[0] || null,
          });
        }
      } catch {
        // Silently skip agents that fail to fetch
      }
    }

    agents.sort((a, b) => {
      switch (sort) {
        case 'volume': return b.totalVolume - a.totalVolume;
        case 'executions': return b.totalExecutions - a.totalExecutions;
        default: return b.uptimeScore - a.uptimeScore;
      }
    });

    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error: unknown) {
    serverError(res, error, 'GET /api/agents');
  }
}
