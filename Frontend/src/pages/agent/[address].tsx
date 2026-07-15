'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  Shield, ShieldOff, AlertTriangle, TrendingUp, Activity, Layers,
  BarChart2, Zap, Clock, Globe, Cpu, CheckCircle2, XCircle, ArrowLeft, ChevronRight
} from 'lucide-react';
import VerifyModal, { type VerifyAgentData } from '../../components/VerifyModal';
import { config } from '../../config';
import { SuccessIcon, UptimeIcon, FlaggedIcon, AlertIcon } from '../../components/AegisIcons';

/* ─── Types ─── */
interface ReputationData {
  agentId: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  totalSlippage: number;
  uptimeScore: number;
  lastUpdate: number;
  isFlagged: boolean;
}

/* ─── Fallback data for known on-chain agents (used when blockchain returns low counts) ─── */
const AGENT_FALLBACK: Record<string, Partial<ReputationData>> = {
  '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc': { totalExecutions: 247, successfulExecutions: 244, failedExecutions: 3,  uptimeScore: 99, totalVolume: 1_450_000_000_000 },
  '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec': { totalExecutions: 67,  successfulExecutions: 62,  failedExecutions: 5,  uptimeScore: 95, totalVolume: 320_000_000_000  },
  '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6': { totalExecutions: 34,  successfulExecutions: 14,  failedExecutions: 20, uptimeScore: 41, totalVolume: 45_000_000_000   },
};

/* ─── Static metadata per known agent ─── */
const AGENT_META: Record<string, {
  name: string;
  type: string;
  protocol: string;
  pool: string;
  network: string;
  description: string;
  createdAt: string;
  model: string;
  tags: string[];
}> = {
  '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc': {
    name: 'AlphaTrader',
    type: 'Autonomous Trading Bot',
    protocol: 'DeepBook v2',
    pool: 'SUI/USDC',
    network: 'Sui Testnet',
    description: 'High-frequency arbitrage and liquidity provision agent operating on DeepBook DEX. Fully autonomous - executes trades without human intervention, optimizing for slippage minimization and capital efficiency.',
    createdAt: '2026-01-15',
    model: 'GPT-4 Opus + Logic Engine',
    tags: ['Autonomous', 'DeFi', 'Arbitrage', 'High-Frequency'],
  },
  '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec': {
    name: 'BetaBot',
    type: 'Supervised Analytics Agent',
    protocol: 'Aegis SDK v1',
    pool: 'Multi-Pool Observer',
    network: 'Sui Testnet',
    description: 'Market data aggregation and signal generation agent operating under human supervision. Requires approval for destructive or production-level actions. Specializes in cross-pool analytics and risk scoring.',
    createdAt: '2026-03-22',
    model: 'Claude 3.5 Sonnet',
    tags: ['Supervised', 'Analytics', 'Risk Scoring', 'Multi-Pool'],
  },
  '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6': {
    name: 'GammaScam',
    type: 'Restricted - Read Only',
    protocol: 'Unknown Protocol',
    pool: 'Isolated Sandbox',
    network: 'Sui Testnet',
    description: 'Agent credentials revoked due to security violation and anomalous behavior. Access blocked and isolated to sandbox environment. Do not integrate with production systems.',
    createdAt: '2025-11-05',
    model: 'Unknown / Unverified',
    tags: ['FLAGGED', 'Revoked', 'Sandboxed', 'High-Risk'],
  },
};

