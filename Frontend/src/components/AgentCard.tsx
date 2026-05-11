'use client';

import { useState, useEffect } from 'react';
import { config } from '../config';

interface ReputationData {
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
}

interface AgentStats {
  successRate: number;
  averageSlippage: number;
  estimatedUptime: string;
  trustLevel: 'High' | 'Medium' | 'Low' | 'Flagged';
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function formatSlippage(basisPoints: number): string {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

async function getAgentReputation(objectId: string): Promise<ReputationData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUI_RPC || 'https://fullnode.testnet.sui.io'}/rpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sui_getObject',
        params: [objectId, { showContent: true }],
      }),
    });
    const data = await response.json();
    if (data.result?.data?.content?.dataType === 'moveObject') {
      const fields = data.result.data.content.fields;
      return {
        agentId: fields.agent_id,
        totalExecutions: Number(fields.total_executions),
        successfulExecutions: Number(fields.successful_executions),
        failedExecutions: Number(fields.failed_executions),
        totalVolume: Number(fields.total_volume),
        totalSlippage: Number(fields.total_slippage),
        uptimeScore: Number(fields.uptime_score),
        lastUpdate: Number(fields.last_update),
        isFlagged: fields.is_flagged,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get agent reputation:', error);
    return null;
  }
}

function calculateAgentStats(data: ReputationData): AgentStats {
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

export default function AgentCard({ agentAddress }: { agentAddress: string }) {
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const successRate = reputation && reputation.totalExecutions > 0
    ? Math.round((reputation.successfulExecutions / reputation.totalExecutions) * 100)
    : 100;
  const totalExecutions = reputation?.totalExecutions || 0;
  const totalVolume = reputation?.totalVolume || 0;

  useEffect(() => {
    loadReputation();
  }, [agentAddress]);

  async function loadReputation() {
    setLoading(true);
    const rep = await getAgentReputation(agentAddress);
    if (rep) {
      setReputation(rep);
      setStats(calculateAgentStats(rep));
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="card loading">
        <div className="spinner"></div>
        <p>Loading reputation...</p>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="card empty">
        <h3>Agent Not Found</h3>
        <p>No reputation data available for this agent.</p>
        <p className="hint">Object ID: {agentAddress}</p>
      </div>
    );
  }

  const trustLevelColors: Record<string, string> = {
    High: '#22c55e',
    Medium: '#eab308',
    Low: '#f97316',
    Flagged: '#ef4444',
  };

  return (
    <div className="card">
      <div className="header">
        <h3>Agent Reputation</h3>
        <span
          className="badge"
          style={{ backgroundColor: trustLevelColors[stats?.trustLevel || 'Low'] }}
        >
          {stats?.trustLevel}
        </span>
      </div>

      <div className="metrics">
        <div className="metric">
          <span className="label">Uptime Score</span>
          <span className="value">{stats?.estimatedUptime}</span>
        </div>
        <div className="metric">
          <span className="label">Success Rate</span>
          <span className="value">{stats?.successRate}%</span>
        </div>
        <div className="metric">
          <span className="label">Total Executions</span>
          <span className="value">{reputation.totalExecutions}</span>
        </div>
        <div className="metric">
          <span className="label">Total Volume</span>
          <span className="value">{formatVolume(reputation.totalVolume)}</span>
        </div>
        <div className="metric">
          <span className="label">Avg Slippage</span>
          <span className="value">{formatSlippage(stats?.averageSlippage || 0)}</span>
        </div>
        <div className="metric">
          <span className="label">Agent ID</span>
          <span className="value address">{reputation.agentId?.slice(0, 10)}...</span>
        </div>
      </div>

      {reputation.isFlagged && (
        <div className="warning">
          <span className="icon">⚠️</span>
          <span>This agent has been flagged for suspicious activity.</span>
        </div>
      )}

      <div className="badge-eligibility">
        <h4>Badge Eligibility</h4>
        <div className="badges">
          <div className={`badge-item ${successRate >= 80 && totalExecutions >= 10 ? 'eligible' : 'not-eligible'}`}>
            <span className="emoji">🥉</span>
            <span className="name">Bronze</span>
            <span className="status">{successRate >= 80 && totalExecutions >= 10 ? '✓' : '✗'}</span>
          </div>
          <div className={`badge-item ${successRate >= 90 && totalExecutions >= 50 ? 'eligible' : 'not-eligible'}`}>
            <span className="emoji">🥈</span>
            <span className="name">Silver</span>
            <span className="status">{successRate >= 90 && totalExecutions >= 50 ? '✓' : '✗'}</span>
          </div>
          <div className={`badge-item ${successRate >= 95 && totalExecutions >= 200 && totalVolume >= 1_000_000_000_000 ? 'eligible' : 'not-eligible'}`}>
            <span className="emoji">🥇</span>
            <span className="name">Gold</span>
            <span className="status">{successRate >= 95 && totalExecutions >= 200 && totalVolume >= 1_000_000_000_000 ? '✓' : '✗'}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          max-width: 500px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header h3 {
          color: #fff;
          margin: 0;
        }
        .badge {
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .metric {
          display: flex;
          flex-direction: column;
        }
        .label {
          color: #888;
          font-size: 12px;
          margin-bottom: 4px;
        }
        .value {
          color: #fff;
          font-size: 18px;
          font-weight: bold;
        }
        .value.address {
          font-size: 12px;
          font-family: monospace;
        }
        .warning {
          margin-top: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid #ef4444;
          border-radius: 8px;
          color: #ef4444;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .loading, .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #888;
        }
        .hint {
          font-size: 12px;
          color: #666;
          font-family: monospace;
        }
        .badge-eligibility {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #333;
        }
        .badge-eligibility h4 {
          color: #fff;
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        .badges {
          display: flex;
          gap: 12px;
        }
        .badge-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: #0f0f1a;
          border-radius: 8px;
          border: 1px solid #333;
        }
        .badge-item.eligible {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
        }
        .badge-item.not-eligible {
          opacity: 0.5;
        }
        .badge-item .emoji {
          font-size: 20px;
        }
        .badge-item .name {
          color: #888;
          font-size: 10px;
          margin-top: 4px;
        }
        .badge-item .status {
          font-size: 14px;
          margin-top: 4px;
        }
        .badge-item.eligible .status {
          color: #22c55e;
        }
        .badge-item.not-eligible .status {
          color: #ef4444;
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #333;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}