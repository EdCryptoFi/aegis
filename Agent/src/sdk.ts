import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { ReputationData, AgentStats, AgentLog } from './types';

const client = new SuiClient({ url: getFullNodeUrl('testnet') });

export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '0x0';

export async function getAgentReputation(agentId: string): Promise<ReputationData | null> {
  try {
    const reputationObjects = await client.getDynamicFields({
      parentId: PACKAGE_ID,
    });

    for (const obj of reputationObjects.data) {
      if (obj.name.value === agentId) {
        const objectData = await client.getObject({
          id: obj.objectId,
          options: { showContent: true },
        });

        if (objectData.data?.content?.dataType === 'moveObject') {
          const fields = objectData.data.content.fields as any;
          return {
            agentId,
            totalExecutions: Number(fields.total_executions),
            successfulExecutions: Number(fields.successful_executions),
            failedExecutions: Number(fields.failed_executions),
            totalVolume: Number(fields.total_volume),
            totalSlippage: Number(fields.total_slippage),
            uptimeScore: Number(fields.uptime_score),
            lastUpdate: Number(fields.last_update),
            isFlagged: fields.is_flagged,
            walrusBlobId: fields.walrus_blob_id?.fields?.vec?.[0] || null,
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get agent reputation:', error);
    return null;
  }
}

export function calculateAgentStats(data: ReputationData): AgentStats {
  const successRate = data.totalExecutions > 0
    ? (data.successfulExecutions / data.totalExecutions) * 100
    : 100;

  const averageSlippage = data.totalExecutions > 0
    ? data.totalSlippage / data.totalExecutions
    : 0;

  let trustLevel: 'High' | 'Medium' | 'Low' | 'Flagged';
  if (data.isFlagged) {
    trustLevel = 'Flagged';
  } else if (successRate >= 95 && data.totalExecutions >= 50) {
    trustLevel = 'High';
  } else if (successRate >= 80 && data.totalExecutions >= 10) {
    trustLevel = 'Medium';
  } else {
    trustLevel = 'Low';
  }

  return {
    successRate: Math.round(successRate * 100) / 100,
    averageSlippage: Math.round(averageSlippage * 100) / 100,
    estimatedUptime: `${data.uptimeScore}%`,
    trustLevel,
  };
}

export async function registerAgent(signer: any): Promise<string> {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::register_agent`,
    arguments: [],
  });

  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });

  return result.digest;
}

export async function recordExecution(
  signer: any,
  reputationObjectId: string,
  success: boolean,
  volume: number,
  slippage: number
): Promise<string> {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::record_execution`,
    arguments: [
      tx.object(reputationObjectId),
      tx.pure.bool(success),
      tx.pure.u64(volume),
      tx.pure.u64(slippage),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true },
  });

  return result.digest;
}

export function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) {
    return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  } else if (sui >= 1_000) {
    return `${(sui / 1_000).toFixed(2)}K SUI`;
  }
  return `${sui.toFixed(4)} SUI`;
}

export function formatSlippage(basisPoints: number): string {
  return `${(basisPoints / 100).toFixed(2)}%`;
}
