import { deepbookIndexer } from './deepbook/indexer';
import type { Trade } from './deepbook/types';
import type { OrderResult } from './executor';

export interface TradeRecord {
  poolName: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  volume: number;
  slippageBps: number;
  marketPrice: number;
  timestamp: number;
  digest: string;
  type: string;
  takerFee: number;
  makerFee: number;
}

export interface ExecutionLog {
  id: string;
  agentId: string;
  poolName: string;
  side: 'buy' | 'sell';
  success: boolean;
  quantity: number;
  price: number;
  volume: number;
  slippageBps: number;
  expectedPrice: number;
  actualPrice: number;
  gasUsed: number;
  timestamp: number;
  digest?: string;
  error?: string;
}

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

  console.log(`[Aegis Logger] Execution logged: ${entry.side} ${entry.quantity} ${entry.poolName} @ ${entry.price} (${entry.success ? 'SUCCESS' : 'FAILED'})`);

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

export async function fetchAgentTrades(
  agentAddress: string,
  poolName: string,
  limit: number = 100,
  startTime?: number,
  endTime?: number
): Promise<TradeRecord[]> {
  try {
    const trades = await deepbookIndexer.getTrades(poolName, limit, startTime, endTime);

    const agentTrades = trades
      .filter(trade =>
        trade.maker_balance_manager_id === agentAddress ||
        trade.taker_balance_manager_id === agentAddress
      )
      .map(trade => convertToTradeRecord(trade, poolName));

    return agentTrades;
  } catch (error) {
    console.error('[Logger] fetchAgentTrades failed:', error);
    return [];
  }
}

export async function fetchRecentMarketTrades(
  poolName: string,
  limit: number = 50
): Promise<TradeRecord[]> {
  try {
    const trades = await deepbookIndexer.getTrades(poolName, limit);
    return trades.map(trade => convertToTradeRecord(trade, poolName));
  } catch (error) {
    console.error('[Logger] fetchRecentMarketTrades failed:', error);
    return [];
  }
}

function convertToTradeRecord(trade: Trade, poolName: string): TradeRecord {
  const side = trade.type as 'buy' | 'sell';

  return {
    poolName,
    side,
    price: trade.price,
    quantity: trade.base_volume,
    volume: trade.quote_volume,
    slippageBps: 0,
    marketPrice: trade.price,
    timestamp: trade.timestamp,
    digest: trade.digest,
    type: trade.type,
    takerFee: trade.taker_fee,
    makerFee: trade.maker_fee,
  };
}

export function recordOrderResult(result: OrderResult, agentId: string): ExecutionLog {
  return logExecution({
    agentId,
    poolName: result.poolName,
    side: result.side,
    success: result.success,
    quantity: result.executedQuantity,
    price: result.averagePrice,
    volume: result.executedQuantity * result.averagePrice,
    slippageBps: result.slippageBps,
    expectedPrice: result.expectedPrice,
    actualPrice: result.averagePrice,
    gasUsed: result.gasUsed,
    timestamp: result.timestamp,
    digest: result.digest,
    error: result.error,
  });
}

export function clearHistory(): void {
  executionHistory.length = 0;
  console.log('[Aegis Logger] Execution history cleared');
}

export function exportHistoryJSON(): string {
  return JSON.stringify(executionHistory, null, 2);
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

export function getExecutionsByTimeRange(startTime: number, endTime: number): ExecutionLog[] {
  return executionHistory.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
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
  fetchAgentTrades,
  fetchRecentMarketTrades,
  recordOrderResult,
  clearHistory,
  exportHistoryJSON,
  getFailedExecutions,
  getSuccessfulExecutions,
  getExecutionsByPool,
  getExecutionsByTimeRange,
  calculateConsecutiveFailures,
  calculateRollingSuccessRate,
};