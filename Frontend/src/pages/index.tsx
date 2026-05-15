'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Code2,
  Vote,
  Activity,
  ArrowRight,
  Search,
  Users,
  Award,
  Zap,
  TrendingUp,
  Lock,
  ChevronRight,
  Cpu,
  Globe,
  BarChart2,
} from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import Footer from '@/components/Footer';

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
  { label: 'Agents Tracked', sublabel: 'Registered on Sui', value: 1247, prefix: '', suffix: '+', icon: Users, delta: '+12.4%', positive: true },
  { label: 'Avg Success Rate', sublabel: 'All agents avg.', value: 98, prefix: '', suffix: '.7%', icon: TrendingUp, delta: '+0.3%', positive: true },
  { label: 'Volume Protected', sublabel: 'Cumulative SUI', value: 2, prefix: '$', suffix: '.4M', icon: Lock, delta: '+18.2%', positive: true },
];

const tickerItems = [
  { label: 'AGENTS TRACKED', value: '1,247+', icon: Users },
  { label: 'SUCCESS RATE', value: '98.7%', icon: TrendingUp },
  { label: 'VOLUME PROTECTED', value: '$2.4M', icon: Lock },
  { label: 'NETWORK', value: 'SUI TESTNET', icon: Globe },
  { label: 'UPTIME', value: '99.9%', icon: Activity },
  { label: 'BADGES ISSUED', value: '847', icon: Award },
  { label: 'EXECUTIONS', value: '94,231', icon: Zap },
  { label: 'ACTIVE CONTRACTS', value: '3', icon: Cpu },
];

