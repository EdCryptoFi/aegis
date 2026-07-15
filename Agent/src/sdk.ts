import { Transaction } from '@mysten/sui/transactions';
import type { ReputationData, AgentStats, AgentLog, AegisScoreResult } from './types';
import { suiClient as client } from './sui-client';

export const PACKAGE_ID = '0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9';

export const BADGE_REGISTRY_ID = '0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3';

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
    const data = await client.getObject({ id: config.badgeRegistry, options: { showContent: true } });
    if (data.data?.content?.dataType === 'moveObject') {
      const entries = (data.data.content.fields as any).entries || [];
      for (const entry of entries) {
        if (entry.fields?.agent_id === agentId) {
          return { badge: entry.fields.badge_type, isValid: entry.fields.is_valid };
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

/**
 * Computes the multi-dimensional Aegis Score for an agent.
 * Score = Performance (0-42) + Reliability (0-28) - RiskPenalty (0-30) + Contribution (0-10)
 * All inputs are derived from on-chain ReputationData — no off-chain data required.
 */
export function computeAegisScore(data: ReputationData): AegisScoreResult {
  const totalEx = data.totalExecutions;
  const successRate = totalEx > 0 ? (data.successfulExecutions / totalEx) * 100 : 0;

  // Performance (0-42): success rate weighted by execution maturity
  const execMaturity = Math.min(totalEx / 200, 1);
  const performance = Math.round(((successRate / 100) * 37 + execMaturity * 5) * 10) / 10;

  // Reliability (0-28): uptime + execution stability
  const uptimeComponent = ((data.uptimeScore ?? 0) / 100) * 18;
  const consecutiveFails = data.consecutiveFailures ?? 0;
  const stabilityComponent = consecutiveFails === 0 ? 10 : Math.max(0, 10 - consecutiveFails * 2);
  const reliability = Math.round((uptimeComponent + stabilityComponent) * 10) / 10;

  // Risk penalty (0-30): flags, slippage, consecutive failures
  const avgSlippage = totalEx > 0 ? (data.totalSlippage / totalEx) : 0;
  const slippagePenalty = avgSlippage > 500 ? 15 : avgSlippage > 200 ? 8 : 0;
  const flagPenalty = data.isFlagged ? 30 : 0;
  const failurePenalty = Math.min(consecutiveFails * 3, 12);
  const riskPenalty = Math.min(flagPenalty + slippagePenalty + failurePenalty, 30);

  // Contribution (0-10): protocol volume
  const volumeSUI = data.totalVolume / 1_000_000_000;
  const contribution = Math.round(Math.min(volumeSUI / 100, 10) * 10) / 10;

  const raw = performance + reliability - riskPenalty + contribution;
  const score = Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;

  const tier: AegisScoreResult['tier'] =
    score >= 95 && !data.isFlagged ? 'Platinum'
    : score >= 85 ? 'Gold'
    : score >= 70 ? 'Silver'
    : score >= 50 ? 'Bronze'
    : 'Unranked';

  const status: AegisScoreResult['status'] =
    data.isFlagged ? 'Quarantined'
    : score >= 70 ? 'Active'
    : score >= 50 ? 'Supervised'
    : 'Under Review';

  return { score, tier, status, breakdown: { performance, reliability, riskPenalty, contribution } };
}

export function getAgentTier(score: number, isFlagged: boolean): AegisScoreResult['tier'] {
  if (isFlagged || score < 50) return 'Unranked';
  if (score >= 95) return 'Platinum';
  if (score >= 85) return 'Gold';
  if (score >= 70) return 'Silver';
  return 'Bronze';
}