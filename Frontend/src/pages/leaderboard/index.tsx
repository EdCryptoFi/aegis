'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, TrendingUp, AlertTriangle, Award, RefreshCw, Zap, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getAllAgents } from '../../lib/sdk';

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

const KNOWN_NAMES: Record<string, string> = {
  '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc': 'AlphaTrader',
  '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec': 'BetaBot',
  '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6': 'GammaScam',
};

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 0, objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', agentId: '0x8c8598ab', name: 'AlphaTrader', uptimeScore: 99, successRate: 99, totalExecutions: 247, totalVolume: 2_100_000_000_000, isFlagged: false, badge: 'gold', aegisScore: 98.4, status: 'Active' as const },
  { rank: 0, objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', agentId: '0x8c8598ab', name: 'BetaBot', uptimeScore: 95, successRate: 91, totalExecutions: 67, totalVolume: 450_000_000_000, isFlagged: false, badge: 'silver', aegisScore: 82.1, status: 'Supervised' as const },
  { rank: 0, objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', agentId: '0x8c8598ab', name: 'GammaScam', uptimeScore: 41, successRate: 41, totalExecutions: 34, totalVolume: 45_000_000_000, isFlagged: true, badge: 'revoked', aegisScore: 12.0, status: 'Quarantined' as const },
];

function deriveBadge(score: number, isFlagged: boolean): string {
  if (isFlagged) return 'revoked';
  if (score >= 90) return 'gold';
  if (score >= 70) return 'silver';
  if (score >= 50) return 'bronze';
  return 'none';
}

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  // Fetch demo agents from server store
  let demoEntries: LeaderboardEntry[] = [];
  try {
    const demoRes = await fetch('/api/agents/demo');
    const demoData = await demoRes.json();
    if (demoData.success && demoData.agents?.length > 0) {
      demoEntries = demoData.agents.map((a: any, i: number) => {
        const score = computeScore({
          objectId: a.objectId, agentId: a.objectId,
          name: a.name, uptimeScore: a.uptimeScore, successRate: a.successRate,
          totalExecutions: a.totalExecutions, totalVolume: a.totalVolume,
          isFlagged: a.isFlagged, badge: a.badge,
        });
        const badge = deriveBadge(score, a.isFlagged);
        return {
          rank: 0, objectId: a.objectId, agentId: a.objectId,
          name: a.name, uptimeScore: a.uptimeScore, successRate: a.successRate,
          totalExecutions: a.totalExecutions, totalVolume: a.totalVolume,
          isFlagged: a.isFlagged, badge, aegisScore: score,
          status: deriveStatus(badge, a.isFlagged),
        };
      });
    }
  } catch {}

  let blockchainAgents: LeaderboardEntry[] = [];

  try {
    const sdkAgents = await getAllAgents();
    if (sdkAgents.length > 0) {
      blockchainAgents = sdkAgents.map((agent) => {
        const rep = agent.reputation;
        const totalEx = rep.totalExecutions;
        const successEx = rep.successfulExecutions;
        const successRate = totalEx > 0 ? Math.round((successEx / totalEx) * 100) : 100;
        const score = computeScore({
          objectId: rep.objectId,
          agentId: rep.agentId,
          name: KNOWN_NAMES[rep.objectId] || `Agent ${rep.objectId.slice(0, 6)}...`,
          uptimeScore: rep.uptimeScore,
          successRate,
          totalExecutions: totalEx,
          totalVolume: rep.totalVolume,
          isFlagged: rep.isFlagged,
          badge: '',
        });
        const badge = deriveBadge(score, rep.isFlagged);
        return {
          rank: 0,
          objectId: rep.objectId,
          agentId: rep.agentId,
          name: KNOWN_NAMES[rep.objectId] || `Agent ${rep.objectId.slice(0, 6)}...`,
          uptimeScore: rep.uptimeScore,
          successRate,
          totalExecutions: totalEx,
          totalVolume: rep.totalVolume,
          isFlagged: rep.isFlagged,
          badge,
          aegisScore: score,
          status: deriveStatus(badge, rep.isFlagged),
        };
      });
    }
  } catch (e) {
    console.log('Chain fetch failed, trying RPC fallback:', e);
  }

  // Fallback: try direct RPC for known agents
  if (blockchainAgents.length === 0) {
    try {
      for (const demo of DEMO_LEADERBOARD) {
        const res = await fetch('https://fullnode.testnet.sui.io:443', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'sui_getObject',
            params: [demo.objectId, { showContent: true }],
          }),
        });
        const d = await res.json();
        if (d.result?.data?.content?.dataType === 'moveObject') {
          const fields = d.result.data.content.fields;
          const totalEx = Number(fields.total_executions);
          const successEx = Number(fields.successful_executions);
          const entry: LeaderboardEntry = {
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
            status: 'Active',
          };
          entry.aegisScore = computeScore(entry);
          entry.status = deriveStatus(entry.badge, entry.isFlagged);
          blockchainAgents.push(entry);
        }
      }
    } catch (e) {
      console.log('RPC fallback failed:', e);
    }
  }

  // Merge blockchain agents with demo store agents
  const combined = [...(blockchainAgents.length > 0 ? blockchainAgents : DEMO_LEADERBOARD), ...demoEntries];

  // Deduplicate by objectId (demo store takes precedence for display)
  const seen = new Set<string>();
  const merged = combined.filter(a => {
    if (seen.has(a.objectId)) return false;
    seen.add(a.objectId);
    return true;
  });

  return merged
    .sort((a, b) => {
      if (a.isFlagged !== b.isFlagged) return a.isFlagged ? 1 : -1;
      if (b.aegisScore !== a.aegisScore) return b.aegisScore - a.aegisScore;
      return b.totalExecutions - a.totalExecutions;
    })
    .map((agent, i) => ({ ...agent, rank: i + 1 }));
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
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    setLoading(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setLastSync(new Date());
    setLoading(false);
  }

  async function syncFromChain() {
    setSyncing(true);
    const data = await getLeaderboard();
    setLeaderboard(data);
    setLastSync(new Date());
    setSyncing(false);
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
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-cyan-primary" />
              <h1 className="font-display text-5xl font-bold gradient-text-cyan">Rankings</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={syncFromChain}
                disabled={syncing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-cyan-primary/30 text-cyan-primary text-sm font-medium hover:bg-cyan-primary/[0.08] hover:shadow-glow-cyan transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
              <Link
                href="/developer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all shadow-glow-cyan"
              >
                <Plus size={14} /> Register Agent
              </Link>
            </div>
          </div>
          <p className="text-text-secondary text-lg">Top AI agents ranked by on-chain performance</p>
          <p className="text-text-muted text-sm mt-2 font-mono flex items-center gap-4">
            <span>Click on an agent for Full Analytics Dashboard</span>
            {lastSync && (
              <span className="text-text-muted/60">
                Last sync: {lastSync.toLocaleTimeString()}
              </span>
            )}
          </p>
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
