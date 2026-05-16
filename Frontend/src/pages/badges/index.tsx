'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Shield, ShieldOff, AlertTriangle, Code2, ArrowRight, Activity, TrendingUp, Zap, BarChart2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface BadgeHolder {
  agentId: string;
  objectId: string;
  badgeType: number;
  badgeName: string;
  agentName: string;
  uptimeScore: number;
  successRate: number;
  totalExecutions: number;
  totalVolume: number;
  isValid: boolean;
  revokedReason?: string;
}

const BADGE_INFO = {
  3: {
    name: 'GOLD LEVEL',
    shortName: 'Gold',
    emoji: '⭐',
    description: '200+ execs, 95%+ success, $1M+ volume',
    accessLabel: 'AUTONOMOUS - UNRESTRICTED',
    accessDesc: 'Full permission for autonomous execution of critical tasks and access to production systems.',
    level: 'LVL 5',
    border: 'border-yellow-400/60',
    glow: 'shadow-[0_0_40px_rgba(255,215,0,0.2),0_0_1px_rgba(255,215,0,0.6)]',
    outerRing: 'border-yellow-400/80',
    accent: '#ffd700',
    accentText: 'text-yellow-400',
    accentBg: 'bg-yellow-400/10',
    ballFrom: 'from-yellow-300',
    ballTo: 'to-yellow-600',
    ballShadow: 'shadow-[0_0_60px_rgba(255,215,0,0.4),inset_0_2px_8px_rgba(255,255,255,0.3)]',
    labelColor: 'text-yellow-400',
    accessBg: 'bg-yellow-400/[0.12]',
    accessText: 'text-yellow-300',
  },
  2: {
    name: 'SILVER LEVEL',
    shortName: 'Silver',
    emoji: '🏅',
    description: '50+ execs, 90%+ success',
    accessLabel: 'SUPERVISED',
    accessDesc: 'Task execution under supervision. Requires human approval for destructive or production-level actions.',
    level: 'LVL 3',
    border: 'border-slate-400/60',
    glow: 'shadow-[0_0_40px_rgba(192,192,192,0.2),0_0_1px_rgba(192,192,192,0.5)]',
    outerRing: 'border-slate-400/80',
    accent: '#c0c0c0',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-400/10',
    ballFrom: 'from-slate-200',
    ballTo: 'to-slate-500',
    ballShadow: 'shadow-[0_0_60px_rgba(192,192,192,0.3),inset_0_2px_8px_rgba(255,255,255,0.25)]',
    labelColor: 'text-slate-300',
    accessBg: 'bg-slate-400/[0.10]',
    accessText: 'text-slate-200',
  },
  1: {
    name: 'BRONZE LEVEL',
    shortName: 'Bronze',
    emoji: '🛡️',
    description: '10+ execs, 80%+ success',
    accessLabel: 'RESTRICTED - READ ONLY',
    accessDesc: 'Restricted access for read-only operations and non-sensitive data processing in a sandbox environment.',
    level: 'LVL 1',
    border: 'border-amber-600/60',
    glow: 'shadow-[0_0_40px_rgba(180,83,9,0.25),0_0_1px_rgba(205,127,50,0.5)]',
    outerRing: 'border-amber-600/80',
    accent: '#cd7f32',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-600/10',
    ballFrom: 'from-amber-400',
    ballTo: 'to-amber-800',
    ballShadow: 'shadow-[0_0_60px_rgba(205,127,50,0.3),inset_0_2px_8px_rgba(255,255,255,0.15)]',
    labelColor: 'text-amber-500',
    accessBg: 'bg-amber-600/[0.10]',
    accessText: 'text-amber-300',
  },
};

