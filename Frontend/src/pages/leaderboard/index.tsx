'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, AlertTriangle, Award } from 'lucide-react';

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
            <Trophy size={28} className="text-cyan-primary" />
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
            { icon: TrendingUp, label: 'Active Agents', value: leaderboard.length, color: 'text-cyan-primary' },
            { icon: Award, label: 'Badges Awarded', value: leaderboard.filter(a => !a.isFlagged && a.badge !== 'none').length, color: 'text-mint-secondary' },
            { icon: AlertTriangle, label: 'Flagged', value: leaderboard.filter(a => a.isFlagged).length, color: 'text-red-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl p-5 glass-card-heavy flex flex-col items-center gap-1">
              <Icon size={18} className={color} />
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
            <div className="grid grid-cols-[48px_1fr_80px_80px_80px_100px_90px] gap-3 px-5 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
              {['#', 'Agent', 'Badge', 'Uptime', 'Success', 'Execs', 'Volume'].map((col) => (
                <span key={col} className="text-text-muted text-[11px] font-semibold uppercase tracking-wider flex items-center">
                  {col}
                </span>
              ))}
            </div>

            {leaderboard.map((agent, i) => {
              const rankStyle = RANK_STYLES[agent.rank];
              const badgeColor = BADGE_COLORS[agent.badge] || BADGE_COLORS.none;

              return (
                <Link
                  href={`/agent/${agent.objectId}`}
                  key={agent.objectId}
                  className={`
                    grid grid-cols-[48px_1fr_80px_80px_80px_100px_90px] gap-3 px-5 py-4
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

                  {/* Uptime */}
                  <span className="flex items-center font-mono text-sm text-cyan-primary font-semibold">
                    {agent.uptimeScore}%
                  </span>

                  {/* Success */}
                  <span className="flex items-center font-mono text-sm text-mint-secondary font-semibold">
                    {agent.successRate}%
                  </span>

                  {/* Executions */}
                  <span className="flex items-center font-mono text-sm text-text-primary">
                    {agent.totalExecutions}
                  </span>

                  {/* Volume */}
                  <span className="flex items-center font-mono text-sm text-text-secondary">
                    {formatVolume(agent.totalVolume)} SUI
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
