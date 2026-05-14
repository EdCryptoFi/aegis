import type { ExecutionLog } from './memwal/types';

export type { ExecutionLog };

const executionHistory: ExecutionLog[] = [];
const MAX_HISTORY = 1000;

export function logExecution(log: Omit<ExecutionLog, 'id'>): ExecutionLog {
  const entry: ExecutionLog = {
    id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...log,
  };

  executionHistory.push(entry);

  if (executionHistory.length > MAX_HISTORY) {
    executionHistory.shift();
  }

  console.log(`[Aegis Logger] Execution recorded:`, entry);

  return entry;
}

export function getExecutionHistory(limit?: number): ExecutionLog[] {
  if (limit) {
    return executionHistory.slice(-limit);
  }
  return [...executionHistory];
}

export function getExecutionStats(): {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  averageSlippage: number;
  successRate: number;
} {
  const total = executionHistory.length;
  const successful = executionHistory.filter(e => e.success).length;
  const failed = total - successful;
  const totalVolume = executionHistory.reduce((sum, e) => sum + e.volume, 0);
  const avgSlippage = total > 0
    ? executionHistory.reduce((sum, e) => sum + e.slippageBps, 0) / total
    : 0;

  return {
    totalExecutions: total,
    successfulExecutions: successful,
    failedExecutions: failed,
    totalVolume,
    averageSlippage: Math.round(avgSlippage * 100) / 100,
    successRate: total > 0 ? Math.round((successful / total) * 10000) / 100 : 100,
  };
}

export function clearHistory(): void {
  executionHistory.length = 0;
  console.log('[Aegis Logger] Execution history cleared');
}

export function getFailedExecutions(): ExecutionLog[] {
  return executionHistory.filter(e => !e.success);
}

export function getSuccessfulExecutions(): ExecutionLog[] {
  return executionHistory.filter(e => e.success);
}

export function getExecutionsByPool(poolName: string): ExecutionLog[] {
  return executionHistory.filter(e => e.poolName === poolName);
}

export function calculateConsecutiveFailures(): number {
  let count = 0;
  for (let i = executionHistory.length - 1; i >= 0; i--) {
    if (executionHistory[i].success) break;
    count++;
  }
  return count;
}

export function calculateRollingSuccessRate(window: number = 10): number {
  const recent = executionHistory.slice(-window);
  if (recent.length === 0) return 100;

  const successful = recent.filter(e => e.success).length;
  return Math.round((successful / recent.length) * 10000) / 100;
}

export default {
  logExecution,
  getExecutionHistory,
  getExecutionStats,
  clearHistory,
  getFailedExecutions,
  getSuccessfulExecutions,
  getExecutionsByPool,
  calculateConsecutiveFailures,
  calculateRollingSuccessRate,
};