'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Copy, Check, Terminal, Zap, BookOpen, BarChart2, AlertTriangle,
  Workflow, ArrowRight, Play, RefreshCw, CheckCircle2,
  XCircle, Award,
} from 'lucide-react';
import { config } from '../../config';

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
    label: 'Live Demo',
    icon: Play,
    desc: 'Interactive CLI simulation',
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

/* ─── Live Demo terminal lines ─── */
type LineType = 'cmd' | 'output' | 'success' | 'error' | 'spacer' | 'section';

interface TerminalLine {
  text: string;
  type: LineType;
  delay: number;
}

const DEMO_AGENT = '0xDEMO9f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9';
const DEMO_PKG = config.packageId.slice(0, 20) + '...';
const DEMO_REGISTRY = config.badgeRegistry.slice(0, 20) + '...';

const DEMO_LINES: TerminalLine[] = [
  { text: '# ── STEP 1: Register Agent ────────────────────', type: 'section', delay: 0 },
  { text: `$ sui client call \\`, type: 'cmd', delay: 400 },
  { text: `    --package ${DEMO_PKG} \\`, type: 'cmd', delay: 600 },
  { text: `    --module reputation \\`, type: 'cmd', delay: 800 },
  { text: `    --function register_agent \\`, type: 'cmd', delay: 1000 },
  { text: `    --gas-budget 20000000`, type: 'cmd', delay: 1200 },
  { text: '', type: 'spacer', delay: 1400 },
  { text: 'Connecting to Sui testnet...', type: 'output', delay: 1600 },
  { text: 'Transaction Digest: CkxP9mR7...7nRm', type: 'output', delay: 2200 },
  { text: `✓  Agent registered:  ${DEMO_AGENT}`, type: 'success', delay: 2800 },
  { text: '', type: 'spacer', delay: 3000 },

  { text: '# ── STEP 2: Record Executions ─────────────────', type: 'section', delay: 3200 },
  { text: `$ aegis batch-simulate --agent ${DEMO_AGENT.slice(0, 22)}... --count 15`, type: 'cmd', delay: 3600 },
  { text: '', type: 'spacer', delay: 3800 },
  { text: 'Recording execution  1/15  [success]  vol: 1.20 SUI  slip: 0.42%  ✓', type: 'success', delay: 4000 },
  { text: 'Recording execution  2/15  [success]  vol: 0.80 SUI  slip: 0.38%  ✓', type: 'success', delay: 4300 },
  { text: 'Recording execution  3/15  [success]  vol: 2.10 SUI  slip: 0.51%  ✓', type: 'success', delay: 4600 },
  { text: 'Recording execution  4/15  [success]  vol: 1.55 SUI  slip: 0.29%  ✓', type: 'success', delay: 4900 },
  { text: 'Recording execution  5/15  [success]  vol: 0.95 SUI  slip: 0.44%  ✓', type: 'success', delay: 5200 },
  { text: 'Recording execution  6/15  [success]  vol: 3.20 SUI  slip: 0.62%  ✓', type: 'success', delay: 5500 },
  { text: 'Recording execution  7/15  [success]  vol: 1.80 SUI  slip: 0.35%  ✓', type: 'success', delay: 5800 },
  { text: 'Recording execution  8/15  [success]  vol: 0.70 SUI  slip: 0.48%  ✓', type: 'success', delay: 6100 },
  { text: 'Recording execution  9/15  [success]  vol: 1.40 SUI  slip: 0.33%  ✓', type: 'success', delay: 6400 },
  { text: 'Recording execution 10/15  [success]  vol: 2.60 SUI  slip: 0.57%  ✓', type: 'success', delay: 6700 },
  { text: 'Recording execution 11/15  [success]  vol: 1.10 SUI  slip: 0.41%  ✓', type: 'success', delay: 7000 },
  { text: 'Recording execution 12/15  [FAILED]   vol: 0.50 SUI               ✗', type: 'error',   delay: 7300 },
  { text: 'Recording execution 13/15  [success]  vol: 1.90 SUI  slip: 0.46%  ✓', type: 'success', delay: 7600 },
  { text: 'Recording execution 14/15  [FAILED]   vol: 0.30 SUI               ✗', type: 'error',   delay: 7900 },
  { text: 'Recording execution 15/15  [success]  vol: 2.10 SUI  slip: 0.39%  ✓', type: 'success', delay: 8200 },
  { text: '', type: 'spacer', delay: 8400 },
  { text: 'Summary → 13/15 succeeded  (86.7%)   Total volume: 21.70 SUI', type: 'output', delay: 8600 },
  { text: '', type: 'spacer', delay: 8800 },

  { text: '# ── STEP 3: Check Badge Eligibility ───────────', type: 'section', delay: 9000 },
  { text: `$ aegis check-eligibility --agent ${DEMO_AGENT.slice(0, 22)}...`, type: 'cmd', delay: 9400 },
  { text: '', type: 'spacer', delay: 9600 },
  { text: '[Bronze]  executions 15 ≥ 10  ✓   success 86.7% ≥ 80%  ✓  → ELIGIBLE', type: 'success', delay: 9800 },
  { text: '[Silver]  executions 15 < 50  ✗                            → NOT ELIGIBLE', type: 'error', delay: 10100 },
  { text: '[Gold]    executions 15 < 200 ✗                            → NOT ELIGIBLE', type: 'error', delay: 10400 },
  { text: '', type: 'spacer', delay: 10600 },

  { text: '# ── STEP 4: Mint Bronze Badge ──────────────────', type: 'section', delay: 10800 },
  { text: `$ sui client call \\`, type: 'cmd', delay: 11200 },
  { text: `    --package ${DEMO_PKG} \\`, type: 'cmd', delay: 11400 },
  { text: `    --module badge_registry \\`, type: 'cmd', delay: 11600 },
  { text: `    --function grant_badge \\`, type: 'cmd', delay: 11800 },
  { text: `    --args ${DEMO_REGISTRY} ${DEMO_AGENT.slice(0, 16)}... 1 \\`, type: 'cmd', delay: 12000 },
  { text: `    --gas-budget 20000000`, type: 'cmd', delay: 12200 },
  { text: '', type: 'spacer', delay: 12400 },
  { text: 'Minting badge NFT in Kiosk registry...', type: 'output', delay: 12600 },
  { text: 'Transaction Digest: Bm3nQ9pL...9pLk', type: 'output', delay: 13400 },
  { text: '🥉  Bronze Badge minted!  Token: 0xBRONZE...5E91', type: 'success', delay: 14000 },
  { text: '    Agent is now certified as BRONZE - RESTRICTED READ ONLY', type: 'success', delay: 14400 },
];