const REVOKED_INFO = {
  name: 'REVOKED',
  shortName: 'Revoked',
  emoji: '🚫',
  description: 'Credentials revoked',
  accessLabel: 'DISABLED / QUARANTINE',
  accessDesc: 'Credentials revoked due to security violation or anomalous behavior. Access blocked.',
  level: 'LVL 0',
  border: 'border-red-600/60',
  glow: 'shadow-[0_0_40px_rgba(239,68,68,0.2),0_0_1px_rgba(239,68,68,0.5)]',
  outerRing: 'border-red-600/80',
  accent: '#ef4444',
  accentText: 'text-red-400',
  accentBg: 'bg-red-500/10',
  ballFrom: 'from-red-700',
  ballTo: 'to-red-900',
  ballShadow: 'shadow-[0_0_60px_rgba(239,68,68,0.3),inset_0_2px_8px_rgba(255,255,255,0.08)]',
  labelColor: 'text-red-400',
  accessBg: 'bg-red-500/[0.12]',
  accessText: 'text-red-300',
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
          badgeName: BADGE_INFO[agent.badge as keyof typeof BADGE_INFO]?.shortName || 'Unknown',
          agentName: agent.name,
          uptimeScore: Number(fields.uptime_score),
          successRate: totalEx > 0 ? Math.round((successEx / totalEx) * 100) : 100,
          totalExecutions: totalEx,
          totalVolume: Number(fields.total_volume),
          isValid: agent.isValid,
        });
      }
    } catch (e) {
      console.error('Failed to fetch:', e);
    }
  }
  if (holders.length === 0) {
    return [
      { agentId: '0x8c8598ab', objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', badgeType: 3, badgeName: 'Gold', agentName: 'AlphaTrader', uptimeScore: 100, successRate: 100, totalExecutions: 247, totalVolume: 2_100_000_000_000, isValid: true },
      { agentId: '0x8c8598ab', objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', badgeType: 2, badgeName: 'Silver', agentName: 'BetaBot', uptimeScore: 80, successRate: 91, totalExecutions: 67, totalVolume: 450_000_000_000, isValid: true },
      { agentId: '0x8c8598ab', objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', badgeType: 1, badgeName: 'Bronze', agentName: 'GammaScam', uptimeScore: 0, successRate: 0, totalExecutions: 34, totalVolume: 0, isValid: false, revokedReason: 'Success rate dropped below 50%' },
    ];
  }
  return holders;
}

/* ─── Mini chart data per tier ─── */
const MINI_CHARTS: Record<string, { points: string; color: string; label: string }> = {
  '3': { points: '0,22 10,18 20,14 30,10 40,7 50,5 60,3 70,2 80,1', color: '#ffd700', label: 'Peak performance' },
  '2': { points: '0,22 10,20 20,17 30,15 40,13 50,11 60,10 70,9 80,8', color: '#c0c0c0', label: 'Steady growth' },
  '1': { points: '0,22 10,21 20,20 30,19 40,18 50,17 60,16 70,15 80,14', color: '#cd7f32', label: 'Early track record' },
  revoked: { points: '0,4 10,7 20,10 30,13 40,16 50,18 60,20 70,21 80,22', color: '#ef4444', label: 'Performance violation' },
};

type FilterType = 'all' | 'gold' | 'silver' | 'bronze' | 'revoked';

const ISSUE_DATES: Record<string, string> = {
  '0x4cd8': '2026-01-15',
  '0xabed': '2026-03-22',
  '0xb3fa': '2026-05-10',
};

function formatVol(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `$${(sui / 1_000_000).toFixed(1)}M`;
  if (sui >= 1_000) return `$${(sui / 1_000).toFixed(0)}K`;
  if (sui === 0) return '$0';
  return `${sui.toFixed(1)} SUI`;
}

export default function BadgesPage() {
  const [holders, setHolders] = useState<BadgeHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => { loadBadges(); }, []);

  async function loadBadges() {
    setLoading(true);
    const data = await getBadgeHolders();
    setHolders(data);
    setLoading(false);
  }

  const filtered = holders.filter(h => {
    if (filter === 'all') return true;
    if (filter === 'gold') return h.badgeType === 3 && h.isValid;
    if (filter === 'silver') return h.badgeType === 2 && h.isValid;
    if (filter === 'bronze') return h.badgeType === 1 && h.isValid;
    if (filter === 'revoked') return !h.isValid;
    return true;
  });

  const revokedCount = holders.filter(h => !h.isValid).length;

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'gold', label: '🥇 Gold' },
    { key: 'silver', label: '🥈 Silver' },
    { key: 'bronze', label: '🥉 Bronze' },
    { key: 'revoked', label: '🚫 Revoked' },
  ];

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <Award size={28} className="text-cyan-primary" />
              <h1 className="font-display text-5xl font-bold gradient-text-cyan">Badge Registry</h1>
            </div>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-cyan-primary/[0.08] border border-cyan-primary/30 text-cyan-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.14] hover:shadow-glow-cyan transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <Code2 size={14} />
              Integrate your Agent
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-text-secondary text-lg">Certified agent trust badges on Sui</p>
        </motion.div>

        {/* Registry Explanation */}
        <motion.div
          className="mb-10 rounded-2xl border border-cyan-primary/20 bg-cyan-primary/[0.04] overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="px-6 py-5 border-b border-cyan-primary/10">
            <p className="text-text-secondary text-sm leading-relaxed">
              The <span className="text-cyan-primary font-semibold">Badge Registry</span> is Aegis&apos;s trust certification system for autonomous agents on Sui. It evaluates real-world performance - success rate, processed volume, uptime - and assigns verification badges (Gold, Silver, Bronze) that determine access levels and permissions. The registry updates in real-time and is integrated on-chain for full public auditability. Performance drops or violations trigger <span className="text-red-400 font-semibold">automatic revocation</span>, instantly removing agent privileges.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(255,255,255,0.06)]">
            {[
              { text: 'Evaluates agents via objective on-chain metrics (executions, success rate, volume)' },
              { text: 'Classifies into 3 tiers: Gold (LVL 5), Silver (LVL 3), Bronze (LVL 1)' },
              { text: 'Controls access permissions automatically based on tier classification' },
              { text: 'Monitors continuously and revokes credentials on failure or violation' },
              { text: 'Records everything on-chain for full transparency and public audit' },
            ].map(({ text }, i) => (
              <div key={i} className="flex items-start gap-2.5 px-4 py-3">
                <span className="text-cyan-primary text-xs font-mono font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-text-muted text-xs leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            { emoji: '🥇', label: 'Gold', count: holders.filter(h => h.badgeType === 3 && h.isValid).length, border: 'border-yellow-400/40' },
            { emoji: '🥈', label: 'Silver', count: holders.filter(h => h.badgeType === 2 && h.isValid).length, border: 'border-slate-400/40' },
            { emoji: '🥉', label: 'Bronze', count: holders.filter(h => h.badgeType === 1 && h.isValid).length, border: 'border-amber-600/40' },
            { emoji: '🚫', label: 'Revoked', count: revokedCount, border: 'border-red-500/40' },
          ].map(({ emoji, label, count, border }) => (
            <div key={label} className={`rounded-2xl p-5 glass-card-heavy border ${border} flex flex-col items-center gap-1`}>
              <span className="text-2xl">{emoji}</span>
              <span className="font-display text-3xl font-bold text-text-primary">{count}</span>
              <span className="text-text-muted text-xs uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-wrap gap-2 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${filter === key
                  ? 'bg-cyan-primary text-bg-base font-bold shadow-glow-cyan'
                  : 'bg-surface-1 border border-[rgba(255,255,255,0.08)] text-text-secondary hover:text-text-primary hover:border-cyan-primary/30'
                }
              `}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Badge cards - image 1 style */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading badges...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">No badges found for this filter.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filtered.map((holder, i) => {
              const info = holder.isValid
                ? BADGE_INFO[holder.badgeType as keyof typeof BADGE_INFO]
                : REVOKED_INFO;

              const issueDate = ISSUE_DATES[holder.objectId.slice(0, 6)] || '2026-01-01';

              return (
                <motion.div
                  key={`${holder.objectId}-${holder.badgeType}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <Link href={`/agent/${holder.objectId}`} className="block h-full">
                    <div className={`
                      relative flex flex-col rounded-3xl border-2 ${info.border} ${info.glow}
                      bg-[#0a0a0a] overflow-hidden h-full
                      transition-all duration-300
                    `}>

                      {/* Top header bar */}
                      <div className="flex items-start justify-between px-5 pt-5 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${info.ballFrom} ${info.ballTo} ${info.ballShadow}`}>
                            {holder.isValid
                              ? <Shield size={14} className="text-black/70" />
                              : <ShieldOff size={14} className="text-red-300" />
                            }
                          </div>
                          <div>
                            <p className={`font-display font-bold text-sm tracking-wider ${info.labelColor}`}>{info.name}</p>
                            <p className="font-mono text-[10px] text-text-muted">ID: {holder.objectId.slice(2, 8).toUpperCase()}-{info.shortName.toUpperCase().slice(0, 4)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Large medallion circle */}
                      <div className="flex justify-center py-6">
                        <div className={`
                          relative w-32 h-32 rounded-full
                          bg-gradient-to-br ${info.ballFrom} ${info.ballTo}
                          ${info.ballShadow}
                          flex items-center justify-center
                        `}>
                          {/* Metallic sheen overlay */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent" />
                          {holder.isValid
                            ? <Shield size={44} className="text-black/60 relative z-10" />
                            : <ShieldOff size={44} className="text-red-300/80 relative z-10" />
                          }
                        </div>
                      </div>

                      {/* Agent name + protocol */}
                      <div className="px-5 pb-3 text-center">
                        <h3 className="font-display text-xl font-bold text-white mb-1">{holder.agentName}</h3>
                        <div className="flex items-center justify-center gap-1.5 text-text-muted text-xs font-mono">
                          <span>⚙</span>
                          <span className="uppercase tracking-wide">AEGIS PROTOCOL</span>
                        </div>
                      </div>

                      {/* Access level status */}
                      <div className={`mx-4 mb-3 rounded-xl ${info.accessBg} px-4 py-3`}>
                        <p className={`font-mono text-[11px] font-bold tracking-widest ${info.accessText} mb-1.5`}>
                          {info.accessLabel}
                        </p>
                        <p className="text-text-muted text-xs leading-relaxed">{info.accessDesc}</p>
                      </div>

                      {/* Metrics bar - 4 metrics */}
                      <div className="mx-4 mb-2 grid grid-cols-2 gap-1.5">
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[9px] uppercase tracking-wide">Uptime</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{holder.uptimeScore}%</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[9px] uppercase tracking-wide">Success</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{holder.successRate}%</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[9px] uppercase tracking-wide">Executions</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{holder.totalExecutions}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[9px] uppercase tracking-wide">Volume</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{formatVol(holder.totalVolume)}</p>
                        </div>
                      </div>

                      {/* Mini chart */}
                      {(() => {
                        const chartKey = holder.isValid ? String(holder.badgeType) : 'revoked';
                        const chart = MINI_CHARTS[chartKey];
                        return (
                          <div className="mx-4 mb-3 rounded-lg bg-white/[0.03] px-3 py-2">
                            <p className="text-text-muted text-[9px] uppercase tracking-widest mb-1.5">{chart.label}</p>
                            <svg viewBox="0 0 80 24" className="w-full h-6" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id={`grad-${holder.objectId.slice(2,8)}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={chart.color} stopOpacity="0.3" />
                                  <stop offset="100%" stopColor={chart.color} stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <polyline
                                points={chart.points}
                                fill="none"
                                stroke={chart.color}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polygon
                                points={`${chart.points} 80,24 0,24`}
                                fill={`url(#grad-${holder.objectId.slice(2,8)})`}
                              />
                            </svg>
                          </div>
                        );
                      })()}

                      {/* Bottom footer */}
                      <div className="mt-auto mx-4 mb-4 flex items-end justify-between border-t border-white/[0.06] pt-3">
                        <div>
                          <p className="text-text-muted text-[9px] uppercase tracking-widest mb-0.5">ISSUED</p>
                          <p className="font-mono text-xs text-text-secondary">{issueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-text-muted text-[9px] uppercase tracking-widest mb-0.5">ACCESS LEVEL</p>
                          <p className={`font-mono text-sm font-bold ${info.labelColor}`}>{info.level}</p>
                        </div>
                      </div>

                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Requirements section */}
        <motion.div className="border-t border-[rgba(255,255,255,0.06)] pt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <BarChart2 size={22} className="text-cyan-primary" />
            <h2 className="font-display text-2xl font-bold text-text-primary">How Aegis Evaluates Agents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {([
              {
                name: 'Gold Badge',
                level: 'LVL 5',
                icon: TrendingUp,
                border: 'border-yellow-400/40',
                bg: 'bg-yellow-400/[0.04]',
                accentColor: '#ffd700',
                accentText: 'text-yellow-400',
                accentBg: 'bg-yellow-400/10',
                chartPoints: '0,28 12,22 24,17 36,12 48,8 60,5 72,3 84,1',
                metrics: [
                  { icon: Zap, label: 'Executions', value: '200+', pct: 100 },
                  { icon: CheckCircle, label: 'Success Rate', value: '95%+', pct: 95 },
                  { icon: Activity, label: 'Volume', value: '$1M+', pct: 90 },
                ],
                reqs: ['200+ executions', '95%+ success rate', '$1,000,000+ volume'],
                accessLabel: 'AUTONOMOUS - UNRESTRICTED',
              },
              {
                name: 'Silver Badge',
                level: 'LVL 3',
                icon: Activity,
                border: 'border-slate-400/40',
                bg: 'bg-slate-400/[0.04]',
                accentColor: '#c0c0c0',
                accentText: 'text-slate-300',
                accentBg: 'bg-slate-400/10',
                chartPoints: '0,28 12,24 24,20 36,17 48,14 60,12 72,10 84,9',
                metrics: [
                  { icon: Zap, label: 'Executions', value: '50+', pct: 50 },
                  { icon: CheckCircle, label: 'Success Rate', value: '90%+', pct: 90 },
                  { icon: Clock, label: 'Volume', value: 'Any', pct: 40 },
                ],
                reqs: ['50+ executions', '90%+ success rate'],
                accessLabel: 'SUPERVISED',
              },
              {
                name: 'Bronze Badge',
                level: 'LVL 1',
                icon: Shield,
                border: 'border-amber-700/40',
                bg: 'bg-amber-700/[0.04]',
                accentColor: '#cd7f32',
                accentText: 'text-amber-500',
                accentBg: 'bg-amber-700/10',
                chartPoints: '0,28 12,26 24,25 36,23 48,21 60,19 72,18 84,17',
                metrics: [
                  { icon: Zap, label: 'Executions', value: '10+', pct: 20 },
                  { icon: CheckCircle, label: 'Success Rate', value: '80%+', pct: 80 },
                  { icon: Clock, label: 'Volume', value: 'Any', pct: 20 },
                ],
                reqs: ['10+ executions', '80%+ success rate'],
                accessLabel: 'RESTRICTED - READ ONLY',
              },
            ] as const).map(({ name, level, icon: Icon, border, bg, accentColor, accentText, accentBg, chartPoints, metrics, reqs, accessLabel }, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`rounded-2xl border ${border} ${bg} overflow-hidden flex flex-col`}
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${accentBg} border ${border}`}>
                      <Icon size={18} className={accentText} />
                    </div>
                    <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded-md ${accentBg} ${accentText}`}>{level}</span>
                  </div>
                  <h3 className={`font-display text-lg font-bold ${accentText} mb-0.5`}>{name}</h3>
                  <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{accessLabel}</p>
                </div>

                {/* Sparkline chart */}
                <div className="px-5 pb-3">
                  <div className="rounded-xl bg-bg-base/80 border border-[rgba(255,255,255,0.06)] px-3 pt-2 pb-1">
                    <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest mb-1">Performance track</p>
                    <svg viewBox="0 0 84 30" className="w-full h-8" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`evalgrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
                          <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <polygon
                        points={`${chartPoints} 84,30 0,30`}
                        fill={`url(#evalgrad-${idx})`}
                      />
                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Metric bars */}
                <div className="px-5 pb-4 space-y-2.5 flex-1">
                  {metrics.map(({ icon: MIcon, label, value, pct }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <MIcon size={11} className={accentText} />
                          <span className="text-text-muted text-[10px] uppercase tracking-wide">{label}</span>
                        </div>
                        <span className={`font-mono text-[11px] font-bold ${accentText}`}>{value}</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: accentColor }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: idx * 0.08 + 0.2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Requirements footer */}
                <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-text-muted text-[10px] uppercase tracking-widest mb-2">Requirements</p>
                  <ul className="space-y-1">
                    {reqs.map(r => (
                      <li key={r} className={`text-xs flex items-center gap-2 ${accentText}`}>
                        <CheckCircle size={10} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Auto-revocation - Complete Process */}
          <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-500/20">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-red-400 font-display font-semibold text-base">Complete Auto-Revocation Process</h3>
              <span className="ml-auto font-mono text-[10px] text-red-400/60 uppercase tracking-widest">On-Chain Enforcement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-red-500/10">
              {[
                { step: '1', icon: XCircle, title: 'Trigger Detection', text: 'Success rate drops below threshold (<95% Gold, <90% Silver), 5+ consecutive failures, slippage >500 BPS, or suspicious behavior detected.' },
                { step: '2', icon: ShieldOff, title: 'On-Chain Invalidation', text: 'Agent credentials marked "Revoked" in the smart contract. New privileged executions are blocked at the protocol level.' },
                { step: '3', icon: AlertTriangle, title: 'Access Downgrade', text: 'Access level immediately downgraded to LVL 0. No write or production permissions remain active for the agent.' },
                { step: '4', icon: Shield, title: 'Operational Block', text: 'Agent quarantined. Critical autonomous tasks paused pending manual review and resolution of the incident.' },
              ].map(({ step, icon: RIcon, title, text }) => (
                <div key={step} className="flex flex-col gap-2 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-red-400/50">{step}.</span>
                    <RIcon size={13} className="text-red-400" />
                    <span className="text-red-300 font-semibold text-xs">{title}</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-red-500/10 border-t border-red-500/10">
              {[
                { step: '5', icon: Activity, title: 'Public Registry Update', text: 'Registry status updates in real-time, displaying a 🚫 Revoked badge for full community transparency.' },
                { step: '6', icon: BarChart2, title: 'Audit Logging', text: 'Event logged with timestamp, revocation reason, and incident metrics. Permanent on-chain record for post-analysis.' },
                { step: '7', icon: Zap, title: 'Stakeholder Alert', text: 'Relevant stakeholders and the agent operator are notified of the status change via on-chain events.' },
                { step: '8', icon: CheckCircle, title: 'Conditional Reinstatement', text: 'Agent may reapply for certification only after resolving issues and passing manual review. No automatic reinstatement.' },
              ].map(({ step, icon: RIcon, title, text }) => (
                <div key={step} className="flex flex-col gap-2 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-red-400/50">{step}.</span>
                    <RIcon size={13} className="text-red-400" />
                    <span className="text-red-300 font-semibold text-xs">{title}</span>
                  </div>
                  <p className="text-text-muted text-[11px] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
