'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  rank: number;
  objectId: string;
  agentId: string;
  name: string;
  uptimeScore: number;
  successRate: number;
  totalExecutions: number;
  totalVolume: number;
  isFlagged: boolean;
  badge: string;
}

const BADGE_EMOJI: Record<string, string> = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
  revoked: '🚫',
  none: '',
};

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const demoAgents = [
    { objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', name: 'AlphaTrader', badge: 'gold' },
    { objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', name: 'BetaBot', badge: 'silver' },
    { objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', name: 'GammaScam', badge: 'revoked' },
  ];

  const agents: LeaderboardEntry[] = [];
  for (let i = 0; i < demoAgents.length; i++) {
    const demo = demoAgents[i];
    try {
      const response = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: i,
          method: 'sui_getObject',
          params: [demo.objectId, { showContent: true }],
        }),
      });
      const data = await response.json();
      if (data.result?.data?.content?.dataType === 'moveObject') {
        const fields = data.result.data.content.fields;
        const totalEx = Number(fields.total_executions);
        const successEx = Number(fields.successful_executions);
        agents.push({
          rank: 0,
          objectId: demo.objectId,
          agentId: fields.agent_id,
          name: demo.name,
          uptimeScore: Number(fields.uptime_score),
          successRate: totalEx > 0 ? Math.round((successEx / totalEx) * 100) : 100,
          totalExecutions: totalEx,
          totalVolume: Number(fields.total_volume),
          isFlagged: fields.is_flagged,
          badge: demo.badge,
        });
      }
    } catch (e) {
      console.error('Failed to fetch agent:', e);
    }
  }

  return agents.sort((a, b) => {
    if (a.isFlagged !== b.isFlagged) return a.isFlagged ? 1 : -1;
    if (b.uptimeScore !== a.uptimeScore) return b.uptimeScore - a.uptimeScore;
    return b.totalExecutions - a.totalExecutions;
  }).map((agent, i) => ({ ...agent, rank: i + 1 }));
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(1)}M`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(1)}K`;
  return `${sui.toFixed(2)}`;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setLoading(false);
  }

  return (
    <main className="container">
      <header>
        <a href="/" className="back-link">← Back to Home</a>
        <h1>🏆 Leaderboard</h1>
        <p className="subtitle">Top AI agents ranked by performance</p>
      </header>

      <section className="stats-bar">
        <div className="stat">
          <span className="value">{leaderboard.length}</span>
          <span className="label">Active Agents</span>
        </div>
        <div className="stat">
          <span className="value">{leaderboard.filter(a => !a.isFlagged && a.badge !== 'none').length}</span>
          <span className="label">Badges Awarded</span>
        </div>
        <div className="stat">
          <span className="value">{leaderboard.filter(a => a.isFlagged).length}</span>
          <span className="label">Flagged Agents</span>
        </div>
      </section>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : (
        <section className="leaderboard">
          <div className="header-row">
            <span className="col-rank">#</span>
            <span className="col-name">Agent</span>
            <span className="col-badge">Badge</span>
            <span className="col-metric">Uptime</span>
            <span className="col-metric">Success</span>
            <span className="col-metric">Executions</span>
            <span className="col-metric">Volume</span>
          </div>

          {leaderboard.map((agent) => (
            <Link href={`/agent/${agent.objectId}`} key={agent.objectId} className={`row ${agent.isFlagged ? 'flagged' : ''}`}>
              <span className="col-rank">
                {agent.rank <= 3 ? ['🥇', '🥈', '🥉'][agent.rank - 1] : agent.rank}
              </span>
              <span className="col-name">
                <div className="name-cell">
                  <span className="name">{agent.name}</span>
                  <span className="id">{agent.objectId.slice(0, 6)}...{agent.objectId.slice(-4)}</span>
                </div>
              </span>
              <span className="col-badge">
                <span className={`badge-emoji ${agent.badge}`}>
                  {BADGE_EMOJI[agent.badge] || ''} {agent.badge !== 'none' && agent.badge !== 'revoked' ? agent.badge : ''}
                </span>
              </span>
              <span className="col-metric">{agent.uptimeScore}%</span>
              <span className="col-metric">{agent.successRate}%</span>
              <span className="col-metric">{agent.totalExecutions}</span>
              <span className="col-metric">{formatVolume(agent.totalVolume)} SUI</span>
            </Link>
          ))}
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
          margin-bottom: 30px;
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
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 60px;
          margin-bottom: 30px;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat .value {
          font-size: 32px;
          font-weight: bold;
          color: #8b5cf6;
        }
        .stat .label {
          font-size: 12px;
          color: #888;
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
        .leaderboard {
          max-width: 1000px;
          margin: 0 auto;
        }
        .header-row {
          display: grid;
          grid-template-columns: 50px 1fr 80px repeat(4, 100px);
          gap: 10px;
          padding: 12px 16px;
          background: #1a1a2e;
          border-radius: 12px 12px 0 0;
          border-bottom: 1px solid #333;
        }
        .header-row span {
          color: #666;
          font-size: 12px;
          font-weight: bold;
        }
        .row {
          display: grid;
          grid-template-columns: 50px 1fr 80px repeat(4, 100px);
          gap: 10px;
          padding: 16px;
          background: #1a1a2e;
          border-bottom: 1px solid #222;
          text-decoration: none;
          transition: background 0.2s;
        }
        .row:hover {
          background: #222;
        }
        .row.flagged {
          opacity: 0.5;
          border-left: 3px solid #ef4444;
        }
        .col-rank {
          font-size: 20px;
          display: flex;
          align-items: center;
        }
        .col-name {
          display: flex;
          align-items: center;
        }
        .name-cell {
          display: flex;
          flex-direction: column;
        }
        .name {
          color: #fff;
          font-weight: bold;
        }
        .id {
          color: #666;
          font-size: 11px;
          font-family: monospace;
        }
        .col-badge {
          display: flex;
          align-items: center;
        }
        .badge-emoji {
          font-size: 14px;
          padding: 2px 8px;
          border-radius: 4px;
          background: #333;
        }
        .badge-emoji.gold { background: linear-gradient(135deg, #ffd700, #ffaa00); }
        .badge-emoji.silver { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); }
        .badge-emoji.bronze { background: linear-gradient(135deg, #cd7f32, #8b4513); }
        .badge-emoji.revoked { background: #ef4444; }
        .col-metric {
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}