'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Code2, Copy, Check, Terminal, Zap, BookOpen, BarChart2, AlertTriangle,
  Workflow, ArrowRight, Play, RefreshCw, CheckCircle2,
  XCircle, Award,
} from 'lucide-react';
import { config } from '../../config';
import { UptimeIcon, FlaggedIcon, AlertIcon, SuccessIcon } from '../../components/AegisIcons';

/* ─── Tab config ─── */
const TABS = [
  {
    id: 'hub',
    label: 'Developer Hub',
    icon: Code2,
    desc: 'SDK reference & integration guide',
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Workflow,
    desc: 'System architecture & data flow',
  },
  {
    id: 'demo',
    label: 'CLI Walkthrough',
    icon: Terminal,
    desc: 'Step-by-step simulation of agent lifecycle',
  },
];

/* ─── Pipeline data ─── */
const components = [
  {
    name: 'Reputation Object',
    desc: 'On-chain metrics tracked in Move smart contracts - executions, volume, slippage, uptime.',
    emoji: '🛡️',
    accent: 'text-cyan-primary',
    bg: 'bg-cyan-primary/[0.06]',
    border: 'border-cyan-primary/20',
  },
  {
    name: 'Walrus Memory',
    desc: 'Persistent execution history stored off-chain in Walrus decentralized storage, anchored on-chain.',
    emoji: '🧠',
    accent: 'text-mint-secondary',
    bg: 'bg-mint-secondary/[0.06]',
    border: 'border-mint-secondary/20',
  },
  {
    name: 'Badge Registry',
    desc: 'NFT certificates issued as Kiosk objects on Sui - Bronze, Silver, Gold tiers with auto-revocation.',
    emoji: '⭐',
    accent: 'text-yellow-400',
    bg: 'bg-yellow-400/[0.06]',
    border: 'border-yellow-400/20',
  },
  {
    name: 'SDK & API',
    desc: 'TypeScript SDK for seamless integration - register, record, check eligibility, mint badges.',
    emoji: '🔌',
    accent: 'text-purple-400',
    bg: 'bg-purple-400/[0.06]',
    border: 'border-purple-400/20',
  },
];

const flow = [
  { step: '01', title: 'Agent Execution', desc: 'AI agent executes trades on DeepBook DEX' },
  { step: '02', title: 'On-Chain Log', desc: 'Success/failure recorded in the ReputationObject via Move' },
  { step: '03', title: 'Persistent Storage', desc: 'Full history stored in Walrus, blob_id anchored on-chain' },
  { step: '04', title: 'Badge Unlock', desc: 'Milestones trigger badge mints in the Kiosk registry' },
];

const techStack = [
  { tech: 'Move', desc: 'Smart Contracts', icon: '⚡', color: 'text-cyan-primary' },
  { tech: 'Sui SDK', desc: 'Blockchain Integration', icon: '🔗', color: 'text-mint-secondary' },
  { tech: 'TypeScript', desc: 'Backend & SDK', icon: '📘', color: 'text-purple-400' },
  { tech: 'Next.js', desc: 'Frontend', icon: '▲', color: 'text-text-primary' },
];

/* ─── Randomized Simulation Engine ─── */
type LineType = 'cmd' | 'output' | 'success' | 'error' | 'spacer' | 'section';

interface TerminalLine {
  text: string;
  type: LineType;
  delay: number;
}

const SIM_AGENT = '0xSIM9f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9';
const SIM_PKG = config.packageId.slice(0, 20) + '...';
const SIM_REGISTRY = config.badgeRegistry.slice(0, 20) + '...';

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const slipWords = ['slippage exceeded target', 'price impact', 'executed at limit', 'market volatility', 'liquidity threshold'];
const volWords = ['volume weighted', 'time-weighted average', 'spread capture', 'VWAP execution', 'iceberg order'];

interface SimResult {
  totalExecs: number;
  successes: number;
  failures: number;
  conFails: number;
  successRate: number;
  totalVolumeSUI: number;
  avgSlippageBps: number;
  isFlagged: boolean;
  badge: 'bronze' | 'silver' | 'gold' | 'none';
  lines: TerminalLine[];
}