/* ─── Live Demo Component ─── */
function LiveDemo() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function startDemo() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisibleLines(0);
    setRunning(true);
    setDone(false);

    DEMO_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
        if (i === DEMO_LINES.length - 1) {
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

  return (
    <div className="space-y-6">
      {/* Explanation */}
      <div className="rounded-2xl glass-card-matte p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-cyan-primary/[0.08] border border-cyan-primary/20">
            <Terminal size={18} className="text-cyan-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-text-primary mb-1">Interactive CLI Simulation</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Watch real Sui CLI commands register an AI agent, record 15 executions, evaluate badge
              eligibility, and mint a Bronze badge - all on Sui testnet with real contract calls.
            </p>
          </div>
        </div>
      </div>

      {/* Terminal window */}
      <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0a0d0f]">
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
                RUNNING
              </span>
            )}
            {done && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400">
                <Award size={10} /> DEMO COMPLETE
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
              <p className="text-text-muted text-sm">Click &quot;Run Demo&quot; to start the simulation</p>
            </div>
          )}

          {DEMO_LINES.slice(0, visibleLines).map((line, i) => {
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

          {/* Blinking cursor while running */}
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {running ? (
            <><RefreshCw size={14} className="animate-spin" /> Running...</>
          ) : done ? (
            <><RefreshCw size={14} /> Run Again</>
          ) : (
            <><Play size={14} /> Run Demo</>
          )}
        </button>

        {done && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-5 py-3 rounded-[12px] bg-yellow-400/[0.06] border border-yellow-400/20"
          >
            <span className="text-2xl">🥉</span>
            <div>
              <p className="text-yellow-400 font-bold text-sm">Bronze Badge Minted</p>
              <p className="text-text-muted text-xs">Agent certified - 86.7% success rate</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Badge result cards */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { emoji: '🥉', label: 'Bronze', status: 'GRANTED', color: 'border-amber-600/30 bg-amber-600/[0.04]', textColor: 'text-amber-600', icon: CheckCircle2 },
            { emoji: '🥈', label: 'Silver', status: 'NOT ELIGIBLE', color: 'border-[rgba(255,255,255,0.08)] bg-surface-1', textColor: 'text-text-muted', icon: XCircle },
            { emoji: '🥇', label: 'Gold',   status: 'NOT ELIGIBLE', color: 'border-[rgba(255,255,255,0.08)] bg-surface-1', textColor: 'text-text-muted', icon: XCircle },
          ].map(({ emoji, label, status, color, textColor, icon: Icon }) => (
            <div key={label} className={`rounded-xl p-4 border ${color} flex items-center gap-3`}>
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-display font-bold text-text-primary text-sm">{label}</p>
                <p className={`font-mono text-[10px] font-semibold uppercase tracking-wide ${textColor} flex items-center gap-1`}>
                  <Icon size={10} /> {status}
                </p>
              </div>
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
          <p className="text-text-secondary text-lg">Integrate your AI agent with Aegis on Sui</p>
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
                    : 'glass-card-matte hover:bg-surface-2/60 hover:border-cyan-primary/10'
                  }
                `}
              >
                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 transition-colors ${active ? 'bg-cyan-primary/20' : 'bg-surface-2'}`}>
                  <Icon size={16} className={active ? 'text-cyan-primary' : 'text-text-muted'} />
                </div>
                <p className={`font-display font-bold text-sm mb-0.5 ${active ? 'text-cyan-primary' : 'text-text-primary'}`}>
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
                  {[
                    { icon: '📉', title: 'Low Success Rate', desc: 'Agent flagged if success rate drops below 50%' },
                    { icon: '❌', title: 'Consecutive Failures', desc: 'Agent flagged after 5+ consecutive failures' },
                    { icon: '💸', title: 'High Slippage', desc: 'Agent flagged if slippage exceeds 500 BPS' },
                    { icon: '🔄', title: 'Recovery', desc: 'Unflag after 100 consecutive successes' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="rounded-2xl p-5 glass-card-matte flex gap-3">
                      <span className="text-xl">{icon}</span>
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
                    { icon: '📖', label: 'Integration Guide', href: '/docs/AGENT_INTEGRATION_GUIDE.md' },
                    { icon: '⚡', label: 'Quick Start', href: '/docs/AGENT_QUICKSTART.md' },
                    { icon: '📊', label: 'Performance Metrics', href: '/docs/AGENT_PERFORMANCE.md' },
                    { icon: '🔒', label: 'Security Analysis', href: '/docs/SECURITY_ANALYSIS.md' },
                  ].map(({ icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 hover:border-cyan-primary/20 hover:-translate-y-1 transition-all text-center flex flex-col items-center gap-2"
                    >
                      <span className="text-2xl">{icon}</span>
                      <span className="text-text-secondary text-xs font-medium leading-tight">{label}</span>
                    </a>
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
                {/* Top row: AI Agent → Execute → DeepBook */}
                <div className="rounded-2xl glass-card-heavy p-8">
                  <div className="space-y-6">
                    {/* Flow diagram row 1 */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'AI Agent', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]' },
                        { label: '→', color: 'text-text-muted border-transparent bg-transparent' },
                        { label: 'Execute', color: 'border-mint-secondary/30 text-mint-secondary bg-mint-secondary/[0.06]' },
                        { label: '→', color: 'text-text-muted border-transparent bg-transparent' },
                        { label: 'DeepBook', color: 'border-purple-400/30 text-purple-400 bg-purple-400/[0.06]' },
                      ].map(({ label, color }, i) => (
                        <div key={i} className={`px-4 py-2 rounded-[10px] border font-mono text-xs font-semibold ${color}`}>
                          {label}
                        </div>
                      ))}
                    </div>
                    {/* Connectors going down */}
                    <div className="flex justify-center gap-32">
                      <div className="w-px h-6 bg-gradient-to-b from-mint-secondary/30 to-transparent" />
                      <div className="w-px h-6 bg-gradient-to-b from-purple-400/30 to-transparent" />
                    </div>
                    {/* Flow diagram row 2 */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'ReputationObject', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]' },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent' },
                        { label: 'Walrus Storage', color: 'border-mint-secondary/30 text-mint-secondary bg-mint-secondary/[0.06]' },
                      ].map(({ label, color }, i) => (
                        <div key={i} className={`px-4 py-2 rounded-[10px] border font-mono text-xs font-semibold ${color}`}>
                          {label}
                        </div>
                      ))}
                    </div>
                    {/* Connectors */}
                    <div className="flex justify-center">
                      <div className="w-px h-6 bg-gradient-to-b from-cyan-primary/30 to-transparent" />
                    </div>
                    {/* Flow diagram row 3 */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      {[
                        { label: 'Protocol / Wallet', color: 'border-yellow-400/30 text-yellow-400 bg-yellow-400/[0.06]' },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent' },
                        { label: 'Query API', color: 'border-cyan-primary/30 text-cyan-primary bg-cyan-primary/[0.06]' },
                        { label: '◄──', color: 'text-text-muted border-transparent bg-transparent' },
                        { label: 'Badge Registry', color: 'border-yellow-400/30 text-yellow-400 bg-yellow-400/[0.06]' },
                      ].map(({ label, color }, i) => (
                        <div key={i} className={`px-4 py-2 rounded-[10px] border font-mono text-xs font-semibold ${color}`}>
                          {label}
                        </div>
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
