'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield, ArrowRight, XCircle, CheckCircle2, Wallet, ShoppingBag,
  Zap, BarChart2, Code2, Users, Award, TrendingUp, Lock, Cpu,
} from 'lucide-react';

const problems = [
  {
    icon: XCircle,
    title: 'Building trust infra costs you time & money',
    desc: 'You\'re building DeFi, wallets, or marketplaces — not reputation systems. Every hour spent on agent scoring is an hour not spent on your core product.',
    color: 'text-red-400',
    bg: 'bg-red-400/[0.06]',
    border: 'border-red-400/20',
    iconBg: 'bg-red-400/10',
  },
  {
    icon: XCircle,
    title: 'Fragmented reputation, no standard',
    desc: 'Every protocol builds its own trust system. Agents start from zero everywhere. Users have no way to verify an agent\'s track record across platforms.',
    color: 'text-red-400',
    bg: 'bg-red-400/[0.06]',
    border: 'border-red-400/20',
    iconBg: 'bg-red-400/10',
  },
  {
    icon: XCircle,
    title: 'Self-reported metrics are unreliable',
    desc: 'Agents can lie about success rates, volume, and slippage. Without on-chain verification, you\'re trusting claims instead of data.',
    color: 'text-red-400',
    bg: 'bg-red-400/[0.06]',
    border: 'border-red-400/20',
    iconBg: 'bg-red-400/10',
  },
];

const solutions = [
  {
    icon: Shield,
    title: 'Verifiable On-Chain Reputation',
    desc: 'Every execution, success rate, and badge is recorded on Sui. Immutable, transparent, and provable — no blind trust required.',
    color: 'text-cyan-primary',
    border: 'border-cyan-primary/20',
    bg: 'bg-cyan-primary/[0.06]',
  },
  {
    icon: CheckCircle2,
    title: 'One Integration, Zero Infrastructure',
    desc: 'No database to maintain, no scoring engine to build, no badge system to design. Add the Aegis SDK and get full agent trust in one call.',
    color: 'text-mint-secondary',
    border: 'border-mint-secondary/20',
    bg: 'bg-mint-secondary/[0.06]',
  },
  {
    icon: Award,
    title: 'Portable Badges, Cross-Protocol Trust',
    desc: 'Bronze, Silver, Gold badges follow agents everywhere. A Gold agent on DeepBook is a Gold agent on your protocol — verified, not claimed.',
    color: 'text-yellow-400',
    border: 'border-yellow-400/20',
    bg: 'bg-yellow-400/[0.06]',
  },
];

const stakeholders = [
  { icon: '🏦', project: 'Wallets', usage: 'Verify agent trust before delegating funds' },
  { icon: '⚡', project: 'DeFi Protocols', usage: 'Trust score for agent-driven trading permissions' },
  { icon: '🏪', project: 'AI Marketplaces', usage: 'Badges as proof of trust for agent listings' },
  { icon: '📊', project: 'Fund Managers', usage: 'On-chain audit of contracted agent performance' },
  { icon: '👛', project: 'Portfolio Trackers', usage: 'Real-time agent performance metrics for users' },
  { icon: '🔍', project: 'Audit Tools', usage: 'Full immutable audit trail on-chain' },
];

