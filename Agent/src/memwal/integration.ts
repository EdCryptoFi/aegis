import { createMemWalService, createMockMemWalService, MemWalMemoryService } from './service';
import type { MemWalConfig, ExecutionLog, RationaleEntry } from './types';

export interface AegisMemWalIntegration {
  memwal: MemWalMemoryService;

  recordExecution(params: {
    agentId: string;
    action: string;
    params: Record<string, any>;
    result: string;
    success: boolean;
    gasUsed: number;
  }): Promise<{ executionLog: ExecutionLog; blobId: string }>;

  recordRationale(params: {
    agentId: string;
    task: string;
    reasoning: string;
    decision: string;
  }): Promise<{ rationale: RationaleEntry; blobId: string }>;

  getAuditTrail(agentId: string): Promise<{
    executions: ExecutionLog[];
    rationales: RationaleEntry[];
    totalLogs: number;
  }>;
}

export async function createAegisMemWalIntegration(
  memwalConfig: MemWalConfig | null
): Promise<AegisMemWalIntegration> {
  const memwalService: MemWalMemoryService = memwalConfig
    ? await createMemWalService(memwalConfig) ?? createMockMemWalService()
    : createMockMemWalService();

  return {
    memwal: memwalService,

    async recordExecution(params) {
      const executionLog: ExecutionLog = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: params.agentId,
        poolName: 'UNKNOWN',
        side: 'buy',
        action: params.action,
        params: params.params,
        result: params.result,
        success: params.success,
        quantity: 0,
        price: 0,
        volume: 0,
        slippageBps: 0,
        expectedPrice: 0,
        actualPrice: 0,
        gasUsed: params.gasUsed,
        timestamp: Date.now(),
      };

      const blobId = await memwalService.storeExecutionLog(executionLog);
      executionLog.blobId = blobId;

      return { executionLog, blobId };
    },

    async recordRationale(params) {
      const rationale: RationaleEntry = {
        id: `rat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        task: params.task,
        reasoning: params.reasoning,
        decision: params.decision,
        timestamp: Date.now(),
      };

      const blobId = await memwalService.storeRationale(rationale);

      return { rationale, blobId };
    },

    async getAuditTrail(agentId: string) {
      const [executions, rationales] = await Promise.all([
        memwalService.getExecutionLogs(50),
        memwalService.getRationaleEntries(50),
      ]);

      return {
        executions: executions.filter((e: ExecutionLog) => e.id.includes(agentId) || e.id.includes('exec_')),
        rationales: rationales.filter((r: RationaleEntry) => r.id.includes(agentId) || r.id.includes('rat_')),
        totalLogs: executions.length + rationales.length,
      };
    },
  };
}

export function formatMemWalLink(blobId: string, network: 'testnet' | 'mainnet' = 'testnet'): string {
  if (blobId.startsWith('mock_')) {
    return `memwal://${blobId}`;
  }

  const explorerBase = network === 'testnet'
    ? 'https://suiscan.xyz/testnet/blob'
    : 'https://suiscan.xyz/mainnet/blob';

  return `${explorerBase}/${blobId}`;
}

export function parseBlobIdFromWalrusUrl(url: string): string | null {
  const match = url.match(/blob_id=([a-zA-Z0-9_]+)/);
  return match ? match[1] : null;
}

export default { createAegisMemWalIntegration, formatMemWalLink, parseBlobIdFromWalrusUrl };