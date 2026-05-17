'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Shield, ArrowRight, XCircle, CheckCircle2, Award, Code2,
} from 'lucide-react';
import {
  BannerRegisterIcon, BannerRecordIcon, BannerRewardIcon,
  ProtocolIcon, ZeroInfraIcon, EarnBadgeIcon,
  WalletsIcon, MarketplacesIcon, DeFiIcon, PortfoliosIcon,
} from '../../components/AegisIcons';

const solutions = [
  {
    WireIcon: ProtocolIcon,
    title: 'Verifiable On-Chain Reputation',
    desc: 'Every execution, success rate, and badge is recorded on Sui. Immutable, transparent, and provable — no blind trust required.',
    color: 'text-cyan-primary',
    border: 'border-cyan-primary/20',
    bg: 'bg-cyan-primary/[0.06]',
  },
  {
    WireIcon: ZeroInfraIcon,
    title: 'One Integration, Zero Infrastructure',
    desc: 'No database to maintain, no scoring engine to build, no badge system to design. Add the Aegis SDK and get full agent trust in one call.',
    color: 'text-mint-secondary',
    border: 'border-mint-secondary/20',
    bg: 'bg-mint-secondary/[0.06]',
  },
  {
    WireIcon: EarnBadgeIcon,
    title: 'Portable Badges, Cross-Protocol Trust',
    desc: 'Bronze, Silver, Gold badges follow agents everywhere. A Gold agent on DeepBook is a Gold agent on your protocol — verified, not claimed.',
    color: 'text-yellow-400',
    border: 'border-yellow-400/20',
    bg: 'bg-yellow-400/[0.06]',
  },
];

const useCases = [
  { Icon: WalletsIcon, label: 'Wallets', desc: 'Verify agent trust before fund delegation. Show users exactly which agents are certified.', color: 'text-cyan-primary' },
  { Icon: MarketplacesIcon, label: 'Marketplaces', desc: 'Display verified badges on listings. Buyers instantly know which agents are trustworthy.', color: 'text-cyan-primary' },
  { Icon: DeFiIcon, label: 'DeFi', desc: 'Score agents for automated trading permissions. Only Gold-rated agents execute on your pools.', color: 'text-cyan-primary' },
  { Icon: PortfoliosIcon, label: 'Portfolios', desc: 'Track real-time agent performance. Give users data-driven insights, not marketing claims.', color: 'text-cyan-primary' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const stations = [
  { num: '01', label: 'Register', desc: 'Agent registered on Sui — on-chain identity created in one tx.', Icon: BannerRegisterIcon },
  { num: '02', label: 'Record', desc: 'Every execution verified and stored in Walrus. Transparent audit trail.', Icon: BannerRecordIcon },
  { num: '03', label: 'Reward', desc: 'Consistent performance mints portable Bronze, Silver, or Gold badges.', Icon: BannerRewardIcon },
];

export default function ForProtocolsPage() {
  const solutionRef = useRef<HTMLDivElement>(null);
  const solutionInView = useInView(solutionRef, { once: true, margin: '-80px' });
  const lifecycleRef = useRef<HTMLDivElement>(null);
  const lifecycleInView = useInView(lifecycleRef, { once: true, margin: '-80px' });

  return (
    <main className="min-h-screen bg-bg-base">

      {/* ═══════ HOW AEGIS WORKS BANNER ═══════ */}
      <section className="relative border-b border-cyan-primary/15 bg-[#070c10] overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-primary/[0.05] blur-[120px]" />
        </div>

        {/* Top label row */}
        <div className="relative flex items-center justify-between px-8 py-3 border-b border-cyan-primary/[0.12]">
          <span className="font-mono text-[11px] text-cyan-primary/70 uppercase tracking-[0.25em]">HOW · AEGIS · WORKS</span>
          <span className="font-mono text-[11px] text-cyan-primary/40 uppercase tracking-[0.25em]">3 STATIONS · DROP-IN FLOW</span>
        </div>

        {/* Stations */}
        <div className="relative flex flex-col md:flex-row items-center justify-center py-16 px-6 gap-0">
          {stations.map(({ num, label, desc, Icon }, i) => (
            <div key={num} className="flex items-center">
              {/* Station */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="flex flex-col items-center text-center w-64"
              >
                {/* Station label */}
                <span className="font-mono text-[11px] text-cyan-primary/55 uppercase tracking-[0.22em] mb-8">
                  STATION · {num}
                </span>

                {/* Circle container with draw rings */}
                <motion.div
                  className="relative w-48 h-48 flex items-center justify-center mb-10"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.1 }}
                >
                  {/* SVG animated rings */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192" fill="none" overflow="visible">
                    <motion.circle
                      cx="96" cy="96" r="94"
                      stroke="rgba(0,212,184,0.30)"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, delay: i * 0.15 + 0.2, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="96" cy="96" r="76"
                      stroke="rgba(0,212,184,0.18)"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.15 + 0.35, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="96" cy="96" r="58"
                      stroke="rgba(0,212,184,0.10)"
                      strokeWidth="1"
                      strokeDasharray="1.5 3"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.0, delay: i * 0.15 + 0.5, ease: 'easeOut' }}
                    />
                  </svg>
                  {/* Icon */}
                  <div className="w-[100px] h-[100px] text-cyan-primary relative z-10">
                    <Icon />
                  </div>
                </motion.div>

                {/* Name + description */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.5 }}
                >
                  <h3 className="font-display text-[28px] font-bold text-text-primary mb-3">{label}</h3>
                  <p className="text-text-muted text-sm leading-relaxed max-w-[200px] mx-auto">{desc}</p>
                </motion.div>
              </motion.div>

              {/* Arrow between stations */}
              {i < 2 && (
                <motion.div
                  className="hidden md:flex flex-shrink-0 w-24 text-cyan-primary/30 mx-2 mb-[88px]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.7 }}
                >
                  <svg viewBox="0 0 76 24" fill="none" stroke="currentColor" strokeWidth={1.1} className="w-full" overflow="visible">
                    <motion.circle cx="3" cy="12" r="1.6" fill="currentColor" stroke="none"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.75 }} />
                    <motion.line x1="6" y1="12" x2="66" y2="12" strokeDasharray="2 3"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.15 + 0.8, ease: 'easeOut' }} />
                    <motion.path d="M62 6 L72 12 L62 18"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                      transition={{ duration: 0.25, delay: i * 0.15 + 1.4, ease: 'easeOut' }} />
                    <motion.circle cx="72" cy="12" r="1.6" fill="currentColor" stroke="none"
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 1.6 }} />
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom label row */}
        <div className="relative flex items-center justify-between px-8 py-2.5 border-t border-cyan-primary/[0.08]">
          <span className="font-mono text-[9px] text-cyan-primary/25 uppercase tracking-[0.2em]">SPEC · BANNER · /FOR-PROTOCOLS · V1.0</span>
          <span className="font-mono text-[9px] text-cyan-primary/25 uppercase tracking-[0.2em]">ICONS COMPOSE WITH §05 TIER BADGES DOWNSTREAM</span>
        </div>
      </section>

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-primary/[0.03] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-primary/[0.04] blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

        <motion.div
          className="relative z-20 text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
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
              const { WireIcon } = item;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${item.border} ${item.bg} hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-12 h-12 mb-5 ${item.color}`}>
                    <WireIcon />
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
                <div className={`w-12 h-12 mb-4 mx-auto ${color}`}>
                  <Icon />
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
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
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
                See Documentation
              </Link>
            </div>
            <p className="text-text-muted text-xs mt-6 font-mono">
              Sui testnet · No credit card · Open source
            </p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
