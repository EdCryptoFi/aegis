import type { NextApiRequest, NextApiResponse } from 'next';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

const client = new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' });

const KNOWN_AGENTS = [
  '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc',
  '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec',
  '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6',
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sort = 'uptime', trust, minExecutions } = req.query;
    const agents: any[] = [];

    for (const objectId of KNOWN_AGENTS) {
      try {
        const data = await client.getObject({
          id: objectId,
          options: { showContent: true },
        });

        if (data.data?.content?.dataType === 'moveObject') {
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

          if (trust && trust !== 'all' && trustLevel !== trust) continue;
          if (minExecutions && totalExecutions < parseInt(minExecutions as string)) continue;

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
            walrusBlobId: fields.walrus_blob_id?.fields?.vec?.[0] || null,
          });
        }
      } catch (e) {
        console.error('Error fetching agent:', e);
      }
    }

    agents.sort((a, b) => {
      switch (sort) {
        case 'volume': return b.totalVolume - a.totalVolume;
        case 'executions': return b.totalExecutions - a.totalExecutions;
        default: return b.uptimeScore - a.uptimeScore;
      }
    });

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
