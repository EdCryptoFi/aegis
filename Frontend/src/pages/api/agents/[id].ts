import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, badRequest, notFound, serverError, validateId } from '../../../lib/api-utils';
import { suiClient as client } from '../../../lib/sui-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  const { limited, resetInMs } = checkRateLimit(req, 'moderate');
  if (limited) return rateLimitResponse(res, resetInMs);

  const { id } = req.query;

  if (!id || !validateId(id)) {
    return badRequest(res, 'Invalid agent ID format');
  }

  try {
    const data = await client.getObject({
      objectId: id,
      include: { json: true },
    });

    const fields = data.object.json as any;
    if (!fields) {
      return notFound(res, 'Agent not found');
    }

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

    const averageSlippage = totalExecutions > 0
      ? Number(fields.total_slippage) / totalExecutions
      : 0;

    res.status(200).json({
      success: true,
      data: {
        objectId: id,
        agentId: fields.agent_id,
        totalExecutions,
        successfulExecutions,
        failedExecutions: Number(fields.failed_executions),
        consecutiveFailures: Number(fields.consecutive_failures),
        totalVolume: Number(fields.total_volume),
        totalSlippage: Number(fields.total_slippage),
        averageSlippage: Math.round(averageSlippage),
        uptimeScore: Number(fields.uptime_score),
        successRate: Math.round(successRate),
        lastUpdate: Number(fields.last_update),
        isFlagged: fields.is_flagged,
        executionNonce: Number(fields.execution_nonce),
        walrusBlobId: fields.walrus_blob_id?.vec?.[0] || fields.walrus_blob_id?.fields?.vec?.[0] || null,
        trustLevel,
        owner: data.object.owner,
      },
    });
  } catch (error: unknown) {
    serverError(res, error, `GET /api/agents/${id}`);
  }
}
