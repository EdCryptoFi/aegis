'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '../config';

interface AgentInfo {
  objectId: string;
  agentId: string;
  totalExecutions: number;
  successfulExecutions: number;
  uptimeScore: number;
  totalVolume: number;
  isFlagged: boolean;
}

async function getAllAgents(): Promise<AgentInfo[]> {
  const demoAgents = [
    { objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'AlphaTrader', badge: 'gold' },
    { objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'BetaBot', badge: 'silver' },
    { objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'GammaScam', badge: 'revoked' },
  ];

  const agents: AgentInfo[] = [];
  for (const demo of demoAgents) {
    try {
      const response = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sui_getObject',
          params: [demo.objectId, { showContent: true }],
        }),
      });
      const data = await response.json();
      if (data.result?.data?.content?.dataType === 'moveObject') {
        const fields = data.result.data.content.fields;
        agents.push({
          objectId: demo.objectId,
          agentId: fields.agent_id,
          totalExecutions: Number(fields.total_executions),
          successfulExecutions: Number(fields.successful_executions),
          uptimeScore: Number(fields.uptime_score),
          totalVolume: Number(fields.total_volume),
          isFlagged: fields.is_flagged,
        });
      }
    } catch (e) {
      console.error('Failed to fetch agent:', e);
    }
  }
  return agents;
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function getTrustLevel(agent: AgentInfo): string {
  if (agent.isFlagged) return 'FLAGGED';
  const successRate = agent.totalExecutions > 0
    ? (agent.successfulExecutions / agent.totalExecutions) * 100 : 100;
  if (successRate >= 95 && agent.totalExecutions >= 50) return 'HIGH';
  if (successRate >= 80 && agent.totalExecutions >= 10) return 'MEDIUM';
  return 'LOW';
}

function getTrustColor(level: string): string {
  switch (level) {
    case 'HIGH': return '#22c55e';
    case 'MEDIUM': return '#eab308';
    case 'LOW': return '#f97316';
    case 'FLAGGED': return '#ef4444';
    default: return '#888';
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'uptime' | 'volume' | 'executions'>('uptime');

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setLoading(true);
    const data = await getAllAgents();
    setAgents(data);
    setLoading(false);
  }

  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'uptime': return b.uptimeScore - a.uptimeScore;
      case 'volume': return b.totalVolume - a.totalVolume;
      case 'executions': return b.totalExecutions - a.totalExecutions;
      default: return 0;
    }
  });

  return (
    <main className="container">
      <header>
        <Link href="/" className="back-link">← Back to Home</Link>
        <h1>Registered Agents</h1>
        <p className="subtitle">Explore all agents registered on Aegis</p>
      </header>

      <section className="controls">
        <div className="sort-buttons">
          <span>Sort by:</span>
          <button
            className={sortBy === 'uptime' ? 'active' : ''}
            onClick={() => setSortBy('uptime')}
          >
            Uptime Score
          </button>
          <button
            className={sortBy === 'volume' ? 'active' : ''}
            onClick={() => setSortBy('volume')}
          >
            Volume
          </button>
          <button
            className={sortBy === 'executions' ? 'active' : ''}
            onClick={() => setSortBy('executions')}
          >
            Executions
          </button>
        </div>
        <div className="count">{agents.length} agents found</div>
      </section>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading agents...</p>
        </div>
      ) : (
        <section className="agents-grid">
          {sortedAgents.map((agent, i) => {
            const level = getTrustLevel(agent);
            const successRate = agent.totalExecutions > 0
              ? Math.round((agent.successfulExecutions / agent.totalExecutions) * 100) : 100;
            return (
              <Link href={`/agent/${agent.objectId}`} key={agent.objectId} className="agent-card">
                <div className="rank">#{i + 1}</div>
                <div className="info">
                  <div className="header">
                    <span className="object-id">{agent.objectId.slice(0, 8)}...{agent.objectId.slice(-4)}</span>
                    <span className="trust-badge" style={{ backgroundColor: getTrustColor(level) }}>
                      {level}
                    </span>
                  </div>
                  <div className="metrics">
                    <div className="metric">
                      <span className="label">Uptime</span>
                      <span className="value">{agent.uptimeScore}%</span>
                    </div>
                    <div className="metric">
                      <span className="label">Success</span>
                      <span className="value">{successRate}%</span>
                    </div>
                    <div className="metric">
                      <span className="label">Volume</span>
                      <span className="value">{formatVolume(agent.totalVolume)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0f0f1a;
          padding: 40px 20px;
        }
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        .back-link {
          color: #8b5cf6;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 36px;
          color: #fff;
          margin: 0;
        }
        .subtitle {
          color: #888;
          margin-top: 8px;
        }
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 900px;
          margin: 0 auto 30px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .sort-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .sort-buttons span {
          color: #888;
          font-size: 14px;
        }
        .sort-buttons button {
          padding: 8px 16px;
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 8px;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sort-buttons button:hover {
          border-color: #8b5cf6;
          color: #fff;
        }
        .sort-buttons button.active {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-color: transparent;
          color: #fff;
        }
        .count {
          color: #888;
          font-size: 14px;
        }
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #888;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
        }
        .agent-card {
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 20px;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          gap: 16px;
        }
        .agent-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }
        .rank {
          font-size: 24px;
          font-weight: bold;
          color: #8b5cf6;
          min-width: 40px;
        }
        .info {
          flex: 1;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .object-id {
          color: #fff;
          font-family: monospace;
          font-size: 14px;
        }
        .trust-badge {
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .metric {
          display: flex;
          flex-direction: column;
        }
        .label {
          color: #666;
          font-size: 10px;
        }
        .value {
          color: #fff;
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}