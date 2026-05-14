import { DeepBookExecutor, OrderParams, OrderResult } from './executor';
import { createAegisMemWalIntegration, AegisMemWalIntegration } from './memwal/integration';
import type { MemWalConfig } from './memwal/types';
import { recordOrderResult } from './logger';
import type { ReputationData } from './types';

export interface CombinedExecutorConfig {
  signer: any;
  client?: any;
  memwalConfig?: MemWalConfig;
  agentId: string;
}

export interface ExecutionResult extends OrderResult {
  executionLog?: any;
  rationale?: any;
  blobId?: string;
  memwalLinked: boolean;
}

export class AegisDeepBookExecutor {
  private deepBookExecutor: DeepBookExecutor;
  private memwalIntegration: AegisMemWalIntegration | null = null;
  private agentId: string;

  constructor(config: CombinedExecutorConfig) {
    this.deepBookExecutor = new DeepBookExecutor(config.signer, config.client);
    this.agentId = config.agentId;
  }

  async initialize(config: CombinedExecutorConfig): Promise<void> {
    if (config.memwalConfig) {
      this.memwalIntegration = await createAegisMemWalIntegration(config.memwalConfig);
      console.log('[Aegis] MemWal integration enabled');
    }
  }

  static async create(config: CombinedExecutorConfig): Promise<AegisDeepBookExecutor> {
    const executor = new AegisDeepBookExecutor(config);
    await executor.initialize(config);
    return executor;
  }

  async executeTrade(params: OrderParams): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      const result = await this.deepBookExecutor.placeMarketOrder(params);

      if (this.memwalIntegration) {
        await this.recordExecutionWithMemWal(result);
      } else {
        recordOrderResult(result, this.agentId);
      }

      return {
        ...result,
        memwalLinked: false,
      };

    } catch (error: any) {
      console.error('[Aegis] Trade execution failed:', error);

      const failedResult: OrderResult = {
        success: false,
        executedQuantity: 0,
        averagePrice: 0,
        expectedPrice: 0,
        slippageBps: 0,
        marketPrice: 0,
        poolName: params.poolName,
        side: params.side,
        gasUsed: 0,
        timestamp: startTime,
        error: error.message || 'Execution failed',
      };

      recordOrderResult(failedResult, this.agentId);

      return {
        ...failedResult,
        memwalLinked: false,
      };
    }
  }

  async executeWithRationale(
    params: OrderParams,
    rationale: {
      task: string;
      reasoning: string;
      decision: string;
    }
  ): Promise<ExecutionResult> {
    const result = await this.executeTrade(params);

    if (this.memwalIntegration && result.success) {
      const rationaleResult = await this.memwalIntegration.recordRationale({
        agentId: this.agentId,
        ...rationale,
      });

      return {
        ...result,
        rationale: rationaleResult.rationale,
        blobId: rationaleResult.blobId,
        memwalLinked: true,
      };
    }

    return result;
  }

  private async recordExecutionWithMemWal(result: OrderResult): Promise<void> {
    if (!this.memwalIntegration) return;

    try {
      const { executionLog, blobId } = await this.memwalIntegration.recordExecution({
        agentId: this.agentId,
        action: `${result.side} ${result.executedQuantity} ${result.poolName}`,
        params: {
          poolName: result.poolName,
          quantity: result.executedQuantity,
          price: result.averagePrice,
        },
        result: result.success ? 'completed' : 'failed',
        success: result.success,
        gasUsed: result.gasUsed,
      });

      console.log('[Aegis] Execution logged to MemWal:', blobId);

      recordOrderResult(result, this.agentId);

    } catch (error) {
      console.error('[Aegis] Failed to log to MemWal:', error);
      recordOrderResult(result, this.agentId);
    }
  }

  async executeAndAnchor(params: OrderParams): Promise<{
    result: ExecutionResult;
    aegisBlobId?: string;
    memwalBlobId?: string;
    onchainLinked: boolean;
  }> {
    const result = await this.executeTrade(params);

    if (!this.memwalIntegration) {
      return { result, onchainLinked: false };
    }

    try {
      const auditTrail = await this.memwalIntegration.getAuditTrail(this.agentId);
      const latestBlobId = auditTrail.executions[auditTrail.executions.length - 1]?.blobId;

      return {
        result,
        memwalBlobId: latestBlobId,
        aegisBlobId: undefined,
        onchainLinked: !!latestBlobId,
      };

    } catch (error) {
      console.error('[Aegis] Failed to anchor to Aegis:', error);
      return { result, onchainLinked: false };
    }
  }

  async getMarketData(poolName: string): Promise<{
    price: number;
    spread: number;
    depth: number;
    recentTrades: any[];
  }> {
    const [price, spread, depth, recentTrades] = await Promise.all([
      this.deepBookExecutor.getMarketPrice(poolName),
      this.deepBookExecutor.getSpread(poolName),
      this.deepBookExecutor.getOrderBookDepth(poolName),
      this.deepBookExecutor.getRecentTrades(poolName),
    ]);

    return { price, spread, depth, recentTrades };
  }

  async estimateSlippage(
    poolName: string,
    side: 'buy' | 'sell',
    quantity: number
  ): Promise<{
    expectedSlippage: number;
    worstCaseSlippage: number;
    isAcceptable: boolean;
    liquidity: number;
  }> {
    const estimate = await this.deepBookExecutor.estimateExecution({
      poolName,
      side,
      quantity,
      maxSlippageBps: 50,
    });

    return {
      expectedSlippage: estimate.expectedSlippage,
      worstCaseSlippage: estimate.worstCaseSlippage,
      isAcceptable: estimate.isAcceptable,
      liquidity: estimate.liquidity,
    };
  }

  getMemWalStatus(): { isConfigured: boolean; hasIntegration: boolean } {
    return {
      isConfigured: this.memwalIntegration?.memwal.isConfigured() || false,
      hasIntegration: !!this.memwalIntegration,
    };
  }
}

export function createCombinedExecutor(config: CombinedExecutorConfig): Promise<AegisDeepBookExecutor> {
  return AegisDeepBookExecutor.create(config);
}

export default AegisDeepBookExecutor;