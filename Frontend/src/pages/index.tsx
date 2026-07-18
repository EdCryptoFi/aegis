'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Activity,
  ArrowRight,
  Search,
  Users,
  Award,
  Zap,
  TrendingUp,
  Lock,
  Cpu,
  Globe,
  BarChart2,
  Code2,
  Wallet,
  ShoppingBag,
} from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import Footer from '@/components/Footer';
import DecryptedText from '@/components/DecryptedText';
import AegisLogo from '@/components/AegisLogo';
import { SuiIcon, DeepBookIcon, MemWalIcon, WalrusIcon } from '@/components/EcosystemIcons';
import SupportedBy from '@/components/SupportedBy';
import {
  AgentsTrackedIcon, SuccessRateIcon, VolumeProtectedIcon,
  ProtocolIcon, ZeroInfraIcon, OneIntegrationIcon,
  WalletsIcon, DeFiIcon, MarketplacesIcon, PortfoliosIcon,
  RegisterIcon, RecordIcon, EarnBadgeIcon,
} from '@/components/AegisIcons';

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Data ─── */
const stats = [
  { label: 'Agents on Testnet', sublabel: 'Registered on Sui', value: 3, prefix: '', suffix: '', icon: Users, delta: 'Phase 1', positive: true },
  { label: 'Smart Contracts', sublabel: 'Deployed & verified', value: 3, prefix: '', suffix: '', icon: Cpu, delta: 'Live', positive: true },
  { label: 'Executions', sublabel: 'Recorded onchain', value: 350, prefix: '~', suffix: '', icon: Zap, delta: 'Testnet', positive: true },
];

const tickerItems = [
  { label: 'AGENTS LIVE', value: '3', icon: Users },
  { label: 'NETWORK', value: 'SUI TESTNET', icon: Globe },
  { label: 'SMART CONTRACTS', value: '3', icon: Cpu },
  { label: 'EXECUTIONS', value: '~350', icon: Zap },
  { label: 'PHASE', value: '1 · REPUTATION LAYER', icon: Activity },
  { label: 'SUCCESS RATE', value: '86.7%', icon: TrendingUp },
  { label: 'BADGES ISSUED', value: '3', icon: Award },
  { label: 'OPEN SOURCE', value: 'YES', icon: Code2 },
];

const steps = [
  {
    title: 'Register Your Agent',
    description: 'Deploy your AI agent and register it on the Aegis smart contract on Sui.',
    icon: Cpu,
  },
  {
    title: 'Record Onchain Actions',
    description: 'Every execution is verified and scored in real-time against performance thresholds.',
    icon: BarChart2,
  },
  {
    title: 'Earn Trust Badges',
    description: 'Consistent performance automatically unlocks Bronze, Silver, and Gold reputation badges.',
    icon: Award,
  },
];

const statsIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Agents on Testnet': AgentsTrackedIcon,
  'Smart Contracts': SuccessRateIcon,
  'Executions': VolumeProtectedIcon,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [agentAddress, setAgentAddress] = useState('');
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });
  const integratedRef = useRef<HTMLDivElement>(null);
  const integratedInView = useInView(integratedRef, { once: true, margin: '-60px' });

  const handleCheckReputation = () => {
    if (agentAddress.trim()) {
      window.location.href = `/agent/${agentAddress.trim()}`;
    }
  };

  return (
    <main className="min-h-screen bg-bg-base overflow-hidden">

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6">
        <ParticleBackground />
        <GlowOrbs />

        {/* Ambient breathing overlay */}
        <div className="absolute inset-0 pointer-events-none ambient-breathe hero-ambient" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

        <motion.div
          className="relative z-20 text-center max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6 mt-16">
            <div style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
              <AegisLogo className="w-[291px] h-[291px]" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-display-lg-mobile md:text-display-lg text-text-primary mb-6 leading-tight"
          >
            <DecryptedText
              text="AI agents are trading. Who do you trust?"
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={35}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()"
              className="gradient-text-cyan"
              encryptedClassName="text-text-muted opacity-40"
            />
          </motion.h1>

          {/* Live tag */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary text-label-sm font-mono uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-secondary" />
              </span>
              <Shield size={13} />
              Live on Sui Testnet · Phase 1 · Reputation Layer
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-text-secondary max-w-none mx-auto mb-10"
          >
            Before you let an AI agent touch your treasury, Aegis gives you a provable onchain report card -
            success rate, volume, uptime, and badges. One API call.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/for-protocols"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all shadow-glow-cyan"
            >
              For Protocols
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-[12px] border border-cyan-primary/30 bg-cyan-primary/[0.04] text-text-primary font-display font-bold text-sm hover:bg-cyan-primary/[0.08] hover:shadow-glow-cyan transition-all"
            >
              Register Your Agent
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-surface-1/20 backdrop-blur-sm text-text-primary font-display font-bold text-sm hover:bg-surface-1/40 transition-all"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, i) => {
              const StatIcon = statsIconMap[stat.label];
              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                    whileHover={{ y: -10, transition: { duration: 0.25 } }}
                    className="rounded-xl overflow-hidden cursor-default glass-card-heavy"
                  >
                    <div className="p-5 pb-3">
                      {/* Top row: icon + label */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-14 h-14 flex-shrink-0 text-cyan-primary">
                          {StatIcon && <StatIcon />}
                        </div>
                        <div className="mt-1">
                          <p className="text-sm font-display font-semibold text-text-primary leading-tight">{stat.label}</p>
                          <p className="text-[10px] font-mono text-text-muted">{stat.sublabel}</p>
                        </div>
                      </div>
                      {/* Number + delta */}
                      <div className="flex items-end justify-between">
                        <p className="text-4xl font-display font-black text-text-primary leading-none">
                          <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                        </p>
                        <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded mb-0.5 ${stat.positive ? 'text-mint-secondary bg-mint-secondary/10' : 'text-error bg-error/10'}`}>
                          {stat.delta}
                        </span>
                      </div>
                    </div>
                    {/* Sparkline bar */}
                    <div className="h-10 w-full sparkline-bar mt-3" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Phase 1 disclaimer */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-text-muted text-[11px] font-mono tracking-wide">
              Phase 1 · Live on Sui testnet · Proving the model ·{' '}
              <span className="text-cyan-primary/50">Phase 2: Capital delegation via protocol integration</span>
            </p>
          </motion.div>

          {/* Integrated with */}
          <motion.div
            ref={integratedRef}
            initial={{ opacity: 0, y: 20 }}
            animate={integratedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mt-16 flex flex-col items-center gap-6"
          >
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Integrated with</p>
            <div className="w-full flex flex-wrap items-center justify-center gap-10 px-8 py-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-surface-0/40 backdrop-blur-sm">
              {/* Sui */}
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] flex-shrink-0">
                  {integratedInView && <SuiIcon />}
                </div>
                <span className="font-display font-bold text-text-secondary text-lg tracking-wide">Sui</span>
              </div>

              <span className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />

              {/* DeepBook */}
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] flex-shrink-0">
                  {integratedInView && <DeepBookIcon />}
                </div>
                <span className="font-display font-bold text-text-secondary text-lg tracking-wide">DeepBook</span>
              </div>

              <span className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />

              {/* MemWal */}
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] flex-shrink-0">
                  {integratedInView && <MemWalIcon />}
                </div>
                <span className="font-display font-bold text-text-secondary text-lg tracking-wide">MemWal</span>
              </div>

              <span className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />

              {/* Walrus */}
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] flex-shrink-0">
                  {integratedInView && <WalrusIcon />}
                </div>
                <span className="font-display font-bold text-text-secondary text-lg tracking-wide">Walrus</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ═══════ THE PROBLEM ═══════ */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              AI agents are executing DeFi strategies, managing portfolios, and trading on DeepBook -{' '}
              <strong className="text-text-primary">right now.</strong>
            </p>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              But when a protocol wants to delegate capital to an agent, there&apos;s one question nobody can answer:
            </p>
            <p className="font-display text-2xl md:text-3xl font-bold gradient-text-cyan mb-6">
              &ldquo;Is this agent trustworthy?&rdquo;
            </p>
            <p className="text-text-muted text-base mb-10">
              Without a track record, you&apos;re flying blind. One bad agent can drain a treasury.
            </p>
            <div className="rounded-2xl bg-cyan-primary/[0.04] border border-cyan-primary/20 p-6 text-left">
              <p className="text-cyan-primary font-display font-bold text-xs mb-2 uppercase tracking-wider">The Solution</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Aegis records every execution on Sui - success, failure, volume, slippage - and issues verifiable badges
                (Bronze → Silver → Gold). Check the report card before you delegate. Not after.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TWO AUDIENCES ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">
              Choose Your Path
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-text-primary mb-3 leading-tight">
              Who are you?
            </h2>
            <p className="text-text-secondary text-base max-w-lg mx-auto">
              Aegis serves two distinct needs. Pick your path.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            {/* For Institutions & Protocols */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl glass-card-heavy p-8 flex flex-col border border-cyan-primary/15"
            >
              <div className="w-14 h-14 mb-5 text-cyan-primary">
                <ProtocolIcon />
              </div>
              <h3 className="font-display font-bold text-text-primary text-xl mb-2">
                For Institutions &amp; Protocols
              </h3>
              <div className="w-12 h-px bg-cyan-primary/30 mb-4" />
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                You don&apos;t build agents. You need to verify them before delegating capital.
                One API call gives you full agent trust - no infrastructure to build.
              </p>
              <div className="space-y-2.5 flex-1 mb-7">
                {[
                  'One API call - full agent trust.',
                  'No reputation database to build.',
                  'No badge system to design.',
                  'No infrastructure overhead.',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-mint-secondary/10 border border-mint-secondary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-mint-secondary text-[8px] font-bold">✓</span>
                    </span>
                    <span className="text-text-secondary text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/for-protocols"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all w-fit"
              >
                Integrate Aegis <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* For Agent Builders */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl glass-card-heavy p-8 flex flex-col border border-mint-secondary/15"
            >
              <div className="w-14 h-14 mb-5 text-mint-secondary">
                <EarnBadgeIcon />
              </div>
              <h3 className="font-display font-bold text-text-primary text-xl mb-2">
                For Agent Builders
              </h3>
              <div className="w-12 h-px bg-mint-secondary/30 mb-4" />
              <p className="text-text-secondary text-sm leading-relaxed mb-5">
                You build trading bots, yield strategists, or automated agents.
                Register with Aegis, earn badges, and take your verifiable track record anywhere on Sui.
              </p>
              <div className="space-y-2.5 flex-1 mb-7">
                {[
                  'Register in one transaction.',
                  'Every execution recorded onchain.',
                  'Earn Bronze → Silver → Gold badges.',
                  'Portable trust across all Sui protocols.',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-primary/10 border border-cyan-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-cyan-primary text-[8px] font-bold">✓</span>
                    </span>
                    <span className="text-text-secondary text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/developer"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border border-mint-secondary/30 bg-mint-secondary/[0.04] text-mint-secondary font-display font-bold text-sm hover:bg-mint-secondary/[0.08] transition-all w-fit"
              >
                Register Your Agent <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl glass-card-matte p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <p className="font-display font-bold text-text-primary mb-1">One integration. Full agent trust.</p>
              <p className="font-mono text-text-muted text-xs mt-1">
                {'const rep = await aegis.getReputation(agentAddress);'}
                <br />
                {'// → { badge: "gold", successRate: 96.8, isFlagged: false }'}
              </p>
            </div>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all whitespace-nowrap flex-shrink-0"
            >
              View Docs <ArrowRight size={14} />
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ═══════ AGENT LOOKUP ═══════ */}
      <section className="relative py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-[28px] overflow-hidden lookup-card">
              {/* Top glow line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-primary/30 to-transparent" />

              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-4 bg-cyan-primary/[0.08] border border-cyan-primary/20 shadow-glow-cyan">
                    <Search size={20} className="text-cyan-primary" />
                  </div>
                  <h2 className="font-display text-headline-md font-bold text-text-primary mb-2">
                    Check Agent Reputation
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Enter an agent address to check their onchain reputation score
                  </p>
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={agentAddress}
                    onChange={(e) => setAgentAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCheckReputation()}
                    className="flex-1 px-4 py-3 rounded-input bg-bg-base border border-[rgba(255,255,255,0.08)] shadow-neu-inset text-text-primary font-mono text-sm placeholder-text-muted focus:outline-none focus:border-cyan-primary/30 focus:ring-2 focus:ring-cyan-primary/10 transition-all"
                  />
                  <button
                    onClick={handleCheckReputation}
                    className="px-6 py-3 rounded-input bg-gradient-cyan-mint text-bg-base font-display font-semibold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-label-xs font-mono text-text-muted uppercase tracking-wider">Try demo agents:</span>
                  {[
                    { name: 'AlphaTrader', address: '0xfe3cb0c9dd9e147b860034ae9ec5591f10f6a35517e5d2bd6023a9aa86bd1a2a', type: 'success' },
                    { name: 'BetaBot', address: '0xf0f9bb84452f9e401383a80b25b36b7643d5ee2c548338ad9899f5f7105af8ed', type: 'info' },
                    { name: 'GammaScam', address: '0x32247adc0cb1a5aef74657c1be09f5b87d5effbc6b7ff7fd96fcc929d72377ca', type: 'danger' },
                  ].map((demo) => (
                    <button
                      key={demo.name}
                      onClick={() => { window.location.href = `/agent/${demo.address}`; }}
                      className={`px-3 py-1.5 rounded-[8px] font-mono text-xs font-medium transition-all border ${
                        demo.type === 'danger'
                          ? 'border-error/30 text-error hover:bg-error/10'
                          : 'border-[rgba(255,255,255,0.08)] text-text-secondary hover:border-cyan-primary/30 hover:text-cyan-primary hover:bg-cyan-primary/5'
                      }`}
                    >
                      {demo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ LIVE TICKER STRIP ═══════ */}
      <div className="relative overflow-hidden border-y border-[rgba(255,255,255,0.05)] bg-surface-0/60 backdrop-blur-sm">
        <div className="ticker-scroll py-3">
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 px-8 whitespace-nowrap">
                <Icon size={11} className="text-cyan-primary/50 shrink-0" />
                <span className="text-label-xs font-mono text-text-muted uppercase tracking-wider">{item.label}</span>
                <span className="text-label-xs font-mono text-text-secondary font-semibold">{item.value}</span>
                <span className="w-1 h-1 rounded-full bg-white/15 ml-2 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════ USE CASES ═══════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">
              Who Uses Aegis
            </span>
            <h2 className="font-display text-headline-md md:text-[36px] font-bold text-text-primary mb-3">
              One integration. Every use case.
            </h2>
            <p className="text-body-md text-text-secondary max-w-xl">
              Add Aegis once. Use agent trust data everywhere - wallets, DeFi, marketplaces, portfolios.
            </p>
          </motion.div>

          {/* Row 1: Use cases table + Why card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">

            {/* Who integrates Aegis - col-span-7 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 rounded-2xl glass-card-heavy overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-label-sm font-mono text-cyan-primary uppercase tracking-widest">Who Integrates Aegis</span>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.05)]">
                {[
                  { project: 'Wallets', usage: 'Verify agent trust before delegating funds' },
                  { project: 'DeFi Protocols', usage: 'Trust score for agent-driven trading' },
                  { project: 'AI Marketplaces', usage: 'Badges as proof of trust for listings' },
                  { project: 'Fund Managers', usage: 'Onchain audit of contracted agents' },
                  { project: 'Portfolio Trackers', usage: 'Real-time agent performance metrics' },
                ].map(({ project, usage }, i) => (
                  <motion.div
                    key={project}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-surface-1/40 transition-colors"
                  >
                    <span className="font-display font-semibold text-text-primary text-sm min-w-[140px]">{project}</span>
                    <span className="text-text-secondary text-sm">{usage}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Why build trust yourself - col-span-5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-5 rounded-2xl p-8 flex flex-col glass-card-matte"
            >
              <span className="text-label-sm font-mono text-mint-secondary uppercase tracking-widest mb-4 block">
                Why not build your own?
              </span>
              <div className="space-y-4 flex-1">
                {[
                  { val: 'Verifiable', label: 'onchain track record - no blind trust' },
                  { val: 'Portable', label: 'badges - earned, not assigned' },
                  { val: 'Walrus', label: 'audit trail - full transparency, zero overhead' },
                ].map(({ val, label }) => (
                  <div key={val} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint-secondary mt-2 flex-shrink-0" />
                    <p className="text-sm text-text-secondary leading-relaxed">
                      <strong className="text-text-primary">{val}</strong> {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-4">
                <p className="font-mono text-[11px] text-text-muted mb-2 uppercase tracking-wider">Instead of building your own scoring...</p>
                <div className="space-y-1.5">
                  {[
                    '✓  Badge type (Bronze / Silver / Gold)',
                    '✓  Uptime score  (onchain)',
                    '✓  Is flagged    (safety check)',
                    '✓  Total execs   (track record)',
                  ].map((line) => (
                    <p key={line} className="font-mono text-xs text-mint-secondary">{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 2: One integration, multiple use cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl glass-card-heavy p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 smart-money-glow pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-8">
                <span className="text-label-sm font-mono text-cyan-primary uppercase tracking-widest mb-5 block">
                  One Integration, Multiple Use Cases
                </span>
                <div className="px-6 py-3 rounded-[12px] bg-cyan-primary/[0.08] border border-cyan-primary/30 shadow-glow-cyan text-center">
                  <p className="text-cyan-primary font-bold text-sm">Aegis SDK</p>
                  <p className="text-text-muted text-[10px]">Single API</p>
                </div>
                <div className="flex items-center gap-1 mt-3 w-full max-w-xs">
                  <span className="text-cyan-primary/30">└──</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-primary/20 via-cyan-primary/10 to-cyan-primary/20" />
                  <span className="text-cyan-primary/30">──┘</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { IconC: WalletsIcon, label: 'Wallets', desc: 'Verify agent trust before fund delegation' },
                  { IconC: MarketplacesIcon, label: 'Marketplaces', desc: 'Display certified badges on listings' },
                  { IconC: DeFiIcon, label: 'DeFi', desc: 'Score agents for automated trading permissions' },
                  { IconC: PortfoliosIcon, label: 'Portfolios', desc: 'Track real-time agent performance' },
                ].map(({ IconC, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col items-center text-center p-5 rounded-xl bg-surface-1/60 border border-[rgba(255,255,255,0.06)] hover:border-cyan-primary/30 transition-colors"
                  >
                    <div className="mb-3 w-12 h-12 text-cyan-primary mx-auto">
                      <IconC />
                    </div>
                    <p className="font-display font-bold text-sm mb-1.5 text-cyan-primary">{label}</p>
                    <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-bg-base border border-cyan-primary/15 px-6 py-4 font-mono text-xs leading-relaxed">
                <span className="text-text-muted select-none mr-2">$</span>
                <span className="text-cyan-primary">{'const score = await aegis.getScore(agentAddress);'}</span>
                <br />
                <span className="text-text-muted">{'// → { badge: "Gold", uptime: 98.4, isFlagged: false }'}</span>
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href="/developer"
                  className="inline-flex items-center gap-2 text-cyan-primary hover:text-mint-secondary transition-all text-sm font-medium group"
                >
                  View Integration Docs
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none section-mint-ambient" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-mint-secondary/10 border border-mint-secondary/[0.15] text-mint-secondary text-label-xs font-mono uppercase tracking-wider mb-4">
              Simple by Design
            </span>
            <h2 className="font-display text-headline-md md:text-[36px] font-bold text-text-primary mb-3">
              How Aegis Works
            </h2>
            <p className="text-body-md text-text-secondary max-w-xl mx-auto">
              Three steps to bring verifiable trust to your AI agent on Sui.
            </p>
          </motion.div>

          <div ref={stepsRef} className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Animated connecting beam */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <motion.div
                className="h-full step-beam"
                initial={{ scaleX: 0 }}
                animate={stepsInView ? { scaleX: 1 } : { scaleX: 0 }}
                style={{ transformOrigin: 'left' }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
              />
            </div>

            {steps.map((step, i) => {
              const StepWireframe = [RegisterIcon, RecordIcon, EarnBadgeIcon][i];
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.35 }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto mb-6 w-[104px] h-[104px] flex items-center justify-center">
                    {/* SVG animated outer ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 104 104">
                      <motion.circle
                        cx="52" cy="52" r="50"
                        fill="none"
                        stroke="rgba(0,245,255,0.25)"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={stepsInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        transition={{ duration: 1.0, delay: 0.3 + i * 0.35, ease: 'easeOut' }}
                      />
                    </svg>
                    {/* Inner circle with icon */}
                    <motion.div
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-primary/[0.12] to-mint-secondary/[0.06] border border-cyan-primary/20 shadow-glow-cyan"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={stepsInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ duration: 0.45, delay: 0.5 + i * 0.35, type: 'spring', stiffness: 220, damping: 18 }}
                    >
                      <div className="w-9 h-9 text-cyan-primary">
                        <StepWireframe />
                      </div>
                    </motion.div>
                    {/* Number badge */}
                    <motion.span
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-bg-base text-[11px] bg-gradient-cyan-mint shadow-glow-cyan"
                      initial={{ scale: 0 }}
                      animate={stepsInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.35, delay: 0.75 + i * 0.35, type: 'spring', stiffness: 300 }}
                    >
                      {i + 1}
                    </motion.span>
                  </div>

                  <h3 className="font-display text-[18px] font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-[220px] mx-auto">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ SUPPORTED BY ═══════ */}
      <section className="relative py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <SupportedBy />
        </div>
      </section>

      <Footer />
    </main>
  );
}
