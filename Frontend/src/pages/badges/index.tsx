'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BadgeHolder {
  agentId: string;
  objectId: string;
  badgeType: number;
  badgeName: string;
  agentName: string;
  uptimeScore: number;
  successRate: number;
  isValid: boolean;
  revokedReason?: string;
}

const BADGE_INFO = {
  3: { name: 'Gold', emoji: '🥇', description: '200+ execs, 95%+ success, $1M+ volume', color: '#ffd700' },
  2: { name: 'Silver', emoji: '🥈', description: '50+ execs, 90%+ success', color: '#c0c0c0' },
  1: { name: 'Bronze', emoji: '🥉', description: '10+ execs, 80%+ success', color: '#cd7f32' },
};

async function getBadgeHolders(): Promise<BadgeHolder[]> {
  const agents = [
    { objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', name: 'AlphaTrader', badge: 3, isValid: true },
    { objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', name: 'BetaBot', badge: 2, isValid: true },
    { objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', name: 'GammaScam', badge: 1, isValid: false },
  ];

  const holders: BadgeHolder[] = [];
  for (const agent of agents) {
    try {
      const response = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sui_getObject',
          params: [agent.objectId, { showContent: true }],
        }),
      });
      const data = await response.json();
      if (data.result?.data?.content?.dataType === 'moveObject') {
        const fields = data.result.data.content.fields;
        const totalEx = Number(fields.total_executions);
        const successEx = Number(fields.successful_executions);
        holders.push({
          agentId: fields.agent_id,
          objectId: agent.objectId,
          badgeType: agent.badge,
          badgeName: BADGE_INFO[agent.badge as keyof typeof BADGE_INFO]?.name || 'Unknown',
          agentName: agent.name,
          uptimeScore: Number(fields.uptime_score),
          successRate: totalEx > 0 ? Math.round((successEx / totalEx) * 100) : 100,
          isValid: agent.isValid,
        });
      }
    } catch (e) {
      console.error('Failed to fetch:', e);
    }
  }
  return holders;
}

