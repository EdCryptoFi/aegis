'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield,
  Eye,
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
  CheckCircle,
  Cpu,
  Globe,
  BarChart2,
} from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import GlowCard from '@/components/GlowCard';
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

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── Feature data ─── */
const features = [
  {
    icon: Eye,
    label: 'Institutional Money',
    sublabel: 'Analytics',
    title: 'Smart Money Flow Detection',
    description: 'Track wallet clusters with high win rates and historical alpha performance. Our proprietary algorithms filter noise from real signal.',
    link: '/agents',
    linkText: 'View Intelligence Dashboard',
    color: 'cyan',
  },
  {
    icon: Code2,
    label: 'Developer SDK',
    sublabel: '',
    title: 'Developer SDK',
    description: 'Stream live on-chain events directly into your trading bots or dApps with <50ms latency.',
    link: '/developer',
    linkText: 'Explore SDK',
    color: 'mint',
  },
  {
    icon: Vote,
    label: 'DAO Voting',
    sublabel: '',
    title: 'DAO Voting',
    description: 'Monitor proposal sentiment and voter participation across the Aegis ecosystem.',
    link: '/badges',
    linkText: 'View Governance',
    color: 'purple',
  },
  {
    icon: Activity,
    label: 'Risk Management',
    sublabel: '',
    title: 'Real-Time Threat Monitoring',
    description: 'Active defense against rug pulls, reentrancy risks, and malicious contract patterns across 50+ chains.',
    link: '/architecture',
    linkText: 'View Architecture',
    color: 'cyan',
  },
];

