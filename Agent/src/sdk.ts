import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { ReputationData, AgentStats, AgentLog } from './types';

const client = new SuiClient({ url: getFullNodeUrl('testnet') });

export const PACKAGE_ID = '0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d';

export const BADGE_REGISTRY_ID = '0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3';

export const NETWORK = 'testnet';

const REPUTATION_OBJECT_TYPE = `${PACKAGE_ID}::reputation::ReputationObject`;

export async function getAgentReputation(objectId: string): Promise<ReputationData | null> {
  try {
    const objectData = await client.getObject({
      id: objectId,
      options: { showContent: true, showOwner: true },
    });

    if (!objectData.data || objectData.data.content?.dataType !== 'moveObject') {
      return null;
    }

    const fields = objectData.data.content.fields as any;

    return {
      agentId: fields.agent_id,
      objectId: objectId,
      totalExecutions: Number(fields.total_executions),
      successfulExecutions: Number(fields.successful_executions),
      failedExecutions: Number(fields.failed_executions),
      totalVolume: Number(fields.total_volume),
      totalSlippage: Number(fields.total_slippage),
      uptimeScore: Number(fields.uptime_score),
      lastUpdate: Number(fields.last_update),
      isFlagged: fields.is_flagged,
      consecutiveFailures: Number(fields.consecutive_failures),
      executionNonce: Number(fields.execution_nonce),
      walrusBlobId: fields.walrus_blob_id?.fields?.vec?.[0] || null,
    };
  } catch (error) {
    console.error('Failed to get agent reputation:', error);
    return null;
  }
}

export async function getAllReputationObjects(): Promise<string[]> {
  try {
    const objects = await client.getDynamicObjects({
      first: 100,
    });

    const repObjects: string[] = [];
    for (const obj of objects.data) {
      if (obj.type?.includes('reputation::ReputationObject')) {
        repObjects.push(obj.id);
      }
    }
    return repObjects;
  } catch (error) {
    console.error('Failed to get reputation objects:', error);
    return [];
  }
}

export async function getAllAgents(): Promise<AgentInfo[]> {
  try {
    const objects = await client.getDynamicObjects({ first: 100 });
    const agents: AgentInfo[] = [];

    for (const obj of objects.data) {
      if (obj.type?.includes('ReputationObject')) {
        const data = await getAgentReputation(obj.id);
        if (data) {
          const stats = calculateAgentStats(data);
          agents.push({
            objectId: obj.id,
            agentId: data.agentId,
            reputation: data,
            stats,
          });
        }
      }
    }
    return agents;
  } catch (error) {
    console.error('Failed to get all agents:', error);
    return [];
  }
}

export interface AgentInfo {
  objectId: string;
  agentId: string;
  reputation: ReputationData;
  stats: AgentStats;
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

export async function registerAgent(signer: any): Promise<{ digest: string; objectId: string }> {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::reputation::register_agent`,
    arguments: [],
  });

  const result = await client.signAndExecuteTransaction({
    signer,
    transaction: tx,
    options: { showEffects: true, showObjectChanges: true },
  });

  const objectId = result.objectChanges?.find(
    (change) => change.type === 'created' && 'objectType' in change && change.objectType.includes('ReputationObject')
  )?.['objectId'] || '';

  return { digest: result.digest, objectId };
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

export async function isEligibleForBadge(reputationObjectId: string, badgeType: number): Promise<boolean> {
  const rep = await getAgentReputation(reputationObjectId);
  if (!rep) return false;

  const total = rep.totalExecutions;
  const successRate = total > 0 ? (rep.successfulExecutions / total) * 100 : 100;
  const volume = rep.totalVolume;

  switch (badgeType) {
    case 1: return total >= 10 && successRate >= 80;
    case 2: return total >= 50 && successRate >= 90;
    case 3: return total >= 200 && successRate >= 95 && volume >= 1_000_000;
    default: return false;
  }
}

export async function getBadgeEligibility(objectId: string): Promise<{ bronze: boolean; silver: boolean; gold: boolean }> {
  const [bronze, silver, gold] = await Promise.all([
    isEligibleForBadge(objectId, 1),
    isEligibleForBadge(objectId, 2),
    isEligibleForBadge(objectId, 3),
  ]);
  return { bronze, silver, gold };
}

export async function checkBadgeStatus(agentId: string): Promise<{ badge: number | null; isValid: boolean }> {
  try {
    const response = await fetch('https://fullnode.testnet.sui.io:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sui_getObject',
        params: [config.badgeRegistry, { showContent: true }],
      }),
    });
    const data = await response.json();
    if (data.result?.data?.content?.dataType === 'moveObject') {
      const entries = data.result.data.content.fields.entries || [];
      for (const entry of entries) {
        if (entry.fields?.agent_id === agentId) {
          return {
            badge: entry.fields.badge_type,
            isValid: entry.fields.is_valid,
          };
        }
      }
    }
    return { badge: null, isValid: false };
  } catch {
    return { badge: null, isValid: false };
  }
}

import { config } from './config';

export async function getSuccessRate(objectId: string): Promise<number> {
  const rep = await getAgentReputation(objectId);
  if (!rep || rep.totalExecutions === 0) return 100;
  return Math.round((rep.successfulExecutions / rep.totalExecutions) * 100);
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

export function getBadgeName(badgeType: number): string {
  switch (badgeType) {
    case 1: return 'Bronze';
    case 2: return 'Silver';
    case 3: return 'Gold';
    default: return 'None';
  }
}

export function getBadgeEmoji(badgeType: number): string {
  switch (badgeType) {
    case 1: return '🥉';
    case 2: return '🥈';
    case 3: return '🥇';
    default: return '❌';
  }
}