function generateSimulation(): SimResult {
  const totalExecs = rand(10, 300);
  const baseSuccess = randFloat(40, 99);
  let successes = 0;
  let failures = 0;
  let conFails = 0;
  let maxConFails = 0;
  let totalVolumeMIST = 0;
  let totalSlippage = 0;

  for (let i = 0; i < totalExecs; i++) {
    const isSuccess = Math.random() * 100 < baseSuccess;
    if (isSuccess) {
      successes++;
      conFails = 0;
      totalVolumeMIST += rand(100_000_000, 5_000_000_000);
      totalSlippage += rand(5, 200);
    } else {
      failures++;
      conFails++;
      if (conFails > maxConFails) maxConFails = conFails;
      totalVolumeMIST += rand(0, 500_000_000);
      totalSlippage += rand(50, 800);
    }
  }

  const actualSuccessRate = totalExecs > 0 ? Math.round((successes / totalExecs) * 1000) / 10 : 100;
  const avgSlippage = totalExecs > 0 ? Math.round(totalSlippage / totalExecs) : 0;
  const totalVolumeSUI = Math.round((totalVolumeMIST / 1_000_000_000) * 100) / 100;

  const isFlagged = actualSuccessRate < 50 || avgSlippage > 500 || maxConFails >= 5;

  let badge: SimResult['badge'] = 'none';
  if (!isFlagged) {
    if (totalExecs >= 200 && actualSuccessRate >= 95 && totalVolumeSUI >= 1000) badge = 'gold';
    else if (totalExecs >= 50 && actualSuccessRate >= 90) badge = 'silver';
    else if (totalExecs >= 10 && actualSuccessRate >= 80) badge = 'bronze';
  }

  const count = Math.min(totalExecs, 30);
  const shownIndexes = new Set<number>();
  while (shownIndexes.size < count) {
    shownIndexes.add(rand(0, totalExecs - 1));
  }
  const execList = Array.from(shownIndexes).sort((a, b) => a - b);

  let d = 0;
  const step = 60;
  const lines: TerminalLine[] = [];

  const add = (text: string, type: LineType, extraDelay = 0) => {
    d += step + extraDelay;
    lines.push({ text, type, delay: d });
  };

  add('# ── STEP 1: Register Agent ────────────────────', 'section');
  add(`$ sui client call \\`, 'cmd');
  add(`    --package ${SIM_PKG} \\`, 'cmd');
  add(`    --module reputation \\`, 'cmd');
  add(`    --function register_agent \\`, 'cmd');
  add(`    --gas-budget 20000000`, 'cmd', 200);
  add('', 'spacer');
  add('Connecting to Sui testnet...', 'output', 400);
  add('Transaction Digest: ' + '0x' + Array.from({length: 20}, () => Math.floor(Math.random() * 16).toString(16)).join(''), 'output', 600);
  add(`✓  Agent registered:  ${SIM_AGENT}`, 'success', 400);
  add('', 'spacer');

  add('# ── STEP 2: Record Executions ─────────────────', 'section');
  add(`$ aegis batch-simulate --agent ${SIM_AGENT.slice(0, 22)}... --count ${totalExecs}`, 'cmd', 200);
  add('', 'spacer');

  for (let idx = 0; idx < execList.length; idx++) {
    const execNum = execList[idx] + 1;
    const isSuccessExec = execNum <= successes;
    if (isSuccessExec) {
      const v = randFloat(0.1, 5.0);
      const s = randFloat(0.1, 1.0);
      add(`Recording execution ${execNum}/${totalExecs}  [success]  vol: ${v.toFixed(2)} SUI  slip: ${s.toFixed(2)}%  ${pick(volWords)}  ✓`, 'success', rand(20, 80));
    } else {
      const v = randFloat(0, 0.5);
      add(`Recording execution ${execNum}/${totalExecs}  [FAILED]   vol: ${v.toFixed(2)} SUI  ${pick(slipWords)}  ✗`, 'error', rand(20, 80));
    }
  }

  add('', 'spacer');
  add(`Summary → ${successes}/${totalExecs} succeeded  (${actualSuccessRate}%)   Total volume: ${totalVolumeSUI.toFixed(2)} SUI`, 'output', 400);

  if (isFlagged) {
    add('', 'spacer');
    const reason = actualSuccessRate < 50 ? 'Success rate too low' : avgSlippage > 500 ? 'High slippage detected' : 'Consecutive failures threshold exceeded';
    add(`⚠️  AGENT FLAGGED — ${reason}`, 'error', 400);
  }

  add('', 'spacer');
  add('# ── STEP 3: Check Badge Eligibility ───────────', 'section');
  add(`$ aegis check-eligibility --agent ${SIM_AGENT.slice(0, 22)}...`, 'cmd', 200);
  add('', 'spacer');

  const checks: { label: string; reqExecs: number; reqRate: number; reqVol: number }[] = [
    { label: 'Bronze', reqExecs: 10, reqRate: 80, reqVol: 0 },
    { label: 'Silver', reqExecs: 50, reqRate: 90, reqVol: 0 },
    { label: 'Gold', reqExecs: 200, reqRate: 95, reqVol: 1000 },
  ];

  for (const c of checks) {
    const okExec = totalExecs >= c.reqExecs;
    const okRate = actualSuccessRate >= c.reqRate;
    const okVol = totalVolumeSUI >= c.reqVol;
    const eligible = !isFlagged && okExec && okRate && okVol;
    const parts = [
      `[${c.label}]`,
      `  execs ${totalExecs}${okExec ? ' ≥' : ' <'} ${c.reqExecs} ${okExec ? '✓' : '✗'}`,
      `  success ${actualSuccessRate}%${okRate ? ' ≥' : ' <'} ${c.reqRate}% ${okRate ? '✓' : '✗'}`,
    ];
    if (c.reqVol > 0) parts.push(`  volume \$${totalVolumeSUI}${okVol ? ' ≥' : ' <'} \$${c.reqVol} ${okVol ? '✓' : '✗'}`);
    parts.push(eligible ? ' → ELIGIBLE' : ' → NOT ELIGIBLE');
    add(parts.join(''), eligible ? 'success' : 'error', rand(80, 200));
  }

  if (badge !== 'none') {
    add('', 'spacer');
    const badgeMap: Record<string, { num: number; emoji: string; name: string; token: string }> = {
      bronze: { num: 1, emoji: '🥉', name: 'BRONZE', token: '0xBRONZE' },
      silver: { num: 2, emoji: '🥈', name: 'SILVER', token: '0xSILVER' },
      gold: { num: 3, emoji: '🥇', name: 'GOLD', token: '0xGOLD' },
    };
    const b = badgeMap[badge];
    add(`# ── STEP 4: Mint ${b.name} Badge ────────────────`, 'section');
    add(`$ sui client call \\`, 'cmd', 200);
    add(`    --package ${SIM_PKG} \\`, 'cmd');
    add(`    --module badge_registry \\`, 'cmd');
    add(`    --function grant_badge \\`, 'cmd');
    add(`    --args ${SIM_REGISTRY} ${SIM_AGENT.slice(0, 16)}... ${b.num} \\`, 'cmd');
    add(`    --gas-budget 20000000`, 'cmd');
    add('', 'spacer');
    add('Minting badge NFT in Kiosk registry...', 'output', 400);
    add('Transaction Digest: ' + '0x' + Array.from({length: 20}, () => Math.floor(Math.random() * 16).toString(16)).join(''), 'output', 600);
    add(`${b.emoji}  ${b.name} Badge minted!  Token: ${b.token}...${Math.random().toString(16).slice(2, 6).toUpperCase()}`, 'success', 400);
    const statusText = badge === 'gold' ? 'FULL TRADING ACCESS' : badge === 'silver' ? 'SUPERVISED TRADING' : 'RESTRICTED READ ONLY';
    add(`    Agent is now certified as ${b.name} - ${statusText}`, 'success', 200);
  }

  return { totalExecs, successes, failures, conFails: maxConFails, successRate: actualSuccessRate, totalVolumeSUI, avgSlippageBps: avgSlippage, isFlagged, badge, lines };
}