export default function BadgesPage() {
  const [holders, setHolders] = useState<BadgeHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'gold' | 'silver' | 'bronze'>('all');

  useEffect(() => {
    loadBadges();
  }, []);

  async function loadBadges() {
    setLoading(true);
    const data = await getBadgeHolders();
    setHolders(data);
    setLoading(false);
  }

  const filtered = holders.filter(h => {
    if (filter === 'all') return true;
    if (filter === 'gold') return h.badgeType === 3;
    if (filter === 'silver') return h.badgeType === 2;
    if (filter === 'bronze') return h.badgeType === 1;
    return true;
  });

  const validCount = holders.filter(h => h.isValid).length;
  const revokedCount = holders.filter(h => !h.isValid).length;

  return (
    <main className="container">
      <header>
        <a href="/" className="back-link">← Back to Home</a>
        <h1>🏅 Aegis Badges</h1>
        <p className="subtitle">Certified agent trust badges</p>
      </header>

      <section className="stats">
        <div className="stat gold">
          <span className="emoji">🥇</span>
          <span className="count">{holders.filter(h => h.badgeType === 3 && h.isValid).length}</span>
          <span className="label">Gold</span>
        </div>
        <div className="stat silver">
          <span className="emoji">🥈</span>
          <span className="count">{holders.filter(h => h.badgeType === 2 && h.isValid).length}</span>
          <span className="label">Silver</span>
        </div>
        <div className="stat bronze">
          <span className="emoji">🥉</span>
          <span className="count">{holders.filter(h => h.badgeType === 1 && h.isValid).length}</span>
          <span className="label">Bronze</span>
        </div>
        <div className="stat revoked">
          <span className="emoji">🚫</span>
          <span className="count">{revokedCount}</span>
          <span className="label">Revoked</span>
        </div>
      </section>

      <section className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'gold' ? 'active' : ''} onClick={() => setFilter('gold')}>🥇 Gold</button>
        <button className={filter === 'silver' ? 'active' : ''} onClick={() => setFilter('silver')}>🥈 Silver</button>
        <button className={filter === 'bronze' ? 'active' : ''} onClick={() => setFilter('bronze')}>🥉 Bronze</button>
      </section>

      <section className="badge-cards">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading badges...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <p>No badges found for this filter.</p>
          </div>
        ) : (
          filtered.map((holder) => {
            const info = BADGE_INFO[holder.badgeType as keyof typeof BADGE_INFO];
            return (
              <Link href={`/agent/${holder.objectId}`} key={`${holder.objectId}-${holder.badgeType}`} className={`badge-card ${holder.isValid ? 'valid' : 'revoked'}`}>
                <div className="badge-header">
                  <span className="badge-emoji" style={{ fontSize: '32px' }}>{info?.emoji}</span>
                  <span className="badge-name" style={{ color: info?.color }}>{info?.name}</span>
                  {!holder.isValid && <span className="revoked-tag">REVOKED</span>}
                </div>
                <div className="agent-info">
                  <span className="agent-name">{holder.agentName}</span>
                  <span className="agent-id">{holder.agentId.slice(0, 8)}...{holder.agentId.slice(-4)}</span>
                </div>
                <div className="requirements">
                  <span className="req-label">{info?.description}</span>
                </div>
                <div className="metrics">
                  <div className="metric">
                    <span className="label">Uptime</span>
                    <span className="value">{holder.uptimeScore}%</span>
                  </div>
                  <div className="metric">
                    <span className="label">Success</span>
                    <span className="value">{holder.successRate}%</span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </section>

      <section className="info-section">
        <h2>How to Earn Badges</h2>
        <div className="badge-requirements">
          <div className="req-card gold">
            <span className="emoji">🥇</span>
            <h3>Gold Badge</h3>
            <ul>
              <li>200+ executions</li>
              <li>95%+ success rate</li>
              <li>$1,000,000+ total volume</li>
            </ul>
          </div>
          <div className="req-card silver">
            <span className="emoji">🥈</span>
            <h3>Silver Badge</h3>
            <ul>
              <li>50+ executions</li>
              <li>90%+ success rate</li>
            </ul>
          </div>
          <div className="req-card bronze">
            <span className="emoji">🥉</span>
            <h3>Bronze Badge</h3>
            <ul>
              <li>10+ executions</li>
              <li>80%+ success rate</li>
            </ul>
          </div>
        </div>
        <div className="warning-box">
          <h3>⚠️ Auto-Revocation</h3>
          <p>Badges are automatically revoked if:</p>
          <ul>
            <li>Success rate drops below threshold</li>
            <li>Agent is flagged (5+ consecutive failures, &gt;500 BPS slippage)</li>
            <li>Agent fails to maintain requirements</li>
          </ul>
        </div>
      </section>

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
        .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 30px;
          background: #1a1a2e;
          border-radius: 12px;
          min-width: 100px;
        }
        .stat .emoji {
          font-size: 32px;
        }
        .stat .count {
          font-size: 28px;
          font-weight: bold;
          color: #fff;
        }
        .stat .label {
          font-size: 12px;
          color: #888;
        }
        .stat.gold { border: 2px solid #ffd700; }
        .stat.silver { border: 2px solid #c0c0c0; }
        .stat.bronze { border: 2px solid #cd7f32; }
        .stat.revoked { border: 2px solid #ef4444; }
        .filters {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }
        .filters button {
          padding: 10px 20px;
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 20px;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filters button:hover {
          border-color: #8b5cf6;
          color: #fff;
        }
        .filters button.active {
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          border-color: transparent;
          color: #fff;
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
        .badge-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          max-width: 900px;
          margin: 0 auto 50px;
        }
        .badge-card {
          background: #1a1a2e;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .badge-card:hover {
          transform: translateY(-4px);
          border-color: #8b5cf6;
        }
        .badge-card.revoked {
          opacity: 0.6;
        }
        .badge-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .badge-name {
          font-size: 20px;
          font-weight: bold;
        }
        .revoked-tag {
          background: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
        }
        .agent-info {
          margin-bottom: 12px;
        }
        .agent-name {
          color: #fff;
          font-size: 16px;
          font-weight: bold;
          display: block;
        }
        .agent-id {
          color: #666;
          font-size: 12px;
          font-family: monospace;
        }
        .requirements {
          margin-bottom: 12px;
        }
        .req-label {
          color: #888;
          font-size: 12px;
        }
        .metrics {
          display: flex;
          gap: 20px;
        }
        .metric {
          display: flex;
          flex-direction: column;
        }
        .metric .label {
          color: #666;
          font-size: 10px;
        }
        .metric .value {
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        }
        .info-section {
          max-width: 900px;
          margin: 0 auto;
          padding-top: 40px;
          border-top: 1px solid #333;
        }
        .info-section h2 {
          color: #fff;
          text-align: center;
          margin-bottom: 30px;
        }
        .badge-requirements {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        @media (max-width: 768px) {
          .badge-requirements {
            grid-template-columns: 1fr;
          }
        }
        .req-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .req-card.gold { border: 2px solid #ffd700; }
        .req-card.silver { border: 2px solid #c0c0c0; }
        .req-card.bronze { border: 2px solid #cd7f32; }
        .req-card .emoji {
          font-size: 40px;
          display: block;
          margin-bottom: 10px;
        }
        .req-card h3 {
          color: #fff;
          margin: 0 0 10px 0;
        }
        .req-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          color: #888;
          font-size: 14px;
        }
        .req-card li {
          padding: 4px 0;
        }
        .warning-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          border-radius: 12px;
          padding: 20px;
        }
        .warning-box h3 {
          color: #ef4444;
          margin: 0 0 10px 0;
        }
        .warning-box p {
          color: #888;
          margin: 0 0 10px 0;
        }
        .warning-box ul {
          color: #888;
          margin: 0;
          padding-left: 20px;
        }
      `}</style>
    </main>
  );
}