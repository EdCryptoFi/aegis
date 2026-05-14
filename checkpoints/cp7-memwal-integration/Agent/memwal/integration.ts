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
  const memwal = memwalConfig
    ? await createMemWalService(memwalConfig)
    : createMockMemWalService();

  return {
    memwal,

    async recordExecution(params) {
      const executionLog: ExecutionLog = {
        id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: params.action,
        params: params.params,
        result: params.result,
        success: params.success,
        timestamp: Date.now(),
        gasUsed: params.gasUsed,
      };

      const blobId = await memwal.storeExecutionLog(executionLog);
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

      const blobId = await memwal.storeRationale(rationale);

      return { rationale, blobId };
    },

    async getAuditTrail(agentId: string) {
      const [executions, rationales] = await Promise.all([
        memwal.getExecutionLogs(50),
        memwal.getRationaleEntries(50),
      ]);

      return {
        executions: executions.filter(e => e.id.includes(agentId) || e.id.includes('exec_')),
        rationales: rationales.filter(r => r.id.includes(agentId) || r.id.includes('rat_')),
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