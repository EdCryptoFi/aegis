import type { NextApiRequest, NextApiResponse } from 'next';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid agent ID' });
  }

  try {
    const data = await client.getObject({
      id,
      options: { showContent: true, showOwner: true },
    });

    if (!data.data || data.data.content?.dataType !== 'moveObject') {
      return res.status(404).json({ error: 'Agent not found' });
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
