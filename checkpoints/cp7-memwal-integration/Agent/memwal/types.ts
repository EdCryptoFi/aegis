export interface MemWalConfig {
  privateKey: string;
  accountId: string;
  relayerUrl?: string;
  namespace?: string;
}

export interface MemoryEntry {
  id: string;
  content: string;
  timestamp: number;
  namespace: string;
  blobId?: string;
}

export interface MemorySearchResult {
  id: string;
  content: string;
  score: number;
  timestamp: number;
}

export interface AgentMemory {
  executionLogs: ExecutionLog[];
  rationale: string;
  context: string[];
  lastUpdate: number;
}

export interface ExecutionLog {
  id: string;
  action: string;
  params: Record<string, any>;
  result: string;
  success: boolean;
  timestamp: number;
  gasUsed: number;
  blobId?: string;
}

export interface RationaleEntry {
  id: string;
  task: string;
  reasoning: string;
  decision: string;
  timestamp: number;
}

export const MEMWAL_TESTNET_RELAYER = 'https://relayer.staging.memwal.ai';
export const MEMWAL_MAINNET_RELAYER = 'https://relayer.memwal.ai';

export const MEMWAL_NAMESPACES = {
  EXECUTION_LOG: 'aegis_executions',
  RATIONALE: 'aegis_rationale',
  CONTEXT: 'aegis_context',
  AUDIT: 'aegis_audit',
} as const;

export function isMemWalConfigured(config: MemWalConfig): boolean {
  return !!(config.privateKey && config.accountId);
}