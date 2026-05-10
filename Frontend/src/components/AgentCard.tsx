'use client';

import { useState, useEffect } from 'react';
import { getAgentReputation, calculateAgentStats, formatVolume, formatSlippage } from '@aegis/sdk';
import type { ReputationData, AgentStats } from '@aegis/sdk';

export default function AgentCard({ agentAddress }: { agentAddress: string }) {
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

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
      </div>

      {reputation.isFlagged && (
        <div className="warning">
          <span className="icon">⚠️</span>
          <span>This agent has been flagged for suspicious activity.</span>
        </div>
      )}

      <style jsx>{`
        .card {
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
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