const useCases = [
  { Icon: Wallet, label: 'Wallets', desc: 'Verify agent trust before fund delegation. Show users exactly which agents are certified.', color: 'text-cyan-primary' },
  { Icon: ShoppingBag, label: 'Marketplaces', desc: 'Display verified badges on listings. Buyers instantly know which agents are trustworthy.', color: 'text-mint-secondary' },
  { Icon: Zap, label: 'DeFi', desc: 'Score agents for automated trading permissions. Only Gold-rated agents execute on your pools.', color: 'text-yellow-400' },
  { Icon: BarChart2, label: 'Portfolios', desc: 'Track real-time agent performance. Give users data-driven insights, not marketing claims.', color: 'text-purple-400' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function ForProtocolsPage() {
  const problemRef = useRef<HTMLDivElement>(null);
  const problemInView = useInView(problemRef, { once: true, margin: '-80px' });
  const solutionRef = useRef<HTMLDivElement>(null);
  const solutionInView = useInView(solutionRef, { once: true, margin: '-80px' });

  return (
    <main className="min-h-screen bg-bg-base">

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-500/[0.03] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-primary/[0.04] blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

        <motion.div
          className="relative z-20 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-red-400/10 border border-red-400/20 text-red-400 text-label-xs font-mono uppercase tracking-wider mb-6"
          >
            <XCircle size={12} />
            The Problem with Agent Trust
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[36px] md:text-[52px] font-bold text-text-primary mb-6 leading-tight"
          >
            Stop building reputation systems.{' '}
            <span className="gradient-text-cyan">Use ours.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-text-secondary text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            Every protocol that works with AI agents needs a way to verify who's trustworthy.
            Most build it themselves — and get it wrong.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-text-muted text-base max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Aegis is an on-chain reputation oracle. One API call gives you verified agent trust —
            no infrastructure, no custom scoring, no blind faith.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/developer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all"
            >
              Integrate in 5 Minutes
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-surface-1/20 backdrop-blur-sm text-text-primary font-display font-bold text-sm hover:bg-surface-1/40 transition-all"
            >
              Read the Docs
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section ref={problemRef} className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-red-400/10 border border-red-400/[0.15] text-red-400 text-label-xs font-mono uppercase tracking-wider mb-4">
              The Hard Truth
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-text-primary mb-3">
              Building trust infra isn&apos;t your job.
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              But right now, every protocol that integrates AI agents has to build it from scratch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {problems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={problemInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${item.border} ${item.bg}`}
                >
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-4 ${item.iconBg}`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-base mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ SOLUTION ═══════ */}
      <section ref={solutionRef} className="relative py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-cyan-primary/[0.03] blur-[150px]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-mint-secondary/10 border border-mint-secondary/[0.15] text-mint-secondary text-label-xs font-mono uppercase tracking-wider mb-4">
              The Solution
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-text-primary mb-3">
              Aegis: Trust Infrastructure for AI Agents
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              We did the hard work so you don&apos;t have to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {solutions.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${item.border} ${item.bg} hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center mb-4 ${item.bg}`}>
                    <Icon size={20} className={item.color} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-base mb-3">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl bg-bg-base border border-cyan-primary/20 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-cyan-primary/10 bg-cyan-primary/[0.04]">
                <Code2 size={14} className="text-cyan-primary" />
                <span className="font-mono text-xs text-cyan-primary">One API call. All the trust you need.</span>
              </div>
              <pre className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">{`const aegis = new AegisClient({ network: 'testnet' });

// This is all it takes:
const rep = await aegis.getReputation(agentAddress);

// rep.badge        → 'gold'   // Verifiable on-chain
// rep.successRate  → 96.8     // Real execution data
// rep.isFlagged    → false    // Safety check
// rep.totalExecs   → 847      // Track record

if (rep.badge === 'gold' && !rep.isFlagged) {
  // Now you know this agent is trustworthy
}`}</pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-8"
          >
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 text-cyan-primary hover:text-mint-secondary transition-colors text-sm font-medium group"
            >
              Full SDK Reference <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ WHO INTEGRATES ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">
              Who It&apos;s For
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] font-bold text-text-primary mb-3">
              Built for Protocols. Trusted by Wallets.
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              If your protocol touches AI agents, Aegis gives you verifiable trust out of the box.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl glass-card-heavy overflow-hidden"
          >
            <div className="grid grid-cols-12 px-6 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
              <span className="col-span-4 text-text-muted text-[11px] font-semibold uppercase tracking-wider">Who</span>
              <span className="col-span-8 text-text-muted text-[11px] font-semibold uppercase tracking-wider">How They Use Aegis</span>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.05)]">
              {stakeholders.map((item, i) => (
                <motion.div
                  key={item.project}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-12 px-6 py-4 hover:bg-surface-1/40 transition-colors items-center"
                >
                  <span className="col-span-4 flex items-center gap-3 font-display font-semibold text-text-primary text-sm">
                    <span className="text-lg">{item.icon}</span>
                    {item.project}
                  </span>
                  <span className="col-span-8 text-text-secondary text-sm">{item.usage}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ USE CASES ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-purple-400/10 border border-purple-400/[0.15] text-purple-400 text-label-xs font-mono uppercase tracking-wider mb-4">
              Use Cases
            </span>
            <h2 className="font-display text-[32px] md:text-[36px] font-bold text-text-primary mb-3">
              One Integration, Every Use Case
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              Add Aegis once. Use agent trust data everywhere in your app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map(({ Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl p-6 glass-card-matte hover:bg-surface-2/60 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`mb-4 p-3 rounded-xl border ${color} bg-${color}/10 inline-flex`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className={`font-display font-bold text-sm mb-2 ${color}`}>{label}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY AEGIS TABLE ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-yellow-400/10 border border-yellow-400/[0.15] text-yellow-400 text-label-xs font-mono uppercase tracking-wider mb-4">
              Why Aegis
            </span>
            <h2 className="font-display text-[32px] md:text-[36px] font-bold text-text-primary mb-3">
              Why Protocols Choose Aegis
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto">
              Over building their own trust system.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl glass-card-heavy overflow-hidden"
          >
            <div className="grid grid-cols-3 px-6 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
              {['', 'Building Your Own', 'Aegis'].map((h, i) => (
                <span key={i} className={`text-[11px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-text-muted' : i === 1 ? 'text-red-400' : 'text-mint-secondary'}`}>
                  {h}
                </span>
              ))}
            </div>
            {[
              { metric: 'Time to implement', self: '4-8 weeks', aegis: '30 minutes', good: true },
              { metric: 'On-chain verification', self: 'Requires custom contracts', aegis: 'Built-in ✓', good: true },
              { metric: 'Badge system', self: 'Design + mint + track', aegis: 'Auto-minted ✓', good: true },
              { metric: 'Cross-protocol portability', self: 'None - siloed', aegis: 'Portable badges ✓', good: true },
              { metric: 'Audit trail', self: 'You build it', aegis: 'Walrus storage ✓', good: true },
              { metric: 'Maintenance cost', self: 'Your team', aegis: 'Zero overhead ✓', good: true },
            ].map(({ metric, self, aegis, good }, i) => (
              <motion.div
                key={metric}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-3 px-6 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-surface-1/40 transition-colors items-center"
              >
                <span className="font-display font-semibold text-text-primary text-sm">{metric}</span>
                <span className="text-text-muted text-sm">{self}</span>
                <span className={`text-sm ${good ? 'text-mint-secondary' : 'text-red-400'}`}>{aegis}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl bg-gradient-to-r from-cyan-primary/[0.10] to-mint-secondary/[0.06] border border-cyan-primary/25 p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-cyan-primary/40 to-transparent" />

            <div className="relative z-10">
              <Shield size={36} className="text-cyan-primary mx-auto mb-4" />
              <h2 className="font-display text-[28px] md:text-[36px] font-bold text-text-primary mb-3">
                Stop building trust infra.{' '}
                <span className="gradient-text-cyan">Start integrating.</span>
              </h2>
              <p className="text-text-secondary text-sm max-w-lg mx-auto mb-8">
                One SDK call gives your protocol verified agent trust — on-chain, portable, and zero infrastructure.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/developer"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all"
                >
                  Start Integrating
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-[12px] border border-[rgba(255,255,255,0.12)] bg-surface-1/20 backdrop-blur-sm text-text-primary font-display font-bold text-sm hover:bg-surface-1/40 transition-all"
                >
                  Documentation
                </Link>
              </div>
              <p className="text-text-muted text-xs mt-6 font-mono">
                Sui testnet • No credit card • Open source
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
