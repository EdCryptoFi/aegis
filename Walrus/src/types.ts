export interface ReputationData {
  agentId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  totalSlippage: number;
  uptimeScore: number;
  lastUpdate: number;
  isFlagged: boolean;
  walrusBlobId: string | null;
}

export interface AgentStats {
  successRate: number;
  averageSlippage: number;
  estimatedUptime: string;
  trustLevel: 'High' | 'Medium' | 'Low' | 'Flagged';
}

export interface ExecutionLog {
  execution_id: number;
  action: string;
  params: string;
  result: string;
  gas_used: number;
  timestamp: number;
}

export interface AgentLog {
  agent_id: string;
  logs: ExecutionLog[];
  created_at: number;
  updated_at: number;
}
