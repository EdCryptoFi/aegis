'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
  aegisScore: number;
  status: 'Active' | 'Supervised' | 'Read Only' | 'Quarantined';
}

function computeScore(entry: Omit<LeaderboardEntry, 'rank' | 'aegisScore' | 'status'>): number {
  if (entry.isFlagged) return Math.round(Math.max(5, entry.successRate * 0.12) * 10) / 10;
  const perf = (entry.successRate / 100) * 42;
  const rel = (entry.uptimeScore / 100) * 28;
  const execMat = Math.min(entry.totalExecutions / 200, 1) * 15;
  const volSUI = entry.totalVolume / 1_000_000_000;
  const vol = Math.min(volSUI / 500, 1) * 15;
  return Math.round(Math.min(100, perf + rel + execMat + vol) * 10) / 10;
}

function deriveStatus(badge: string, isFlagged: boolean): LeaderboardEntry['status'] {
  if (isFlagged || badge === 'revoked') return 'Quarantined';
  if (badge === 'gold') return 'Active';
  if (badge === 'silver') return 'Supervised';
  return 'Read Only';
}

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
        const entry = {
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
          aegisScore: 0,
          status: 'Active' as LeaderboardEntry['status'],
        };
        entry.aegisScore = computeScore(entry);
        entry.status = deriveStatus(entry.badge, entry.isFlagged);
        agents.push(entry);
      }
    } catch (e) {
      console.error('Failed to fetch agent:', e);
    }
  }

  const list = agents.length > 0 ? agents : [
    { rank: 0, objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', agentId: '0x8c8598ab', name: 'AlphaTrader', uptimeScore: 100, successRate: 100, totalExecutions: 247, totalVolume: 2_100_000_000_000, isFlagged: false, badge: 'gold', aegisScore: 98.4, status: 'Active' as const },
    { rank: 0, objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', agentId: '0x8c8598ab', name: 'BetaBot', uptimeScore: 80, successRate: 91, totalExecutions: 67, totalVolume: 450_000_000_000, isFlagged: false, badge: 'silver', aegisScore: 82.1, status: 'Supervised' as const },
    { rank: 0, objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', agentId: '0x8c8598ab', name: 'GammaScam', uptimeScore: 0, successRate: 0, totalExecutions: 34, totalVolume: 0, isFlagged: true, badge: 'revoked', aegisScore: 12.0, status: 'Quarantined' as const },
  ];

  return list.sort((a, b) => {
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

const RANK_STYLES: Record<number, { color: string; label: string }> = {
  1: { color: 'text-yellow-400', label: '#1' },
  2: { color: 'text-slate-300', label: '#2' },
  3: { color: 'text-amber-600', label: '#3' },
};

const BADGE_COLORS: Record<string, string> = {
  gold: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  silver: 'bg-slate-400/10 text-slate-300 border-slate-400/30',
  bronze: 'bg-amber-700/10 text-amber-600 border-amber-700/30',
  revoked: 'bg-red-500/10 text-red-400 border-red-500/30',
  none: 'bg-surface-2 text-text-muted border-[rgba(255,255,255,0.08)]',
};

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
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <img src="/icons/icon-leaderboard.png" width={40} height={40} alt="" className="object-contain" />
            <h1 className="font-display text-5xl font-bold gradient-text-cyan">Rankings</h1>
          </div>
          <p className="text-text-secondary text-lg">Top AI agents ranked by on-chain performance</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { img: '/icons/icon-marketplace.png', label: 'Active Agents', value: leaderboard.length, color: 'text-cyan-primary' },
            { img: '/icons/icon-badge.png', label: 'Badges Awarded', value: leaderboard.filter(a => !a.isFlagged && a.badge !== 'none').length, color: 'text-mint-secondary' },
            { img: '/icons/icon-alert.png', label: 'Flagged', value: leaderboard.filter(a => a.isFlagged).length, color: 'text-red-400' },
          ].map(({ img, label, value, color }) => (
            <div key={label} className="rounded-2xl p-5 glass-card-heavy flex flex-col items-center gap-1">
              <img src={img} width={28} height={28} alt="" className="object-contain" />
              <span className={`font-display text-3xl font-bold ${color}`}>{value}</span>
              <span className="text-text-muted text-xs uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading leaderboard...</p>
          </div>
        ) : (
          <motion.div
            className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header row */}
            <div className="grid grid-cols-[40px_1fr_70px_80px_72px_96px_72px_96px] gap-2 px-5 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
              {['#', 'Agent', 'Badge', 'Score', 'Success', 'Volume', 'Uptime', 'Status'].map((col) => (
                <span key={col} className="text-text-muted text-[11px] font-semibold uppercase tracking-wider flex items-center">
                  {col}
                </span>
              ))}
            </div>

            {leaderboard.map((agent, i) => {
              const rankStyle = RANK_STYLES[agent.rank];
              const badgeColor = BADGE_COLORS[agent.badge] || BADGE_COLORS.none;
              const statusStyle =
                agent.status === 'Active' ? 'text-mint-secondary' :
                agent.status === 'Supervised' ? 'text-yellow-400' :
                agent.status === 'Read Only' ? 'text-orange-400' : 'text-red-400';
              const statusIcon =
                agent.status === 'Active' ? '✅' :
                agent.status === 'Supervised' ? '⚠️' :
                agent.status === 'Read Only' ? '🔒' : '❌';

              return (
                <Link
                  href={`/agent/${agent.objectId}`}
                  key={agent.objectId}
                  className={`
                    grid grid-cols-[40px_1fr_70px_80px_72px_96px_72px_96px] gap-2 px-5 py-4
                    border-b border-[rgba(255,255,255,0.04)] last:border-0
                    bg-surface-1 hover:bg-surface-2/60 transition-colors duration-150
                    ${agent.isFlagged ? 'opacity-50 border-l-2 border-l-red-500' : ''}
                  `}
                >
                  {/* Rank */}
                  <span className={`flex items-center font-display font-bold text-sm ${rankStyle ? rankStyle.color : 'text-text-muted'}`}>
                    {rankStyle ? rankStyle.label : `#${agent.rank}`}
                  </span>

                  {/* Name */}
                  <span className="flex flex-col justify-center">
                    <span className="text-text-primary font-semibold text-sm">{agent.name}</span>
                    <span className="font-mono text-text-muted text-[11px]">{agent.objectId.slice(0, 6)}...{agent.objectId.slice(-4)}</span>
                  </span>

                  {/* Badge */}
                  <span className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                      {agent.badge.toUpperCase()}
                    </span>
                  </span>

                  {/* Aegis Score */}
                  <span className="flex items-center">
                    <span className="font-mono text-sm font-bold text-cyan-primary">{agent.aegisScore}</span>
                  </span>

                  {/* Success */}
                  <span className="flex items-center font-mono text-sm text-mint-secondary font-semibold">
                    {agent.successRate}%
                  </span>

                  {/* Volume */}
                  <span className="flex items-center font-mono text-sm text-text-secondary">
                    {formatVolume(agent.totalVolume)}
                  </span>

                  {/* Uptime */}
                  <span className="flex items-center font-mono text-sm text-cyan-primary font-semibold">
                    {agent.uptimeScore}%
                  </span>

                  {/* Status */}
                  <span className={`flex items-center gap-1 text-[11px] font-semibold ${statusStyle}`}>
                    <span>{statusIcon}</span>
                    <span>{agent.status}</span>
                  </span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}