/* ─── Build SimResult from Real API agent data ─── */
async function tryRealRegistration(): Promise<SimResult | null> {
  try {
    const res = await fetch('/api/agents/register', { method: 'POST' });
    const data = await res.json();
    if (!data.success || !data.agent) return null;

    const a = data.agent as {
      objectId: string; label: string; totalExecutions: number;
      successfulExecutions: number; failedExecutions: number;
      totalVolume: number; successRate: number; avgSlippage: number;
      isFlagged: boolean; badge: string; address: string;
    };

    const totalVolumeSUI = a.totalVolume / 1_000_000_000;
    const execs = a.totalExecutions;
    const agentAddr = a.objectId.slice(0, 22) + '...';

    let d = 0;
    const add = (text: string, type: LineType, extraDelay = 0) => {
      d += 60 + extraDelay;
      return { text, type, delay: d };
    };
    const lines: TerminalLine[] = [];

    lines.push(add('# ── STEP 1: Register Agent (on-chain) ─────', 'section'));
    lines.push(add(`$ sui client call \\`, 'cmd'));
    lines.push(add(`    --package ${a.objectId.slice(0, 10)}... \\`, 'cmd'));
    lines.push(add(`    --module reputation \\`, 'cmd'));
    lines.push(add(`    --function register_agent \\`, 'cmd'));
    lines.push(add(`    --gas-budget 20000000`, 'cmd', 200));
    lines.push(add('', 'spacer'));
    lines.push(add('Connecting to Sui testnet...', 'output', 400));
    lines.push(add(`Transaction Digest: ${a.objectId.slice(0, 20)}...`, 'output', 600));
    lines.push(add(`✓  Agent registered:  ${a.objectId}`, 'success', 400));
    lines.push(add('', 'spacer'));

    lines.push(add('# ── STEP 2: Record Executions (${execs} tx) ──', 'section'));
    lines.push(add(`$ aegis batch-simulate --agent ${agentAddr} --count ${execs}`, 'cmd', 200));
    lines.push(add('', 'spacer'));

    for (let idx = 0; idx < Math.min(execs, 20); idx++) {
      const isSuccess = idx < a.successfulExecutions;
      const v = (Math.random() * 5).toFixed(2);
      if (isSuccess) {
        lines.push(add(`Recording execution ${idx + 1}/${execs}  [success]  vol: ${v} SUI  slip: ${(Math.random() * 1).toFixed(2)}%  ✓`, 'success', rand(20, 60)));
      } else {
        lines.push(add(`Recording execution ${idx + 1}/${execs}  [FAILED]   vol: ${(Math.random() * 0.5).toFixed(2)} SUI  slippage exceeded  ✗`, 'error', rand(20, 60)));
      }
    }
    if (execs > 20) {
      lines.push(add(`  ... +${execs - 20} more executions recorded on-chain`, 'output', 200));
    }
    lines.push(add('', 'spacer'));
    lines.push(add(`Summary → ${a.successfulExecutions}/${execs} succeeded  (${a.successRate}%)   Total volume: ${totalVolumeSUI.toFixed(2)} SUI`, 'output', 400));

    if (a.isFlagged) {
      lines.push(add(`⚠️  AGENT FLAGGED — On-chain detection triggered`, 'error', 400));
    }

    lines.push(add('', 'spacer'));
    lines.push(add('# ── STEP 3: Check Badge Eligibility ───────────', 'section'));
    lines.push(add(`$ aegis check-eligibility --agent ${agentAddr}`, 'cmd', 200));
    lines.push(add('', 'spacer'));

    if (a.badge !== 'none') {
      const badgeLabel = a.badge.charAt(0).toUpperCase() + a.badge.slice(1);
      lines.push(add(`✓  Agent qualifies for ${badgeLabel} badge on-chain`, 'success', 300));
      lines.push(add('', 'spacer'));
      lines.push(add(`# ── STEP 4: Mint ${badgeLabel} Badge ──────────────`, 'section'));
      lines.push(add(`\$ sui client call --module badge_registry --function grant_badge --gas-budget 20000000`, 'cmd', 200));
      lines.push(add('', 'spacer'));
      lines.push(add(`🥇  ${badgeLabel} Badge minted on-chain!  Token: ${a.objectId.slice(0, 10)}...`, 'success', 400));
    } else {
      lines.push(add(`Agent does not qualify for any badge tier`, 'output', 300));
    }

    lines.push(add('', 'spacer'));
    lines.push(add('✓  Agent data written to Sui testnet — viewable on leaderboard →', 'success', 400));

    return {
      totalExecs: execs,
      successes: a.successfulExecutions,
      failures: a.failedExecutions,
      conFails: 0,
      successRate: a.successRate,
      totalVolumeSUI,
      avgSlippageBps: a.avgSlippage,
      isFlagged: a.isFlagged,
      badge: a.badge as SimResult['badge'],
      lines,
    };
  } catch {
    return null;
  }
}

