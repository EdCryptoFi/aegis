import type { NextApiRequest, NextApiResponse } from 'next';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { checkRateLimit, rateLimitResponse } from '../../../lib/rate-limit';
import { methodNotAllowed, badRequest, notFound, serverError, validateId } from '../../../lib/api-utils';
import { config } from '../../../config';

const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl(config.network as 'testnet' | 'mainnet' | 'devnet' | 'localnet'), network: config.network });

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
      id,
      options: { showContent: true, showOwner: true },
    });

    if (!data.data || data.data.content?.dataType !== 'moveObject') {
      return notFound(res, 'Agent not found');
    }

    const fields = data.data.content.fields as any;

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
        walrusBlobId: fields.walrus_blob_id?.fields?.vec?.[0] || null,
        trustLevel,
        owner: data.data.owner,
      },
    });
  } catch (error: unknown) {
    serverError(res, error, `GET /api/agents/${id}`);
  }
}