const stats = [
  { label: 'Agents Tracked', value: 1247, prefix: '', suffix: '+', icon: Users },
  { label: 'Avg Success Rate', value: 98, prefix: '', suffix: '.7%', icon: TrendingUp },
  { label: 'Volume Protected', value: 2, prefix: '$', suffix: '.4M', icon: Lock },
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
    number: '01',
    title: 'Register Your Agent',
    description: 'Deploy your AI agent and register it on the Aegis smart contract on Sui.',
    icon: Cpu,
  },
  {
    number: '02',
    title: 'Record On-Chain Actions',
    description: 'Every execution is verified and scored in real-time against performance thresholds.',
    icon: BarChart2,
  },
  {
    number: '03',
    title: 'Earn Trust Badges',
    description: 'Consistent performance automatically unlocks Bronze, Silver, and Gold reputation badges.',
    icon: Award,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
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
        {/* Background layers */}
        <ParticleBackground />
        <GlowOrbs />

        {/* Ambient breathing overlay */}
        <div
          className="absolute inset-0 pointer-events-none ambient-breathe"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,245,255,0.05) 0%, rgba(112,0,255,0.03) 50%, transparent 70%)',
          }}
        />

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

        {/* Content */}
        <motion.div
          className="relative z-20 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Tag with live dot */}
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
            <span className="gradient-text-cyan">
              Next Frontier
            </span>{' '}
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
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-gradient-cyan-mint text-bg-base font-display font-semibold text-sm transition-all hover:shadow-glow-cyan-intense hover:scale-[1.03]"
            >
              Launch Terminal
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill border border-[rgba(255,255,255,0.1)] text-text-primary font-display font-semibold text-sm hover:border-cyan-primary/30 hover:bg-surface-1/50 transition-all"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Floating stats cards — staggered float animation */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} variants={itemVariants}>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.7,
                    }}
                    whileHover={{
                      y: -14,
                      boxShadow: '0 16px 40px rgba(0, 245, 255, 0.18), 0 0 1px rgba(0, 245, 255, 0.4)',
                      borderColor: 'rgba(0,245,255,0.25)',
                      transition: { duration: 0.3 },
                    }}
                    className="bg-surface-1/70 backdrop-blur-md border border-[rgba(255,255,255,0.08)] rounded-[20px] px-5 py-4 text-center cursor-default"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' }}
                  >
                    <Icon size={18} className="mx-auto mb-2 text-cyan-primary opacity-70" />
                    <p className="text-xl font-display font-bold text-text-primary">
                      <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    </p>
                    <p className="text-label-xs font-mono text-text-muted uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
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
                <span className="text-label-xs font-mono text-text-muted uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-label-xs font-mono text-text-secondary font-semibold">
                  {item.value}
                </span>
                <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.15)] ml-2 shrink-0" />
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/15 text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">
              Deep Integration
            </span>
            <h2 className="font-display text-headline-md md:text-[36px] font-bold text-text-primary mb-3">
              On-Chain Ecosystem
            </h2>
            <p className="text-body-md text-text-secondary max-w-xl">
              Deep integration with major L1s and L2s, providing unparalleled visibility into capital movement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              const accent =
                feature.color === 'cyan'
                  ? { bg: 'rgba(0,245,255,0.08)', border: 'rgba(0,245,255,0.2)', icon: 'text-cyan-primary', bar: 'from-cyan-primary/40 to-transparent' }
                  : feature.color === 'mint'
                  ? { bg: 'rgba(0,255,167,0.08)', border: 'rgba(0,255,167,0.2)', icon: 'text-mint-secondary', bar: 'from-mint-secondary/40 to-transparent' }
                  : { bg: 'rgba(112,0,255,0.08)', border: 'rgba(112,0,255,0.2)', icon: 'text-purple-dim', bar: 'from-purple-dim/30 to-transparent' };

              return (
                <GlowCard key={feature.title} delay={i * 0.08} className="flex flex-col justify-between group">
                  {/* Top accent line */}
                  <div className={`h-px w-16 bg-gradient-to-r ${accent.bar} mb-5 rounded-full`} />

                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      {/* Icon container with glow */}
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                      >
                        <Icon size={18} className={accent.icon} />
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-cyan-primary/10 text-label-xs font-mono text-cyan-primary uppercase tracking-wider">
                          {feature.label}
                        </span>
                        {feature.sublabel && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-mint-secondary/10 text-label-xs font-mono text-mint-secondary uppercase tracking-wider">
                            {feature.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    <Link
                      href={feature.link}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-primary hover:text-mint-secondary transition-colors group/link"
                    >
                      {feature.linkText}
                      <ArrowRight size={13} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    <CheckCircle size={14} className="text-text-muted opacity-40" />
                  </div>
                </GlowCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="relative py-24 px-6">
        {/* Section ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,255,167,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-mint-secondary/10 border border-mint-secondary/15 text-mint-secondary text-label-xs font-mono uppercase tracking-wider mb-4">
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
            {/* Connecting beam — desktop only */}
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
                  {/* Circle icon */}
                  <div className="relative mx-auto mb-6 w-[104px] h-[104px] flex items-center justify-center">
                    {/* Outer ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)',
                        border: '1px solid rgba(0,245,255,0.12)',
                      }}
                    />
                    {/* Inner circle */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.12), rgba(0,255,167,0.06))',
                        border: '1px solid rgba(0,245,255,0.2)',
                        boxShadow: '0 0 24px rgba(0,245,255,0.12)',
                      }}
                    >
                      <StepIcon size={24} className="text-cyan-primary" />
                    </div>
                    {/* Number badge */}
                    <span
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center font-display font-bold text-bg-base"
                      style={{
                        background: 'linear-gradient(135deg, #00F5FF, #00FFA7)',
                        fontSize: '11px',
                        boxShadow: '0 2px 8px rgba(0,245,255,0.3)',
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-[18px] font-semibold text-text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-[220px] mx-auto">
                    {step.description}
                  </p>
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
            {/* Glassmorphism card */}
            <div
              className="relative rounded-[28px] overflow-hidden"
              style={{
                background: 'rgba(22, 27, 30, 0.75)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.5)',
              }}
            >
              {/* Inner glow top */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)' }}
              />

              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-4"
                    style={{
                      background: 'rgba(0,245,255,0.08)',
                      border: '1px solid rgba(0,245,255,0.2)',
                      boxShadow: '0 0 20px rgba(0,245,255,0.1)',
                    }}
                  >
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
                    className="flex-1 px-4 py-3 rounded-input text-text-primary font-mono text-sm placeholder-text-muted focus:outline-none focus:border-cyan-primary/30 focus:ring-2 focus:ring-cyan-primary/10 transition-all"
                    style={{
                      background: '#0c0f11',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.02)',
                    }}
                  />
                  <button
                    onClick={handleCheckReputation}
                    className="px-6 py-3 rounded-input font-display font-semibold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all whitespace-nowrap text-bg-base"
                    style={{ background: 'linear-gradient(135deg, #00F5FF, #00FFA7)' }}
                  >
                    Check
                  </button>
                </div>

                {/* Demo agents */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="text-label-xs font-mono text-text-muted uppercase tracking-wider">
                    Try demo agents:
                  </span>
                  {[
                    { name: 'AlphaTrader', address: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', type: 'success' },
                    { name: 'BetaBot', address: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', type: 'info' },
                    { name: 'GammaScam', address: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', type: 'danger' },
                  ].map((demo) => (
                    <button
                      key={demo.name}
                      onClick={() => { window.location.href = `/agent/${demo.address}`; }}
                      className={`
                        px-3 py-1.5 rounded-[8px] font-mono text-xs font-medium transition-all
                        border
                        ${
                          demo.type === 'danger'
                            ? 'border-error/30 text-error hover:bg-error/10'
                            : 'border-[rgba(255,255,255,0.08)] text-text-secondary hover:border-cyan-primary/30 hover:text-cyan-primary hover:bg-cyan-primary/5'
                        }
                      `}
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
        {/* Radial portal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,245,255,0.07) 0%, rgba(112,0,255,0.05) 40%, transparent 70%)',
          }}
        />
        {/* Ring accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(0,245,255,0.06)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(0,245,255,0.08)',
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/15 text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-6">
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
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-pill font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all text-bg-base"
                style={{ background: 'linear-gradient(135deg, #00F5FF, #00FFA7)' }}
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

      {/* ═══════ FOOTER ═══════ */}
      <Footer />
    </main>
  );
}