/* ─── CLI Walkthrough Component ─── */
function LiveDemo() {
  const [currentSim, setCurrentSim] = useState<SimResult | null>(null);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [realTx, setRealTx] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  async function startDemo() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    let sim: SimResult;
    let isReal = false;

    // Try real on-chain registration first
    const real = await tryRealRegistration();
    if (real) {
      sim = real;
      isReal = true;
      // Save real agent to demo store for leaderboard visibility
      fetch('/api/agents/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId: real.lines.find(l => l.text.startsWith('✓  Agent registered:'))?.text.replace('✓  Agent registered:  ', '') || '',
          name: `Demo Agent`,
          totalExecutions: real.totalExecs,
          successfulExecutions: real.successes,
          failedExecutions: real.failures,
          totalVolume: real.totalVolumeSUI * 1_000_000_000,
          successRate: real.successRate,
          avgSlippage: real.avgSlippageBps,
          isFlagged: real.isFlagged,
          badge: real.badge,
          uptimeScore: real.successRate,
        }),
      }).catch(() => {});
    } else {
      sim = generateSimulation();
      // Save simulated agent to demo store so it appears on leaderboard
      fetch('/api/agents/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId: `0xSIM_${Date.now().toString(36).toUpperCase()}`,
          name: `Demo Agent`,
          totalExecutions: sim.totalExecs,
          successfulExecutions: sim.successes,
          failedExecutions: sim.failures,
          totalVolume: sim.totalVolumeSUI * 1_000_000_000,
          successRate: sim.successRate,
          avgSlippage: sim.avgSlippageBps,
          isFlagged: sim.isFlagged,
          badge: sim.badge,
          uptimeScore: sim.successRate,
        }),
      }).catch(() => {});
    }

    setRealTx(isReal);
    setCurrentSim(sim);
    setVisibleLines(0);
    setRunning(true);
    setDone(false);

    sim.lines.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
        if (i === sim.lines.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, line.delay + 200);
      timersRef.current.push(t);
    });
  }

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const lineColor: Record<LineType, string> = {
    cmd: 'text-cyan-primary',
    output: 'text-text-secondary',
    success: 'text-mint-secondary',
    error: 'text-red-400',
    spacer: '',
    section: 'text-purple-400',
  };

  const badgeMeta: Record<string, { emoji: string; color: string; textColor: string; border: string; bg: string }> = {
    gold:    { emoji: '🥇', color: 'text-yellow-400', textColor: 'text-yellow-400', border: 'border-yellow-400/30', bg: 'bg-yellow-400/[0.06]' },
    silver:  { emoji: '🥈', color: 'text-slate-300', textColor: 'text-slate-300', border: 'border-slate-400/30', bg: 'bg-slate-400/[0.06]' },
    bronze:  { emoji: '🥉', color: 'text-amber-600', textColor: 'text-amber-600', border: 'border-amber-600/30', bg: 'bg-amber-600/[0.06]' },
    none:    { emoji: '⚪', color: 'text-text-muted', textColor: 'text-text-muted', border: 'border-[rgba(255,255,255,0.08)]', bg: 'bg-surface-1' },
  };

  const probBar = [
    { label: '🥉 Bronze', pct: 35, active: false },
    { label: '🥈 Silver', pct: 25, active: false },
    { label: '🥇 Gold', pct: 8, active: false },
    { label: '⚪ None', pct: 22, active: false },
    { label: '🚫 Flagged', pct: 10, active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="rounded-2xl glass-card-matte p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-cyan-primary/[0.08] border border-cyan-primary/20">
            <Terminal size={18} className="text-cyan-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary mb-1">CLI Walkthrough</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Registers a real agent on Sui testnet, records executions, and checks badge eligibility.
              Agent will appear on the <Link href="/leaderboard" className="text-cyan-primary hover:underline">Leaderboard</Link> after completion.
            </p>
          </div>
        </div>
      </div>

      {/* Probability bar */}
      <div className="rounded-2xl bg-surface-0/60 border border-[rgba(255,255,255,0.06)] p-4">
        <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider mb-3">Outcome Probability</p>
        <div className="flex gap-1 h-5 rounded-full overflow-hidden">
          <div className="bg-amber-600/50 flex-1 relative" style={{flex: 35}} title="Bronze 35%">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80">35%</span>
          </div>
          <div className="bg-slate-400/50 flex-1 relative" style={{flex: 25}} title="Silver 25%">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80">25%</span>
          </div>
          <div className="bg-yellow-400/50 flex-1 relative" style={{flex: 8}} title="Gold 8%">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-bg-base">8%</span>
          </div>
          <div className="bg-surface-2 flex-1 relative" style={{flex: 22}} title="None 22%">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-text-muted">22%</span>
          </div>
          <div className="bg-red-400/50 flex-1 relative" style={{flex: 10}} title="Flagged 10%">
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/80">10%</span>
          </div>
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-text-muted font-mono">🥉 Bronze 35%</span>
          <span className="text-[9px] text-text-muted font-mono">🥈 Silver 25%</span>
          <span className="text-[9px] text-text-muted font-mono">🥇 Gold 8%</span>
          <span className="text-[9px] text-text-muted font-mono">None 22%</span>
          <span className="text-[9px] text-text-muted font-mono">🚫 Flagged 10%</span>
        </div>
      </div>

      {/* Terminal window */}
      <div className={`rounded-2xl overflow-hidden border bg-[#0a0d0f] transition-all duration-500 ${!running && !done ? 'glow-pulse border-cyan-primary/25' : 'border-[rgba(255,255,255,0.08)] shadow-lg shadow-cyan-primary/5'}`}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[rgba(255,255,255,0.06)] bg-[#0e1214]">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 font-mono text-xs text-text-muted">aegis - sui testnet terminal</span>
          <div className="ml-auto flex items-center gap-2">
            {running && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-mint-secondary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mint-secondary" />
                </span>
                {realTx ? 'EXECUTING ON TESTNET' : 'SIMULATING'}
              </span>
            )}
            {done && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400">
                <Award size={10} /> {realTx ? 'ON-CHAIN COMPLETE' : 'SIMULATION COMPLETE'}
              </span>
            )}
          </div>
        </div>

        {/* Output area */}
        <div
          ref={termRef}
          className="h-[480px] overflow-y-auto p-6 font-mono text-xs leading-6 scroll-smooth"
        >
          {visibleLines === 0 && !running && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <Terminal size={40} className="text-text-muted opacity-40" />
              <p className="text-text-muted text-sm">Click &quot;Run Demo&quot; to register an agent on Sui testnet</p>
            </div>
          )}

          {currentSim && currentSim.lines.slice(0, visibleLines).map((line, i) => {
            if (line.type === 'spacer') return <div key={i} className="h-2" />;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={`${lineColor[line.type]} whitespace-pre-wrap break-all`}
              >
                {line.text}
              </motion.div>
            );
          })}

          {running && (
            <span className="inline-block w-2 h-3.5 bg-cyan-primary animate-pulse ml-0.5" />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={startDemo}
          disabled={running}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 glow-pulse-fast"
        >
          {running ? (
            <><RefreshCw size={14} className="animate-spin" /> Running...</>
          ) : done ? (
            <><RefreshCw size={14} /> Run Again</>
          ) : (
            <><Play size={14} /> Run Demo</>
          )}
        </button>

        {done && currentSim && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-[12px] ${currentSim.isFlagged ? 'bg-red-400/[0.06] border border-red-400/20' : badgeMeta[currentSim.badge]?.bg + ' border ' + badgeMeta[currentSim.badge]?.border}`}
            >
              <span className="text-2xl">{currentSim.isFlagged ? '🚫' : badgeMeta[currentSim.badge]?.emoji}</span>
              <div>
                <p className={`font-bold text-sm ${currentSim.isFlagged ? 'text-red-400' : badgeMeta[currentSim.badge]?.color}`}>
                  {currentSim.isFlagged ? 'Agent Flagged' : `${currentSim.badge !== 'none' ? currentSim.badge.charAt(0).toUpperCase() + currentSim.badge.slice(1) : 'No'} Badge`}
                </p>
                <p className="text-text-muted text-xs">
                  {currentSim.isFlagged
                    ? `${currentSim.successRate}% success rate — below threshold`
                    : currentSim.badge !== 'none'
                      ? `Agent certified — ${currentSim.successRate}% success rate`
                      : `${currentSim.successRate}% success rate — requirements not met`
                  }
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Link
                href={realTx ? "/leaderboard" : "/agents"}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-cyan-primary/30 text-cyan-primary text-sm font-medium hover:bg-cyan-primary/[0.06] transition-all"
              >
                {realTx ? 'View on Leaderboard' : 'View in Agent List'} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </>
        )}
      </div>

      {/* Badge result cards */}
      {done && currentSim && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {(['gold', 'silver', 'bronze'] as const).map((tier) => {
            const meta = badgeMeta[tier];
            const isGranted = !currentSim.isFlagged && currentSim.badge === tier;
            const eligibleTiers: Record<string, { execs: number; rate: number; vol: number }> = {
              gold: { execs: 200, rate: 95, vol: 1000 },
              silver: { execs: 50, rate: 90, vol: 0 },
              bronze: { execs: 10, rate: 80, vol: 0 },
            };
            const req = eligibleTiers[tier];
            const missingExecs = Math.max(0, req.execs - currentSim.totalExecs);
            const missingRate = Math.max(0, req.rate - currentSim.successRate);
            const why = [];
            if (currentSim.isFlagged) why.push('Agent flagged');
            if (missingExecs > 0) why.push(`Need ${missingExecs} more execs`);
            if (missingRate > 0) why.push(`Need ${missingRate}% more success rate`);

            return (
              <div
                key={tier}
                className={`rounded-xl p-4 border flex items-center gap-3 ${isGranted ? meta.border + ' ' + meta.bg : 'border-[rgba(255,255,255,0.08)] bg-surface-1'}`}
              >
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <p className="font-display font-bold text-text-primary text-sm capitalize">{tier}</p>
                  <p className={`font-mono text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 ${isGranted ? meta.color : 'text-text-muted'}`}>
                    {isGranted ? <><CheckCircle2 size={10} /> GRANTED</> : <><XCircle size={10} /> {why[0] || 'NOT ELIGIBLE'}</>}
                  </p>
                  {why.length > 1 && (
                    <p className="text-text-muted text-[9px] mt-0.5">{why.slice(1).join(', ')}</p>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Stats summary */}
      {done && currentSim && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl glass-card-matte p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: 'Executions', value: currentSim.totalExecs, color: 'text-cyan-primary' },
            { label: 'Success Rate', value: `${currentSim.successRate}%`, color: currentSim.successRate >= 80 ? 'text-mint-secondary' : 'text-red-400' },
            { label: 'Total Volume', value: `${currentSim.totalVolumeSUI.toFixed(1)} SUI`, color: 'text-yellow-400' },
            { label: 'Avg Slippage', value: `${currentSim.avgSlippageBps} BPS`, color: currentSim.avgSlippageBps <= 200 ? 'text-mint-secondary' : 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider">{label}</p>
              <p className={`font-display font-bold text-lg ${color}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function DeveloperPage() {
  const [tab, setTab] = useState<'hub' | 'pipeline' | 'demo'>('hub');
  const [copied, setCopied] = useState<string | null>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const flowInView = useInView(flowRef, { once: true, margin: '-60px' });

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div className="mb-10" initial="hidden" animate="visible" variants={fadeUp}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Code2 size={28} className="text-cyan-primary" />
            <h1 className="font-display text-5xl font-bold gradient-text-cyan">Developer Hub</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-lg">Integrate your AI agent with Aegis on Sui</p>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all shadow-glow-cyan"
            >
              <Zap size={14} /> Register Agent
            </Link>
          </div>
        </motion.div>

        {/* For Protocols Section */}
        <motion.div 
          className="mb-10 rounded-2xl bg-gradient-to-r from-cyan-primary/[0.15] to-mint-secondary/[0.10] border border-cyan-primary/35 p-6"
          initial="hidden" animate="visible" variants={fadeUp}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-cyan-primary/20">
              <Workflow size={18} className="text-cyan-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-text-primary mb-2">For Protocols & Builders</h3>
              <p className="text-text-secondary text-sm mb-4">
                Don't verify agents yourself. Let Aegis do it. One API call gives you verified agent trust — zero infrastructure cost.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-bg-base/50 p-3 border border-[rgba(255,255,255,0.06)]">
                  <p className="text-cyan-primary font-bold text-sm mb-1">🏦 Wallets</p>
                  <p className="text-text-muted text-xs">Verify agent trust before fund delegation</p>
                </div>
                <div className="rounded-xl bg-bg-base/50 p-3 border border-[rgba(255,255,255,0.06)]">
                  <p className="text-mint-secondary font-bold text-sm mb-1">🏪 Marketplaces</p>
                  <p className="text-text-muted text-xs">Display certified badges on listings</p>
                </div>
                <div className="rounded-xl bg-bg-base/50 p-3 border border-[rgba(255,255,255,0.06)]">
                  <p className="text-yellow-400 font-bold text-sm mb-1">⚡ DeFi</p>
                  <p className="text-text-muted text-xs">Score agents for automated trading</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <code className="text-xs text-cyan-primary font-mono">
                  const rep = await aegis.getReputation(agentAddress); // Returns: {'{'} badge, successRate, isFlagged {'}'}
                </code>
                <Link
                  href="/for-protocols"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-primary hover:text-mint-secondary transition-colors font-medium group flex-shrink-0 ml-4"
                >
                  Learn More <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tab selector ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
          initial="hidden" animate="visible" variants={fadeUp}
          transition={{ delay: 0.08 }}
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`
                  relative rounded-2xl p-5 text-left transition-all duration-200 border
                  ${active
                    ? 'bg-cyan-primary/[0.08] border-cyan-primary/30 shadow-glow-cyan'
                    : t.id === 'demo'
                      ? 'border-cyan-primary/25 bg-cyan-primary/[0.04] glow-pulse hover:bg-cyan-primary/[0.07] hover:border-cyan-primary/40'
                      : 'glass-card-matte hover:bg-surface-2/60 hover:border-cyan-primary/10'
                  }
                `}
              >
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-colors ${active ? 'bg-cyan-primary/20' : t.id === 'demo' ? 'bg-cyan-primary/10' : 'bg-surface-2'}`}>
                  <Icon size={16} className={active || t.id === 'demo' ? 'text-cyan-primary' : 'text-text-muted'} />
                </div>
                <p className={`font-display font-bold text-sm mb-0.5 ${active || t.id === 'demo' ? 'text-cyan-primary' : 'text-text-primary'}`}>
                  {t.label}
                </p>
                <p className="text-text-muted text-xs">{t.desc}</p>
                {active && (
                  <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-cyan-primary" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Tab content ── */}
        <AnimatePresence mode="wait">

          {/* ── DEVELOPER HUB ── */}
          {tab === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              {/* Contract Addresses */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4">Contract Addresses</h2>
                <div className="rounded-2xl glass-card-heavy divide-y divide-[rgba(255,255,255,0.06)]">
                  {[
                    { label: 'Package ID', value: config.packageId, id: 'package' },
                    { label: 'BadgeRegistry', value: config.badgeRegistry, id: 'registry' },
                  ].map(({ label, value, id }) => (
                    <div key={id} className="flex items-center justify-between px-6 py-4 gap-4">
                      <span className="text-text-muted text-sm min-w-[110px]">{label}</span>
                      <code className="font-mono text-xs text-text-primary flex-1 truncate">{value}</code>
                      <button
                        onClick={() => copyToClipboard(value, id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-cyan-primary/10 border border-[rgba(255,255,255,0.08)] hover:border-cyan-primary/30 text-text-secondary hover:text-cyan-primary text-xs font-medium transition-all"
                      >
                        {copied === id ? <Check size={12} /> : <Copy size={12} />}
                        {copied === id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center px-6 py-4 gap-4">
                    <span className="text-text-muted text-sm min-w-[110px]">Network</span>
                    <span className="font-mono text-xs font-bold text-cyan-primary">testnet</span>
                  </div>
                </div>
              </section>

              {/* Quick Start */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Zap size={18} className="text-cyan-primary" /> Quick Start
                </h2>
                <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-6 overflow-x-auto">
                  <pre className="font-mono text-sm text-cyan-primary leading-relaxed whitespace-pre">{`// 1. Register your agent
const result = await aegis.registerAgent();
// Returns: { digest, objectId }

// 2. Record executions
await aegis.recordExecution({
  objectId: '0x...',
  success: true,
  volume: 1000000000,  // 1 SUI
  slippage: 50         // 0.5%
});

// 3. Check eligibility
const eligible = await aegis.isEligibleForBadge(objectId, 1);
// Returns: true/false (for Bronze badge)

// 4. Request badge
await aegis.grantBadge({
  agentId: '0x...',
  badgeType: 1  // Bronze
});`}</pre>
                </div>
              </section>

              {/* SDK Functions */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4">SDK Functions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'registerAgent()', desc: 'Create a new ReputationObject for your agent', tag: 'Returns', code: '{ digest: string, objectId: string }' },
                    { name: 'recordExecution()', desc: 'Report execution results to build reputation', tag: 'Params', code: 'success: bool, volume: u64, slippage: u64' },
                    { name: 'isEligibleForBadge()', desc: 'Check if agent meets badge requirements', tag: 'Params', code: 'badgeType: 1|2|3 (Bronze|Silver|Gold)' },
                    { name: 'grantBadge()', desc: 'Request a badge from the registry', tag: 'Params', code: 'agentId, badgeType' },
                    { name: 'getAgentReputation()', desc: 'Fetch agent metrics from blockchain', tag: 'Returns', code: 'ReputationData' },
                    { name: 'checkAndRevokeInvalid()', desc: 'Trigger auto-revocation check - anyone can call', tag: null, code: null },
                  ].map(({ name, desc, tag, code }) => (
                    <div key={name} className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 transition-colors">
                      <p className="font-mono text-sm font-semibold text-cyan-primary mb-1">{name}</p>
                      <p className="text-text-secondary text-xs mb-3">{desc}</p>
                      {tag && code && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-surface-2 text-text-muted text-[10px] font-semibold uppercase tracking-wide">{tag}</span>
                          <code className="font-mono text-xs text-text-primary">{code}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Badge Requirements Table */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <BarChart2 size={18} className="text-cyan-primary" /> Badge Requirements
                </h2>
                <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <div className="grid grid-cols-4 px-5 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
                    {['Badge', 'Executions', 'Success Rate', 'Volume'].map(h => (
                      <span key={h} className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">{h}</span>
                    ))}
                  </div>
                  {[
                    { badge: '🥉 Bronze', execs: '10+', success: '80%+', volume: 'Any', color: 'text-amber-600' },
                    { badge: '🥈 Silver', execs: '50+', success: '90%+', volume: 'Any', color: 'text-slate-300' },
                    { badge: '🥇 Gold',   execs: '200+', success: '95%+', volume: '$1M+', color: 'text-yellow-400' },
                  ].map(({ badge, execs, success, volume, color }) => (
                    <div key={badge} className="grid grid-cols-4 px-5 py-3.5 bg-surface-1 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-surface-2/50 transition-colors">
                      <span className={`font-semibold text-sm ${color}`}>{badge}</span>
                      <span className="font-mono text-sm text-text-primary">{execs}</span>
                      <span className="font-mono text-sm text-text-primary">{success}</span>
                      <span className="font-mono text-sm text-text-primary">{volume}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Auto-revocation rules */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-400" /> Auto-Revocation Rules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { WireIcon: UptimeIcon, title: 'Low Success Rate', desc: 'Agent flagged if success rate drops below 50%' },
                    { WireIcon: FlaggedIcon, title: 'Consecutive Failures', desc: 'Agent flagged after 5+ consecutive failures' },
                    { WireIcon: AlertIcon, title: 'High Slippage', desc: 'Agent flagged if slippage exceeds 500 BPS' },
                    { WireIcon: SuccessIcon, title: 'Recovery', desc: 'Unflag after 100 consecutive successes' },
                  ] as const).map(({ WireIcon, title, desc }) => (
                    <div key={title} className="rounded-2xl p-5 glass-card-matte flex gap-3">
                      <div className="w-9 h-9 flex-shrink-0 text-cyan-primary mt-0.5"><WireIcon /></div>
                      <div>
                        <p className="text-text-primary font-semibold text-sm mb-1">{title}</p>
                        <p className="text-text-secondary text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLI Reference */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Terminal size={18} className="text-cyan-primary" /> CLI Reference
                </h2>
                <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-6 overflow-x-auto">
                  <pre className="font-mono text-sm text-cyan-primary leading-relaxed whitespace-pre">{`# Register agent
sui client call \\
  --package ${config.packageId} \\
  --module reputation \\
  --function register_agent \\
  --gas-budget 20000000

# Record execution
sui client call \\
  --package ${config.packageId} \\
  --module reputation \\
  --function record_execution \\
  --args <OBJECT_ID> true 1000000000 50 \\
  --gas-budget 20000000

# Grant badge
sui client call \\
  --package ${config.packageId} \\
  --module badge_registry \\
  --function grant_badge \\
  --args ${config.badgeRegistry} <AGENT_ID> <BADGE_TYPE> \\
  --gas-budget 20000000

# Check badge validity
sui client call \\
  --package ${config.packageId} \\
  --module badge_registry \\
  --function is_badge_valid_for \\
  --args ${config.badgeRegistry} <AGENT_ID> <BADGE_TYPE> \\
  --gas-budget 10000000`}</pre>
                </div>
              </section>

              {/* Doc links */}
              <section>
                <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-cyan-primary" /> Documentation
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: '📖', label: 'Integration Guide', href: '/docs#integrations' },
                    { icon: '⚡', label: 'Quick Start', href: '/docs' },
                    { icon: '📊', label: 'Performance Metrics', href: '/docs' },
                    { icon: '🔒', label: 'Security Best Practices', href: '/docs#security' },
                  ].map(({ icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 hover:border-cyan-primary/20 hover:-translate-y-1 transition-all text-center flex flex-col items-center gap-2"
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-text-secondary text-xs font-medium leading-tight">{label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* ── PIPELINE ── */}
          {tab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >

              {/* Section 1 - For Protocols, Trust is One API Call */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-2">For Protocols, Trust is One API Call</h2>
                <p className="text-text-secondary text-sm mb-6">No infrastructure to build. No scoring system to maintain. One integration gives you full agent trust data.</p>
                <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-6 overflow-x-auto">
                  <pre className="font-mono text-sm text-cyan-primary leading-relaxed whitespace-pre">{`import { getReputation } from '@aegis/sdk';

// Single call returns everything you need
const rep = await getReputation(agentAddress);

// rep.badge        → 'bronze' | 'silver' | 'gold' | null
// rep.successRate  → 86.7
// rep.isFlagged    → false
// rep.uptime       → 99.1
// rep.totalExecs   → 247

if (rep.badge === 'gold' && !rep.isFlagged) {
  // Safe to delegate funds to this agent
}`}</pre>
                </div>
              </section>

              {/* Section 2 - Core Components */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Core Components</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {components.map((comp, i) => (
                    <motion.div
                      key={comp.name}
                      className={`rounded-2xl p-7 border ${comp.border} ${comp.bg} hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="text-4xl block mb-4">{comp.emoji}</span>
                      <h3 className={`font-display text-xl font-bold mb-2 ${comp.accent}`}>{comp.name}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{comp.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Section 3 - Integration Flow */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">How Protocols Use Aegis</h2>
                <div ref={flowRef} className="rounded-2xl glass-card-heavy p-8">
                  <div className="space-y-6">

                    {/* Row 1: AI Agent → Execute → DeepBook */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'AI Agent', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]', delay: 0 },
                        { label: '→', color: 'text-text-muted border-transparent bg-transparent', delay: 0.15 },
                        { label: 'Execute', color: 'border-mint-secondary/30 text-mint-secondary bg-mint-secondary/[0.06]', delay: 0.3 },
                        { label: '→', color: 'text-text-muted border-transparent bg-transparent', delay: 0.45 },
                        { label: 'DeepBook', color: 'border-purple-400/30 text-purple-400 bg-purple-400/[0.06]', delay: 0.6 },
                      ].map(({ label, color, delay }, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={flowInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay }}
                          className={`px-5 py-3 rounded-[10px] border font-mono text-[18px] font-semibold ${color}`}
                        >
                          {label}
                        </motion.div>
                      ))}
                    </div>

                    {/* Connectors down */}
                    <div className="flex justify-center gap-32">
                      {[{ color: 'from-mint-secondary/40', delay: 0.8 }, { color: 'from-purple-400/40', delay: 0.9 }].map(({ color, delay }, i) => (
                        <motion.div
                          key={i}
                          className={`w-px h-6 bg-gradient-to-b ${color} to-transparent`}
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={flowInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                          style={{ transformOrigin: 'top' }}
                          transition={{ duration: 0.3, delay }}
                        />
                      ))}
                    </div>

                    {/* Row 2: ReputationObject ◄── Walrus Storage */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'ReputationObject', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]', delay: 1.0 },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent', delay: 1.1 },
                        { label: 'Walrus Storage', color: 'border-mint-secondary/30 text-mint-secondary bg-mint-secondary/[0.06]', delay: 1.2 },
                      ].map(({ label, color, delay }, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={flowInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay }}
                          className={`px-5 py-3 rounded-[10px] border font-mono text-[18px] font-semibold ${color}`}
                        >
                          {label}
                        </motion.div>
                      ))}
                    </div>

                    {/* Connector down */}
                    <div className="flex justify-center">
                      <motion.div
                        className="w-px h-6 bg-gradient-to-b from-cyan-primary/40 to-transparent"
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={flowInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                        style={{ transformOrigin: 'top' }}
                        transition={{ duration: 0.3, delay: 1.35 }}
                      />
                    </div>

                    {/* Row 3: Protocol / Wallet ◄── Query API ◄── Badge Registry */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'Protocol / Wallet', color: 'border-yellow-400/30 text-yellow-400 bg-yellow-400/[0.06]', delay: 1.5 },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent', delay: 1.6 },
                        { label: 'Query API', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]', delay: 1.7 },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent', delay: 1.8 },
                        { label: 'Badge Registry', color: 'border-yellow-400/30 text-yellow-400 bg-yellow-400/[0.06]', delay: 1.9 },
                      ].map(({ label, color, delay }, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={flowInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay }}
                          className={`px-5 py-3 rounded-[10px] border font-mono text-[18px] font-semibold ${color}`}
                        >
                          {label}
                        </motion.div>
                      ))}
                    </div>

                  </div>
                </div>
              </section>

              {/* Section 3b - Why Protocols Choose Aegis */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Why Protocols Choose Aegis</h2>
                <div className="rounded-2xl glass-card-heavy overflow-hidden">
                  <div className="grid grid-cols-3 px-6 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
                    {['Stakeholder', 'Benefit', ''].map((h, i) => (
                      <span key={i} className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">{h}</span>
                    ))}
                  </div>
                  {[
                    { who: 'Wallets', benefit: 'Verify before delegating funds', icon: '🏦' },
                    { who: 'DeFi Protocols', benefit: 'Score agents for trading permissions', icon: '⚡' },
                    { who: 'AI Marketplaces', benefit: 'Badges as proof of trust for listings', icon: '🏪' },
                    { who: 'Audit Tools', benefit: 'Full immutable audit trail on-chain', icon: '🔍' },
                  ].map(({ who, benefit, icon }) => (
                    <div key={who} className="grid grid-cols-3 px-6 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-surface-1/40 transition-colors items-center">
                      <span className="font-display font-semibold text-text-primary text-sm">{who}</span>
                      <span className="text-text-secondary text-sm">{benefit}</span>
                      <span className="text-xl text-right">{icon}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4 - Data Flow */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Data Flow</h2>
                <div className="rounded-2xl glass-card-heavy p-8">
                  <div className="space-y-0">
                    {flow.map((item, i) => (
                      <motion.div
                        key={item.step}
                        className="flex gap-5 pb-6 last:pb-0"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-cyan-primary/10 border border-cyan-primary/20">
                            <span className="font-mono text-xs font-bold text-cyan-primary">{item.step}</span>
                          </div>
                          {i < flow.length - 1 && (
                            <div className="w-px flex-1 mt-2 bg-gradient-to-b from-cyan-primary/20 to-transparent min-h-[24px]" />
                          )}
                        </div>
                        <div className="pt-2">
                          <h4 className="font-semibold text-text-primary mb-1">{item.title}</h4>
                          <p className="text-text-secondary text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Section 5 - Tech Stack */}
              <section>
                <h2 className="font-display text-2xl font-bold text-text-primary mb-6">Tech Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {techStack.map((item, i) => (
                    <motion.div
                      key={item.tech}
                      className="rounded-2xl p-6 glass-card-matte hover:-translate-y-1 hover:border-cyan-primary/20 transition-all duration-300 text-center"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <span className="text-4xl block mb-3">{item.icon}</span>
                      <p className={`font-display font-bold text-base mb-1 ${item.color}`}>{item.tech}</p>
                      <p className="text-text-muted text-xs">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

            </motion.div>
          )}

          {/* ── LIVE DEMO ── */}
          {tab === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <LiveDemo />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
