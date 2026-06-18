import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { config } from '../config';

const TESTNET_URL = 'https://fullnode.testnet.sui.io:443';
const client = new SuiJsonRpcClient({ url: TESTNET_URL, network: 'testnet' });

export const PACKAGE_ID = config.packageId;
export const BADGE_REGISTRY_ID = config.badgeRegistry;

export interface ReputationData {
  agentId: string;
  objectId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  totalSlippage: number;
  uptimeScore: number;
  lastUpdate: number;
  isFlagged: boolean;
  consecutiveFailures: number;
  executionNonce: number;
  walrusBlobId: string | null;
  memwalSessionId: string | null;
}

export interface AgentStats {
  successRate: number;
  averageSlippage: number;
  estimatedUptime: string;
  trustLevel: 'High' | 'Medium' | 'Low' | 'Flagged';
}

export interface AgentInfo {
  objectId: string;
  agentId: string;
  reputation: ReputationData;
  stats: AgentStats;
}

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
    memwalSessionId: fields.memwal_session_id || null,
    };
  } catch (error) {
    console.error('Failed to get agent reputation:', error);
    return null;
  }
}

export async function getAllAgents(): Promise<AgentInfo[]> {
  try {
    const events = await client.queryEvents({
      query: { MoveEventModule: { module: 'reputation', package: PACKAGE_ID } },
      limit: 50,
    });

    const seenIds = new Set<string>();
    const agents: AgentInfo[] = [];

    for (const event of events.data) {
      const parsed = event.parsedJson as any;
      if (parsed?.agent_id && !seenIds.has(parsed.agent_id)) {
        seenIds.add(parsed.agent_id);
        const objs = await client.getObject({ id: parsed.agent_id, options: { showContent: true } });
        const data = objs.data?.content as any;
        if (data?.fields) {
          const rep: ReputationData = {
            agentId: data.fields.agent_id,
            objectId: parsed.agent_id,
            totalExecutions: parseInt(data.fields.total_executions) || 0,
            successfulExecutions: parseInt(data.fields.successful_executions) || 0,
            failedExecutions: parseInt(data.fields.failed_executions) || 0,
            totalVolume: parseInt(data.fields.total_volume) || 0,
            totalSlippage: parseInt(data.fields.total_slippage) || 0,
            uptimeScore: parseFloat(data.fields.uptime_score) || 0,
            lastUpdate: parseInt(data.fields.last_update) || 0,
            isFlagged: data.fields.is_flagged || false,
            consecutiveFailures: parseInt(data.fields.consecutive_failures) || 0,
            executionNonce: parseInt(data.fields.execution_nonce) || 0,
            walrusBlobId: data.fields.walrus_blob_id?.fields?.vec?.[0] || null,
            memwalSessionId: data.fields.memwal_session_id || null,
          };
          const stats = calculateAgentStats(rep);
          agents.push({
            objectId: parsed.agent_id,
            agentId: rep.agentId,
            reputation: rep,
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

export function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) {
    return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  } else if (sui >= 1_000) {
    return `${(sui / 1_000).toFixed(2)}K SUI`;
  }
  return `${sui.toFixed(2)} SUI`;
}

export async function getBadgeEligibility(objectId: string): Promise<{ bronze: boolean; silver: boolean; gold: boolean }> {
  const rep = await getAgentReputation(objectId);
  if (!rep) return { bronze: false, silver: false, gold: false };

  const total = rep.totalExecutions;
  const successRate = total > 0 ? (rep.successfulExecutions / total) * 100 : 100;
  const volume = rep.totalVolume;

  return {
    bronze: total >= 10 && successRate >= 80,
    silver: total >= 50 && successRate >= 90,
    gold: total >= 200 && successRate >= 95 && volume >= 1_000_000,
  };
}

export interface ExecutionLogEntry {
  agentId: string;
  poolName: string;
  side: string;
  action: string;
  params: string;
  result: string;
  success: boolean;
  quantity: number;
  price: number;
  volume: number;
  slippageBps: number;
  expectedPrice: number;
  actualPrice: number;
  gasUsed: number;
  timestamp: number;
  digest: string;
  error: string | null;
  blobId: string | null;
}

export interface MemWalResponse {
  logs: ExecutionLogEntry[];
  created_at: number;
  updated_at: number;
}

export async function getAgentLogs(sessionId: string): Promise<MemWalResponse | null> {
  try {
    const url = `${config.memwal.relayerUrl}/v1/sessions/${sessionId}?namespace=${config.memwal.namespace}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    return response.json() as Promise<MemWalResponse>;
  } catch (error) {
    console.error('Failed to get agent logs from MemWal:', error);
    return null;
  }
}

export async function getBlobMetadata(blobId: string): Promise<{ size: number } | null> {
  try {
    const response = await fetch(`${config.memwal.relayerUrl}/v1/blobs/${blobId}/metadata`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const size = data?.metadata?.V1?.unencoded_length || 0;
    return { size: typeof size === 'string' ? parseInt(size) : Number(size) };
  } catch (error) {
    console.error('Failed to get blob metadata:', error);
    return null;
  }
}

// ============ WRITE FUNCTIONS (Require Wallet) ============

export interface WriteFunctions {
  registerAgent: (signer: any) => Promise<{ digest: string; objectId: string }>;
  recordExecution: (signer: any, objectId: string, success: boolean, volume: number, slippage: number) => Promise<string>;
  autoCheckBadge: (signer: any, agentId: string, reputationObjectId: string) => Promise<string>;
  updateWalrusBlob: (signer: any, objectId: string, blobId: string) => Promise<string>;
  autoCheck: (signer: any, agentId: string) => Promise<string>;
}

export async function registerAgent(signer: any): Promise<{ digest: string; objectId: string }> {
  try {
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

    const objectId = (result.objectChanges as any[])?.find(
      (change: any) => change.type === 'created' && change.objectType?.includes('ReputationObject')
    )?.objectId || '';

    return { digest: result.digest, objectId };
  } catch (error) {
    console.error('Failed to register agent:', error);
    throw error;
  }
}

export async function recordExecution(
  signer: any,
  reputationObjectId: string,
  success: boolean,
  volume: number,
  slippage: number
): Promise<string> {
  try {
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
  } catch (error) {
    console.error('Failed to record execution:', error);
    throw error;
  }
}

export async function autoCheckBadge(
  signer: any,
  agentId: string,
  reputationObjectId: string
): Promise<string> {
  try {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::badge_registry::auto_check`,
      arguments: [
        tx.object(BADGE_REGISTRY_ID),
        tx.pure.address(agentId),
        tx.object(reputationObjectId),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: { showEffects: true },
    });

    return result.digest;
  } catch (error) {
    console.error('Failed to auto-check badge:', error);
    throw error;
  }
}

export async function updateWalrusBlob(
  signer: any,
  reputationObjectId: string,
  blobId: string
): Promise<string> {
  try {
    const blobBytes = new Uint8Array(Array.from(new TextEncoder().encode(blobId)));
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::reputation::update_walrus_blob_id`,
      arguments: [
        tx.object(reputationObjectId),
        tx.pure(blobBytes),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: { showEffects: true },
    });

    return result.digest;
  } catch (error) {
    console.error('Failed to update Walrus blob ID:', error);
    throw error;
  }
}

export async function autoCheck(
  signer: any,
  agentId: string
): Promise<string> {
  try {
    const tx = new Transaction();
    
    const agents = await getAllAgents();
    const agent = agents.find(a => a.agentId === agentId);
    
    if (!agent) {
      throw new Error('Reputation object not found');
    }

    tx.moveCall({
      target: `${PACKAGE_ID}::badge_registry::auto_check`,
      arguments: [
        tx.object(BADGE_REGISTRY_ID),
        tx.pure.address(agentId),
        tx.object(agent.objectId),
      ],
    });

    const result = await client.signAndExecuteTransaction({
      signer,
      transaction: tx,
      options: { showEffects: true },
    });

    return result.digest;
  } catch (error) {
    console.error('Failed to run auto check:', error);
    throw error;
  }
}