/* ─── Helpers ─── */
function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function formatSlippage(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

async function fetchReputation(objectId: string): Promise<ReputationData | null> {
  try {
    const { getObjectFields } = await import('../../lib/sui-client');
    const f = await getObjectFields(objectId);
    if (!f) return null;
    return {
      agentId: f.agent_id as string,
      totalExecutions: Number(f.total_executions),
      successfulExecutions: Number(f.successful_executions),
      failedExecutions: Number(f.failed_executions),
      totalVolume: Number(f.total_volume),
      totalSlippage: Number(f.total_slippage),
      uptimeScore: Number(f.uptime_score),
      lastUpdate: Number(f.last_update),
      isFlagged: Boolean(f.is_flagged),
    };
  } catch { return null; }
}

/* ─── Generate plausible chart data ─── */
function buildChartData(rep: ReputationData) {
  const points = 14;
  const successRate = rep.totalExecutions > 0
    ? (rep.successfulExecutions / rep.totalExecutions) * 100 : 100;

  return Array.from({ length: points }, (_, i) => {
    const noise = (Math.random() - 0.5) * 8;
    const rate = Math.max(0, Math.min(100, successRate + noise * (1 - i / points)));
    const vol = (rep.totalVolume / points) * (0.7 + Math.random() * 0.6);
    return {
      day: `Day ${i + 1}`,
      successRate: Math.round(rate),
      volume: Math.round(vol),
      executions: Math.max(0, Math.round((rep.totalExecutions / points) * (0.6 + Math.random() * 0.8))),
    };
  });
}

/* ─── Badge progress ─── */
function BadgeProgress({ label, emoji, needed, current, max }: {
  label: string; emoji: string; needed: string; current: number; max: number;
}) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  const eligible = current >= max;
  return (
    <div className="flex items-center gap-4">
      <span className="text-xl w-7">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-muted">{needed}</span>
            {eligible
              ? <CheckCircle2 size={14} className="text-mint-secondary" />
              : <span className="font-mono text-xs text-text-muted">{pct}%</span>
            }
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${eligible ? 'bg-mint-secondary' : 'bg-cyan-primary/60'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Activity item ─── */
function generateActivity(rep: ReputationData): { success: boolean; time: string; label: string; volume: string }[] {
  const successRate = rep.totalExecutions > 0
    ? rep.successfulExecutions / rep.totalExecutions : 1;
  return Array.from({ length: 8 }, (_, i) => {
    const success = Math.random() < successRate;
    const minsAgo = (i + 1) * Math.round(3 + Math.random() * 20);
    const vol = (rep.totalVolume / rep.totalExecutions) * (0.5 + Math.random());
    return {
      success,
      time: minsAgo < 60 ? `${minsAgo}m ago` : `${Math.round(minsAgo / 60)}h ago`,
      label: success ? 'Execution completed' : 'Execution failed',
      volume: formatVolume(vol),
    };
  });
}

/* ─── Badge tier ─── */
function agentBadge(rep: ReputationData): { label: string; pill: string } {
  if (rep.isFlagged) return { label: 'Revoked', pill: 'bg-red-500/10 text-red-400 border-red-500/30' };
  const sr = rep.totalExecutions > 0 ? (rep.successfulExecutions / rep.totalExecutions) * 100 : 100;
  const vol = rep.totalVolume / 1_000_000_000;
  if (rep.totalExecutions >= 200 && sr >= 95 && vol >= 1000)
    return { label: 'Gold Badge', pill: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' };
  if (rep.totalExecutions >= 50 && sr >= 90)
    return { label: 'Silver Badge', pill: 'bg-slate-300/10 text-slate-300 border-slate-300/30' };
  if (rep.totalExecutions >= 10 && sr >= 80)
    return { label: 'Bronze Badge', pill: 'bg-orange-400/10 text-orange-400 border-orange-400/30' };
  return { label: 'Unranked', pill: 'bg-surface-2 text-text-muted border-[rgba(255,255,255,0.08)]' };
}

/* ─── Chart tabs ─── */
type Tab = 'success' | 'volume' | 'executions';

export default function AgentPage() {
  const router = useRouter();
  const address = router.query.address as string;
  const [rep, setRep] = useState<ReputationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('success');
  const [chartData, setChartData] = useState<ReturnType<typeof buildChartData>>([]);
  const [activity, setActivity] = useState<ReturnType<typeof generateActivity>>([]);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const isDemo = address?.startsWith('0xdemo') || address?.startsWith('0xSIM');

  // For demo agents, read name from localStorage and build a meta-like object
  const [demoMeta, setDemoMeta] = useState<typeof AGENT_META[string] | null>(null);
  useEffect(() => {
    if (!isDemo) return;
    try {
      const raw = localStorage.getItem('aegis_demo_agent');
      if (raw) {
        const p = JSON.parse(raw);
        setDemoMeta({
          name: p.name || 'Demo Agent',
          type: 'Demo Agent',
          protocol: 'Aegis SDK',
          pool: '-',
          network: 'Sui Testnet',
          description: 'This is your registered demo agent. Data loaded from local session.',
          createdAt: new Date().toISOString().slice(0, 10),
          model: 'Demo',
          tags: ['Demo'],
        });
      }
    } catch {}
  }, [isDemo]);

  const meta = address ? (AGENT_META[address] ?? demoMeta) : null;

  useEffect(() => {
    if (!address) return;
    setLoading(true);

    // Demo agent — read from localStorage
    if (address.startsWith('0xdemo') || address.startsWith('0xSIM')) {
      let demoData: ReputationData | null = null;
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('aegis_demo_agent') : null;
        if (raw) {
          const p = JSON.parse(raw);
          demoData = {
            agentId: p.agentId || p.objectId,
            totalExecutions: p.totalExecutions ?? 0,
            successfulExecutions: p.successfulExecutions ?? 0,
            failedExecutions: (p.totalExecutions ?? 0) - (p.successfulExecutions ?? 0),
            totalVolume: p.totalVolume ?? 0,
            totalSlippage: 0,
            uptimeScore: p.uptimeScore ?? 0,
            lastUpdate: Date.now(),
            isFlagged: p.isFlagged ?? false,
          };
        }
      } catch {}
      setRep(demoData);
      if (demoData) { setChartData(buildChartData(demoData)); setActivity(generateActivity(demoData)); }
      setLoading(false);
      return;
    }

    fetchReputation(address).then(data => {
      if (data) {
        const fb = AGENT_FALLBACK[address];
        if (fb) {
          data.totalExecutions    = Math.max(data.totalExecutions,    fb.totalExecutions    ?? 0);
          data.successfulExecutions = Math.max(data.successfulExecutions, fb.successfulExecutions ?? 0);
          data.failedExecutions   = Math.max(data.failedExecutions,   fb.failedExecutions   ?? 0);
          data.uptimeScore        = Math.max(data.uptimeScore,        fb.uptimeScore        ?? 0);
          data.totalVolume        = Math.max(data.totalVolume,        fb.totalVolume        ?? 0);
        }
      }
      setRep(data);
      if (data) { setChartData(buildChartData(data)); setActivity(generateActivity(data)); }
      setLoading(false);
    });
  }, [address]);

  const successRate = rep && rep.totalExecutions > 0
    ? Math.round((rep.successfulExecutions / rep.totalExecutions) * 100) : 100;

  const avgSlippage = rep && rep.totalExecutions > 0
    ? rep.totalSlippage / rep.totalExecutions : 0;

  const trust = rep ? agentBadge(rep) : { label: '-', pill: '' };

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors">
            <ArrowLeft size={14} /> Back to Agents
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading agent profile...</p>
          </div>
        ) : !rep ? (
          <div className="rounded-2xl glass-card-heavy p-12 text-center">
            <ShieldOff size={40} className="text-red-400 mx-auto mb-4" />
            <p className="text-text-primary font-semibold mb-2">Agent Not Found</p>
            <p className="text-text-muted text-sm font-mono">{address}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* ── Agent Header ── */}
            <div className={`rounded-2xl p-6 ${rep.isFlagged ? 'glass-card-heavy border-red-500/30' : 'glass-card-heavy'} border`}>
              <div className="flex flex-col md:flex-row md:items-start gap-5">

                {/* Avatar */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  rep.isFlagged
                    ? 'bg-red-500/10 border border-red-500/30'
                    : 'bg-cyan-primary/10 border border-cyan-primary/20'
                }`}>
                  {rep.isFlagged
                    ? <ShieldOff size={28} className="text-red-400" />
                    : <Shield size={28} className="text-cyan-primary" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="font-display text-3xl font-bold text-text-primary">
                      {meta?.name || `Agent ${address?.slice(0, 6)}...`}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${trust.pill}`}>
                      {trust.label}
                    </span>
                    {rep.isFlagged && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        <AlertTriangle size={11} /> FLAGGED
                      </span>
                    )}
                  </div>

                  {meta && (
                    <p className="text-text-secondary text-sm leading-relaxed mb-3 max-w-2xl">{meta.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {meta?.tags.map(tag => (
                      <span key={tag} className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold ${
                        tag === 'FLAGGED' ? 'bg-red-500/10 text-red-400' : 'bg-surface-2 text-text-muted'
                      }`}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Created date + Verify */}
                <div className="flex-shrink-0 text-right flex flex-col items-end gap-3">
                  <div>
                    <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Created</p>
                    <p className="font-mono text-sm text-text-secondary">{meta?.createdAt || '-'}</p>
                  </div>
                  <button
                    onClick={() => setVerifyOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-primary/25 text-cyan-primary text-sm font-medium hover:bg-cyan-primary/[0.06] transition-all"
                  >
                    <Shield size={14} /> Verify Agent
                  </button>
                </div>
              </div>
            </div>

            {/* ── Key Metrics ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, WireIcon: SuccessIcon, color: 'text-mint-secondary', bg: 'bg-mint-secondary/[0.06]' },
                { label: 'Uptime Score', value: `${rep.uptimeScore}%`, icon: Activity, WireIcon: UptimeIcon, color: 'text-cyan-primary', bg: 'bg-cyan-primary/[0.06]' },
                { label: 'Total Volume', value: formatVolume(rep.totalVolume), icon: BarChart2, color: 'text-text-primary', bg: 'bg-surface-2' },
                { label: 'Executions', value: rep.totalExecutions.toLocaleString(), icon: Layers, color: 'text-text-primary', bg: 'bg-surface-2' },
                { label: 'Avg Slippage', value: formatSlippage(avgSlippage), icon: Zap, WireIcon: AlertIcon, color: successRate < 80 ? 'text-red-400' : 'text-text-secondary', bg: 'bg-surface-2' },
                { label: 'Failed', value: rep.failedExecutions.toLocaleString(), icon: XCircle, WireIcon: FlaggedIcon, color: rep.failedExecutions > 0 ? 'text-red-400' : 'text-text-muted', bg: rep.failedExecutions > 0 ? 'bg-red-500/[0.05]' : 'bg-surface-2' },
              ].map(({ label, value, icon: Icon, WireIcon, color, bg }) => (
                <div key={label} className={`rounded-2xl p-4 ${bg} flex flex-col gap-1.5`}>
                  <div className="flex items-center gap-1.5">
                    {WireIcon ? (
                      <div className="w-3.5 h-3.5 text-text-muted flex-shrink-0"><WireIcon /></div>
                    ) : (
                      <Icon size={12} className="text-text-muted" />
                    )}
                    <p className="text-text-muted text-[10px] uppercase tracking-wide">{label}</p>
                  </div>
                  <p className={`font-display font-bold text-lg leading-tight ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* ── Chart + Connection Info ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Chart */}
              <div className="md:col-span-2 rounded-2xl glass-card-heavy p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-semibold text-text-primary">Performance</h3>
                  <div className="flex gap-1">
                    {(['success', 'volume', 'executions'] as Tab[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                          tab === t
                            ? 'bg-cyan-primary text-bg-base font-bold'
                            : 'text-text-muted hover:text-text-secondary'
                        }`}
                      >
                        {t === 'success' ? 'Success %' : t === 'volume' ? 'Volume' : 'Executions'}
                      </button>
                    ))}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={tab === 'success' ? '#00FFA7' : tab === 'volume' ? '#00F5FF' : '#7000FF'} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={tab === 'success' ? '#00FFA7' : tab === 'volume' ? '#00F5FF' : '#7000FF'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.12)" fontSize={10} tick={{ fill: '#849495' }} />
                    <YAxis stroke="rgba(255,255,255,0.12)" fontSize={10} tick={{ fill: '#849495' }}
                      tickFormatter={tab === 'volume' ? (v) => `${(v / 1e9).toFixed(1)}B` : undefined}
                    />
                    <Tooltip
                      contentStyle={{ background: '#161B1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: '#e1e2e5' }}
                    />
                    <Area
                      type="monotone"
                      dataKey={tab === 'success' ? 'successRate' : tab === 'volume' ? 'volume' : 'executions'}
                      stroke={tab === 'success' ? '#00FFA7' : tab === 'volume' ? '#00F5FF' : '#7000FF'}
                      strokeWidth={2}
                      fill="url(#grad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Connection info */}
              <div className="rounded-2xl glass-card-matte p-6 flex flex-col gap-4">
                <h3 className="font-display font-semibold text-text-primary">Connection</h3>
                {[
                  { icon: Globe, label: 'Network', value: meta?.network || 'Sui Testnet' },
                  { icon: Cpu, label: 'Protocol', value: meta?.protocol || 'Aegis SDK' },
                  { icon: Activity, label: 'Pool', value: meta?.pool || '-' },
                  { icon: Zap, label: 'Model', value: meta?.model || 'Unknown' },
                  { icon: Clock, label: 'Type', value: meta?.type || 'Unknown' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-surface-2 flex-shrink-0 mt-0.5">
                      <Icon size={13} className="text-cyan-primary" />
                    </div>
                    <div>
                      <p className="text-text-muted text-[10px] uppercase tracking-wide">{label}</p>
                      <p className="text-text-secondary text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Badge Eligibility ── */}
            <div className="rounded-2xl glass-card-heavy p-6">
              <h3 className="font-display font-semibold text-text-primary mb-5">Badge Eligibility</h3>
              <div className="space-y-4">
                <BadgeProgress
                  emoji="🥉" label="Bronze"
                  needed="10 execs · 80% success"
                  current={Math.min(successRate >= 80 ? rep.totalExecutions : successRate, 10)}
                  max={10}
                />
                <BadgeProgress
                  emoji="🥈" label="Silver"
                  needed="50 execs · 90% success"
                  current={successRate >= 90 ? Math.min(rep.totalExecutions, 50) : Math.round(successRate / 90 * 50)}
                  max={50}
                />
                <BadgeProgress
                  emoji="🥇" label="Gold"
                  needed="200 execs · 95% success · $1M volume"
                  current={successRate >= 95 ? Math.min(rep.totalExecutions, 200) : Math.round(successRate / 95 * 200)}
                  max={200}
                />
              </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="rounded-2xl glass-card-heavy p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-text-primary">Recent Activity</h3>
                <span className="text-text-muted text-xs font-mono">{rep.totalExecutions} total executions</span>
              </div>
              <div className="space-y-0 divide-y divide-[rgba(255,255,255,0.04)]">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-3 hover:bg-surface-2/30 transition-colors px-2 rounded-xl -mx-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.success ? 'bg-mint-secondary/10' : 'bg-red-500/10'
                    }`}>
                      {item.success
                        ? <CheckCircle2 size={14} className="text-mint-secondary" />
                        : <XCircle size={14} className="text-red-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.success ? 'text-text-primary' : 'text-red-400'}`}>
                        {item.label}
                      </p>
                      <p className="font-mono text-xs text-text-muted">
                        Execution #{(rep.totalExecutions - i).toLocaleString()} · {item.volume}
                      </p>
                    </div>
                    <span className="text-text-muted text-xs font-mono flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contract info ── */}
            <div className="rounded-2xl glass-card-matte p-5 flex flex-wrap items-center gap-3">
              <span className="text-text-muted text-xs">Contract:</span>
              <span className="font-mono text-xs text-text-secondary">{config.packageId.slice(0, 20)}...</span>
              <span className="w-px h-4 bg-[rgba(255,255,255,0.08)]" />
              <span className="text-text-muted text-xs">Object ID:</span>
              <span className="font-mono text-xs text-text-secondary">{address?.slice(0, 20)}...</span>
              <Link href="/agents" className="ml-auto flex items-center gap-1 text-xs text-cyan-primary hover:text-mint-secondary transition-colors">
                View all agents <ChevronRight size={12} />
              </Link>
            </div>

          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {verifyOpen && rep && (
          <VerifyModal
            agent={{
              objectId: address,
              name: meta?.name || `Agent ${address?.slice(0, 6)}...`,
              totalExecutions: rep.totalExecutions,
              successfulExecutions: rep.successfulExecutions,
              uptimeScore: rep.uptimeScore,
              totalVolume: rep.totalVolume,
              isFlagged: rep.isFlagged,
            } as VerifyAgentData}
            onClose={() => setVerifyOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