const steps = [
  {
    title: 'Register Your Agent',
    description: 'Deploy your AI agent and register it on the Aegis smart contract on Sui.',
    icon: Cpu,
  },
  {
    title: 'Record On-Chain Actions',
    description: 'Every execution is verified and scored in real-time against performance thresholds.',
    icon: BarChart2,
  },
  {
    title: 'Earn Trust Badges',
    description: 'Consistent performance automatically unlocks Bronze, Silver, and Gold reputation badges.',
    icon: Award,
  },
];

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
          className="relative z-20 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Live tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary text-label-sm font-mono uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-secondary" />
              </span>
              <Shield size={13} />
              The Institutional Liquidity Hub
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-display-lg-mobile md:text-display-lg text-text-primary mb-6 leading-tight"
          >
            Secure Analytics for the{' '}
            <span className="gradient-text-cyan">Next Frontier</span>{' '}
            of Finance
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-10"
          >
            Harness real-time on-chain signals, institutional-grade risk monitoring, and automated
            smart money tracking in a single, high-performance dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/agents"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all"
            >
              Launch Terminal
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-surface-1/20 backdrop-blur-sm text-text-primary font-display font-bold text-sm hover:bg-surface-1/40 transition-all"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Floating stat cards */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
                    whileHover={{ y: -10, transition: { duration: 0.25 } }}
                    className="rounded-xl overflow-hidden cursor-default glass-card-heavy"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-surface-2/60 flex items-center justify-center">
                            <Icon size={16} className="text-cyan-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-display font-semibold text-text-primary leading-tight">{stat.label}</p>
                            <p className="text-[10px] font-mono text-text-muted">{stat.sublabel}</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${stat.positive ? 'text-mint-secondary bg-mint-secondary/10' : 'text-error bg-error/10'}`}>
                          {stat.delta}
                        </span>
                      </div>
                      <p className="text-2xl font-display font-bold text-text-primary">
                        <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                      </p>
                    </div>
                    {/* Sparkline bar */}
                    <div className="h-14 w-full sparkline-bar" />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
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

      {/* ═══════ ON-CHAIN ECOSYSTEM ═══════ */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">
              Deep Integration
            </span>
            <h2 className="font-display text-headline-md md:text-[36px] font-bold text-text-primary mb-3">
              On-Chain Ecosystem
            </h2>
            <p className="text-body-md text-text-secondary max-w-xl">
              Deep integration with major L1s and L2s, providing unparalleled visibility into capital movement.
            </p>
          </motion.div>

          {/* Bento grid — 12-col, 8/4 alternating */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

            {/* Smart Money Flow — col-span-8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-8 rounded-2xl p-8 relative overflow-hidden group glass-card-heavy"
            >
              <div className="relative z-10">
                <span className="text-label-sm font-mono text-cyan-primary mb-4 block uppercase tracking-widest">
                  Institutional Analytics
                </span>
                <h3 className="font-display text-headline-md font-semibold text-text-primary mb-4">
                  Smart Money Flow Detection
                </h3>
                <p className="text-text-secondary max-w-md text-sm leading-relaxed">
                  Track wallet clusters with high win rates and historical alpha performance. Our proprietary algorithms filter noise from real signal.
                </p>
                <Link
                  href="/agents"
                  className="mt-8 inline-flex items-center gap-2 text-cyan-primary hover:gap-4 transition-all text-sm font-medium"
                >
                  View Intelligence Dashboard
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 smart-money-glow" />
              {/* Mini chart SVG */}
              <div className="absolute bottom-4 right-8 opacity-10">
                <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                  <polyline points="0,60 20,40 40,50 60,20 80,35 100,10 120,25" stroke="#00F5FF" strokeWidth="2" fill="none" />
                  <polyline points="0,60 20,40 40,50 60,20 80,35 100,10 120,25" stroke="#00F5FF" strokeWidth="8" fill="none" strokeOpacity="0.15" />
                </svg>
              </div>
            </motion.div>

            {/* Developer SDK — col-span-4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="md:col-span-4 rounded-2xl p-8 flex flex-col glass-card-matte hover:bg-surface-2/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-6 bg-cyan-primary/[0.08] border border-cyan-primary/20">
                <Code2 size={20} className="text-cyan-primary" />
              </div>
              <h3 className="font-display text-headline-md font-semibold text-text-primary mb-4">Developer SDK</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                Stream live on-chain events directly into your trading bots or dApps with &lt;50ms latency.
              </p>
              <Link href="/developer" className="mt-6 inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors">
                Explore SDK <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* DAO Voting — col-span-4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="md:col-span-4 rounded-2xl p-8 flex flex-col glass-card-matte hover:bg-surface-2/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-6 bg-purple-tertiary/[0.08] border border-purple-tertiary/20">
                <Vote size={20} className="text-purple-dim" />
              </div>
              <h3 className="font-display text-headline-md font-semibold text-text-primary mb-4">DAO Voting</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                Monitor proposal sentiment and voter participation across the Aegis ecosystem.
              </p>
              <Link href="/badges" className="mt-6 inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors">
                View Governance <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* Real-Time Threat Monitoring — col-span-8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-8 rounded-2xl p-8 relative overflow-hidden glass-card-heavy"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="text-label-sm font-mono text-cyan-primary mb-4 block uppercase tracking-widest">
                    Risk Management
                  </span>
                  <h3 className="font-display text-headline-md font-semibold text-text-primary mb-4">
                    Real-Time Threat Monitoring
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Active defense against rug pulls, reentrancy risks, and malicious contract patterns across 50+ chains.
                  </p>
                  <div className="flex gap-4 mt-6">
                    <div className="px-4 py-2.5 rounded-[10px] bg-white/5 border border-[rgba(255,255,255,0.08)]">
                      <p className="text-cyan-primary font-bold text-lg font-display">2.4k+</p>
                      <p className="text-[10px] uppercase text-text-muted font-mono tracking-wider">Protocols Tracked</p>
                    </div>
                    <div className="px-4 py-2.5 rounded-[10px] bg-white/5 border border-[rgba(255,255,255,0.08)]">
                      <p className="text-mint-secondary font-bold text-lg font-display">0ms</p>
                      <p className="text-[10px] uppercase text-text-muted font-mono tracking-wider">Downtime</p>
                    </div>
                  </div>
                </div>
                {/* Shield visual */}
                <div className="shrink-0 w-40 h-36 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-primary/[0.08] to-transparent border border-cyan-primary/[0.15]">
                  <Shield size={56} className="text-cyan-primary opacity-40" />
                </div>
              </div>
              <Link href="/architecture" className="mt-6 inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors">
                View Architecture <ArrowRight size={13} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none section-mint-ambient" />

        <div className="max-w-7xl mx-auto relative">
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

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connecting beam */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-px step-beam opacity-60" />

            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative mx-auto mb-6 w-[104px] h-[104px] flex items-center justify-center">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full step-ring-outer" />
                    {/* Inner circle */}
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-primary/[0.12] to-mint-secondary/[0.06] border border-cyan-primary/20 shadow-glow-cyan">
                      <StepIcon size={24} className="text-cyan-primary" />
                    </div>
                    {/* Number badge */}
                    <span className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-bg-base text-[11px] bg-gradient-cyan-mint shadow-glow-cyan">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-[18px] font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-[220px] mx-auto">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ AGENT LOOKUP ═══════ */}
      <section className="relative py-24 px-6">
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
                    Enter an agent address to check their on-chain reputation score
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
                    { name: 'AlphaTrader', address: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', type: 'success' },
                    { name: 'BetaBot', address: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', type: 'info' },
                    { name: 'GammaScam', address: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', type: 'danger' },
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

      {/* ═══════ CTA ═══════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none cta-portal-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none border border-cyan-primary/[0.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none border border-cyan-primary/[0.08]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-6">
              Get Started Today
            </span>
            <h2 className="font-display text-[28px] md:text-[40px] font-bold text-text-primary mb-4 leading-tight">
              Ready to upgrade your{' '}
              <span className="gradient-text-cyan">on-chain intelligence?</span>
            </h2>
            <p className="text-body-md text-text-secondary mb-10 max-w-xl mx-auto">
              Join 50,000+ traders and institutional investors who rely on Aegis for their daily edge.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/agents"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-pill bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all"
              >
                Get Access
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/developer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-pill border border-[rgba(255,255,255,0.1)] text-text-primary font-display font-semibold text-sm hover:border-cyan-primary/30 hover:bg-surface-1/50 transition-all"
              >
                Developer Docs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
