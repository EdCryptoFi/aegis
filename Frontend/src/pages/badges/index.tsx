'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ShieldOff, ShieldCheck } from 'lucide-react';

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
  3: { name: 'Gold', emoji: '🥇', description: '200+ execs, 95%+ success, $1M+ volume', border: 'border-yellow-400/40', bg: 'bg-yellow-400/[0.06]', accent: 'text-yellow-400', stat: 'bg-yellow-400/10' },
  2: { name: 'Silver', emoji: '🥈', description: '50+ execs, 90%+ success', border: 'border-slate-400/40', bg: 'bg-slate-400/[0.06]', accent: 'text-slate-300', stat: 'bg-slate-400/10' },
  1: { name: 'Bronze', emoji: '🥉', description: '10+ execs, 80%+ success', border: 'border-amber-700/40', bg: 'bg-amber-700/[0.06]', accent: 'text-amber-600', stat: 'bg-amber-700/10' },
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

type FilterType = 'all' | 'gold' | 'silver' | 'bronze';

export default function BadgesPage() {
  const [holders, setHolders] = useState<BadgeHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

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

  const revokedCount = holders.filter(h => !h.isValid).length;

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'gold', label: '🥇 Gold' },
    { key: 'silver', label: '🥈 Silver' },
    { key: 'bronze', label: '🥉 Bronze' },
  ];

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-5xl mx-auto">

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

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { emoji: '🥇', label: 'Gold', count: holders.filter(h => h.badgeType === 3 && h.isValid).length, border: 'border-yellow-400/40' },
            { emoji: '🥈', label: 'Silver', count: holders.filter(h => h.badgeType === 2 && h.isValid).length, border: 'border-slate-400/40' },
            { emoji: '🥉', label: 'Bronze', count: holders.filter(h => h.badgeType === 1 && h.isValid).length, border: 'border-amber-700/40' },
            { emoji: '🚫', label: 'Revoked', count: revokedCount, border: 'border-red-500/40' },
          ].map(({ emoji, label, count, border }) => (
            <div key={label} className={`rounded-2xl p-5 glass-card-heavy border ${border} flex flex-col items-center gap-1`}>
              <span className="text-2xl">{emoji}</span>
              <span className="font-display text-3xl font-bold text-text-primary">{count}</span>
              <span className="text-text-muted text-xs uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
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

        {/* Badge cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading badges...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">No badges found for this filter.</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filtered.map((holder) => {
              const info = BADGE_INFO[holder.badgeType as keyof typeof BADGE_INFO];
              return (
                <Link
                  href={`/agent/${holder.objectId}`}
                  key={`${holder.objectId}-${holder.badgeType}`}
                  className={`
                    rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1
                    ${info?.bg || 'bg-surface-1/50'}
                    ${info?.border || 'border-[rgba(255,255,255,0.08)]'}
                    ${!holder.isValid ? 'opacity-50' : 'hover:shadow-card-hover'}
                  `}
                >
                  {/* Badge header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{info?.emoji}</span>
                    <span className={`text-lg font-bold ${info?.accent}`}>{info?.name}</span>
                    {!holder.isValid && (
                      <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                        <ShieldOff size={10} /> REVOKED
                      </span>
                    )}
                    {holder.isValid && (
                      <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint-secondary/10 text-mint-secondary text-[10px] font-bold border border-mint-secondary/20">
                        <ShieldCheck size={10} /> VALID
                      </span>
                    )}
                  </div>

                  {/* Agent info */}
                  <div className="mb-3">
                    <p className="text-text-primary font-semibold text-sm">{holder.agentName}</p>
                    <p className="font-mono text-text-muted text-[11px]">{holder.agentId.slice(0, 8)}...{holder.agentId.slice(-4)}</p>
                  </div>

                  <p className="text-text-muted text-xs mb-4">{info?.description}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-3 ${info?.stat}`}>
                      <p className="text-text-muted text-[10px] uppercase tracking-wide">Uptime</p>
                      <p className={`font-mono font-bold text-sm ${info?.accent}`}>{holder.uptimeScore}%</p>
                    </div>
                    <div className={`rounded-xl p-3 ${info?.stat}`}>
                      <p className="text-text-muted text-[10px] uppercase tracking-wide">Success</p>
                      <p className={`font-mono font-bold text-sm ${info?.accent}`}>{holder.successRate}%</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}

        {/* Requirements section */}
        <motion.div
          className="border-t border-[rgba(255,255,255,0.06)] pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
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
                      <span className="w-1 h-1 rounded-full bg-text-muted" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Warning box */}
          <div className="rounded-2xl p-6 bg-red-500/[0.06] border border-red-500/30">
            <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-2">
              <AlertTriangleIcon /> Auto-Revocation
            </h3>
            <p className="text-text-secondary text-sm mb-2">Badges are automatically revoked if:</p>
            <ul className="space-y-1 text-text-secondary text-sm">
              {['Success rate drops below threshold', 'Agent is flagged (5+ consecutive failures, >500 BPS slippage)', 'Agent fails to maintain requirements'].map(r => (
                <li key={r} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-red-400" />{r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
