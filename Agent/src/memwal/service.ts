import type { ExecutionLog, RationaleEntry, MemWalConfig } from './types';
import { MEMWAL_TESTNET_RELAYER, MEMWAL_NAMESPACES } from './types';

export interface MemWalMemoryService {
  isConfigured(): boolean;
  storeExecutionLog(log: ExecutionLog): Promise<string>;
  storeRationale(entry: RationaleEntry): Promise<string>;
  getExecutionLogs(limit?: number): Promise<ExecutionLog[]>;
  getRationaleEntries(limit?: number): Promise<RationaleEntry[]>;
  anchorToAegis(blobId: string): void;
}

export async function createMemWalService(config: MemWalConfig): Promise<MemWalMemoryService | null> {
  if (!config.privateKey || !config.accountId) {
    console.log('[MemWal] Not configured - memory logging disabled');
    return null;
  }

  try {
    const { MemWal } = await import('@mysten-incubation/memwal');

    const memwal = MemWal.create({
      key: config.privateKey,
      accountId: config.accountId,
      serverUrl: config.relayerUrl || MEMWAL_TESTNET_RELAYER,
      namespace: 'aegis',
    });

    const health = await memwal.health();
    if (!health) {
      console.warn('[MemWal] Health check failed:', health);
    }

    console.log('[MemWal] Connected to relayer:', config.relayerUrl);

    return createMemWalServiceImpl(memwal, config);
  } catch (error) {
    console.warn('[MemWal] Failed to initialize:', error);
    return null;
  }
}

function createMemWalServiceImpl(
  memwal: any,
  config: MemWalConfig
): MemWalMemoryService {
  return {
    isConfigured(): boolean {
      return true;
    },

    async storeExecutionLog(log: ExecutionLog): Promise<string> {
      const content = JSON.stringify({
        type: 'execution_log',
        ...log,
        agentId: config.accountId,
        namespace: MEMWAL_NAMESPACES.EXECUTION_LOG,
      });

      const job = await memwal.remember(content);
      await memwal.waitForRememberJob(job.job_id);

      const blobId = extractBlobId(job);
      console.log('[MemWal] Execution log stored:', blobId);

      return blobId;
    },

    async storeRationale(entry: RationaleEntry): Promise<string> {
      const content = JSON.stringify({
        type: 'rationale',
        ...entry,
        agentId: config.accountId,
        namespace: MEMWAL_NAMESPACES.RATIONALE,
      });

      const job = await memwal.remember(content);
      await memwal.waitForRememberJob(job.job_id);

      const blobId = extractBlobId(job);
      console.log('[MemWal] Rationale stored:', blobId);

      return blobId;
    },

    async getExecutionLogs(limit: number = 10): Promise<ExecutionLog[]> {
      const result = await memwal.recall('execution log agent task', { limit });

      return result.results.map((r: any) => {
        try {
          const parsed = JSON.parse(r.content);
          return {
            id: parsed.id || r.id,
            agentId: parsed.agentId || config.accountId,
            poolName: parsed.poolName || parsed.action?.split(' ')[2] || 'UNKNOWN',
            side: (parsed.side || 'buy') as 'buy' | 'sell',
            action: parsed.action || 'execution',
            params: parsed.params || {},
            result: parsed.result || '',
            success: parsed.success ?? true,
            quantity: parsed.quantity || 0,
            price: parsed.price || 0,
            volume: parsed.volume || 0,
            slippageBps: parsed.slippageBps || 0,
            expectedPrice: parsed.expectedPrice || 0,
            actualPrice: parsed.actualPrice || 0,
            gasUsed: parsed.gasUsed || 0,
            timestamp: parsed.timestamp || Date.now(),
            digest: parsed.digest,
            blobId: r.blob_id,
          };
        } catch {
          return {
            id: r.id,
            agentId: config.accountId,
            poolName: 'UNKNOWN',
            side: 'buy' as const,
            action: 'unknown',
            params: {},
            result: r.content,
            success: true,
            quantity: 0,
            price: 0,
            volume: 0,
            slippageBps: 0,
            expectedPrice: 0,
            actualPrice: 0,
            gasUsed: 0,
            timestamp: Date.now(),
            blobId: r.blob_id,
          };
        }
      });
    },

    async getRationaleEntries(limit: number = 10): Promise<RationaleEntry[]> {
      const result = await memwal.recall('agent rationale reasoning decision', { limit });

      return result.results.map((r: any) => {
        try {
          const parsed = JSON.parse(r.content);
          return {
            id: parsed.id || r.id,
            task: parsed.task || '',
            reasoning: parsed.reasoning || '',
            decision: parsed.decision || '',
            timestamp: parsed.timestamp || Date.now(),
          };
        } catch {
          return {
            id: r.id,
            task: '',
            reasoning: r.content,
            decision: '',
            timestamp: Date.now(),
          };
        }
      });
    },

    anchorToAegis(blobId: string): void {
      console.log('[MemWal] Blob ID ready for Aegis anchoring:', blobId);
    },
  };
}

function extractBlobId(job: any): string {
  if (job.blob_id) return job.blob_id;
  if (job.result?.blob_id) return job.result.blob_id;
  if (job.id) return job.id;
  return `memwal_${Date.now()}`;
}

export function createMockMemWalService(): MemWalMemoryService {
  const logs: ExecutionLog[] = [];
  const rationales: RationaleEntry[] = [];

  return {
    isConfigured(): boolean {
      return false;
    },

    async storeExecutionLog(log: ExecutionLog): Promise<string> {
      logs.push(log);
      const mockBlobId = `mock_blob_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('[MemWal Mock] Execution log stored:', mockBlobId);
      return mockBlobId;
    },

    async storeRationale(entry: RationaleEntry): Promise<string> {
      rationales.push(entry);
      const mockBlobId = `mock_rationale_${Date.now()}`;
      console.log('[MemWal Mock] Rationale stored:', mockBlobId);
      return mockBlobId;
    },

    async getExecutionLogs(limit?: number): Promise<ExecutionLog[]> {
      return limit ? logs.slice(-limit) : logs;
    },

    async getRationaleEntries(limit?: number): Promise<RationaleEntry[]> {
      return limit ? rationales.slice(-limit) : rationales;
    },

    anchorToAegis(blobId: string): void {
      console.log('[MemWal Mock] Anchor to Aegis:', blobId);
    },
  };
}

export default { createMemWalService, createMockMemWalService };