'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Shield, ShieldOff, AlertTriangle } from 'lucide-react';

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
  3: {
    name: 'GOLD LEVEL',
    shortName: 'Gold',
    emoji: '⭐',
    description: '200+ execs, 95%+ success, $1M+ volume',
    accessLabel: 'AUTONOMOUS — UNRESTRICTED',
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
    accessLabel: 'RESTRICTED — READ ONLY',
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
          isValid: agent.isValid,
        });
      }
    } catch (e) {
      console.error('Failed to fetch:', e);
    }
  }
  return holders;
}

type FilterType = 'all' | 'gold' | 'silver' | 'bronze';

const ISSUE_DATES: Record<string, string> = {
  '0x4cd8': '2026-01-15',
  '0xabed': '2026-03-22',
  '0xb3fa': '2026-05-10',
};

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
    if (filter === 'gold') return h.badgeType === 3;
    if (filter === 'silver') return h.badgeType === 2;
    if (filter === 'bronze') return h.badgeType === 1;
    return true;
  });

  const revokedCount = holders.filter(h => !h.isValid).length;

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'gold', label: '🥇 Gold' },
    { key: 'silver', label: '🥈 Silver' },
    { key: 'bronze', label: '🥉 Bronze' },
  ];

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Award size={28} className="text-cyan-primary" />
            <h1 className="font-display text-5xl font-bold gradient-text-cyan">Badge Registry</h1>
          </div>
          <p className="text-text-secondary text-lg">Certified agent trust badges on Sui</p>
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

        {/* Badge cards — image 1 style */}
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

                      {/* Metrics bar */}
                      <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[10px] uppercase tracking-wide">Uptime</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{holder.uptimeScore}%</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.04] px-3 py-2">
                          <p className="text-text-muted text-[10px] uppercase tracking-wide">Success</p>
                          <p className={`font-mono text-sm font-bold ${info.accentText}`}>{holder.successRate}%</p>
                        </div>
                      </div>

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
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">How to Earn Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { emoji: '🥇', name: 'Gold Badge', border: 'border-yellow-400/40', bg: 'bg-yellow-400/[0.05]', reqs: ['200+ executions', '95%+ success rate', '$1,000,000+ total volume'] },
              { emoji: '🥈', name: 'Silver Badge', border: 'border-slate-400/40', bg: 'bg-slate-400/[0.05]', reqs: ['50+ executions', '90%+ success rate'] },
              { emoji: '🥉', name: 'Bronze Badge', border: 'border-amber-700/40', bg: 'bg-amber-700/[0.05]', reqs: ['10+ executions', '80%+ success rate'] },
            ].map(({ emoji, name, border, bg, reqs }) => (
              <div key={name} className={`rounded-2xl p-6 border ${border} ${bg}`}>
                <span className="text-3xl block mb-3">{emoji}</span>
                <h3 className="font-semibold text-text-primary mb-3">{name}</h3>
                <ul className="space-y-1.5">
                  {reqs.map(r => (
                    <li key={r} className="text-text-secondary text-sm flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-text-muted" />{r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-6 bg-red-500/[0.06] border border-red-500/30">
            <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-2">
              <AlertTriangle size={15} /> Auto-Revocation
            </h3>
            <p className="text-text-secondary text-sm mb-2">Badges are automatically revoked if:</p>
            <ul className="space-y-1 text-text-secondary text-sm">
              {['Success rate drops below threshold', 'Agent is flagged (5+ consecutive failures, >500 BPS slippage)', 'Agent fails to maintain requirements'].map(r => (
                <li key={r} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-400" />{r}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
