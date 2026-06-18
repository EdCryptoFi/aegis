export interface ReputationData {
  agentId: string;
  objectId?: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  totalSlippage: number;
  uptimeScore: number;
  lastUpdate: number;
  isFlagged: boolean;
  consecutiveFailures?: number;
  executionNonce?: number;
  walrusBlobId?: string | null;
}

export interface AgentStats {
  successRate: number;
  averageSlippage: number;
  estimatedUptime: string;
  trustLevel: 'High' | 'Medium' | 'Low' | 'Flagged';
}

export interface AgentLog {
  timestamp: number;
  success: boolean;
  volume: number;
  slippage: number;
  txDigest: string;
}

export interface BadgeEntry {
  agentId: string;
  badgeType: number;
  issuedAt: number;
  isValid: boolean;
  revokedReason?: string;
}

export interface ExecutionRecord {
  agentId: string;
  success: boolean;
  volume: number;
  slippage: number;
  nonce: number;
  timestamp: number;
}

export interface AegisScoreResult {
  score: number;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Unranked';
  status: 'Active' | 'Supervised' | 'Under Review' | 'Quarantined';
  breakdown: {
    performance: number;
    reliability: number;
    riskPenalty: number;
    contribution: number;
  };
}

export const PACKAGE_ID = '0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9';
export const NETWORK = 'testnet';