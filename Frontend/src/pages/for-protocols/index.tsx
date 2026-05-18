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
    desc: 'Every execution, success rate, and badge is recorded on Sui. Immutable, transparent, and provable - no blind trust required.',
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
    desc: 'Bronze, Silver, Gold badges follow agents everywhere. A Gold agent on DeepBook is a Gold agent on your protocol - verified, not claimed.',
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
  { num: '01', label: 'Register', desc: 'Agent registered on Sui - on-chain identity created in one tx.', Icon: BannerRegisterIcon },
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

      {/* ═══════ HOW AEGIS WORKS ═══════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-cyan-primary/[0.03] blur-[160px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start justify-center gap-0">
            {stations.map(({ num, label, desc, Icon }, i) => (
              <div key={num} className="flex items-center w-full md:w-auto">

                {/* Station card */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.18 }}
                  className="flex flex-col items-center flex-1 md:w-56"
                >
                  {/* STATION · 0X label */}
                  <p className="font-mono text-[10px] tracking-[0.28em] text-cyan-primary/60 uppercase mb-5">
                    STATION · {num}
                  </p>

                  {/* Circle + icon */}
                  <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center mb-7">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192" fill="none" overflow="visible">
                      <motion.circle
                        cx="96" cy="96" r="93"
                        stroke="rgba(0,212,184,0.28)"
                        strokeWidth="1.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.3, delay: i * 0.18 + 0.15, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="w-20 h-20 text-cyan-primary relative z-10">
                      <Icon />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3 text-center">
                    {label}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm leading-relaxed text-center max-w-[168px]">
                    {desc}
                  </p>
                </motion.div>

                {/* Arrow between stations */}
                {i < 2 && (
                  <motion.div
                    className="hidden md:flex flex-shrink-0 self-start mt-[88px] mx-2 text-cyan-primary/25"
                    style={{ width: '72px' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.18 + 0.6 }}
                  >
                    <svg viewBox="0 0 72 14" fill="none" stroke="currentColor" strokeWidth={0.9} className="w-full">
                      <motion.line
                        x1="0" y1="7" x2="58" y2="7"
                        strokeDasharray="3 4"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.18 + 0.75, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M54 2 L70 7 L54 12"
                        fill="none"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: i * 0.18 + 1.1, ease: 'easeOut' }}
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SOLUTION ═══════ */}
      <section ref={solutionRef} className="relative py-10 px-6">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-mint-secondary/10 border border-mint-secondary/[0.15] text-mint-secondary text-label-xs font-mono uppercase tracking-wider mb-3">
              The Solution
            </span>
            <h2 className="font-display text-[28px] md:text-[34px] font-bold text-text-primary mb-2">
              Aegis: Trust Infrastructure for AI Agents
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto">
              We did the hard work so you don&apos;t have to.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {solutions.map((item, i) => {
              const { WireIcon } = item;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`rounded-2xl p-5 border ${item.border} ${item.bg} hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-10 h-10 mb-3 ${item.color}`}>
                    <WireIcon />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-sm mb-2">{item.title}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <div className="rounded-xl bg-bg-base border border-cyan-primary/20 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-primary/10 bg-cyan-primary/[0.04]">
                <Code2 size={12} className="text-cyan-primary" />
                <span className="font-mono text-[10px] text-cyan-primary">One API call. All the trust you need.</span>
              </div>
              <pre className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">{`const rep = await aegis.getReputation(agentAddress);
// rep.badge → 'gold'  |  rep.successRate → 96.8
// rep.isFlagged → false  |  rep.totalExecs → 847

if (rep.badge === 'gold' && !rep.isFlagged) {
  // This agent is trustworthy
}`}</pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-6"
          >
            <Link
              href="/developer"
              className="inline-flex items-center gap-1.5 text-cyan-primary hover:text-mint-secondary transition-colors text-xs font-medium group"
            >
              Full SDK Reference <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ USE CASES ═══════ */}
      <section className="relative py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-purple-400/10 border border-purple-400/[0.15] text-purple-400 text-label-xs font-mono uppercase tracking-wider mb-3">
              Use Cases
            </span>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold text-text-primary mb-2">
              One Integration, Every Use Case
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto">
              Add Aegis once. Use agent trust data everywhere in your app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {useCases.map(({ Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className={`w-10 h-10 mb-3 mx-auto ${color}`}>
                  <Icon />
                </div>
                <h3 className={`font-display font-bold text-xs mb-1.5 ${color}`}>{label}</h3>
                <p className="text-text-muted text-[11px] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY AEGIS TABLE ═══════ */}
      <section className="relative py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-yellow-400/10 border border-yellow-400/[0.15] text-yellow-400 text-label-xs font-mono uppercase tracking-wider mb-3">
              Why Aegis
            </span>
            <h2 className="font-display text-[28px] md:text-[32px] font-bold text-text-primary mb-2">
              Why Protocols Choose Aegis
            </h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto">
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
      <section className="relative py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-2xl bg-gradient-to-r from-cyan-primary/[0.10] to-mint-secondary/[0.06] border border-cyan-primary/25 p-8 md:p-10 text-center relative overflow-hidden"
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
            <p className="text-text-muted text-xs mt-5 font-mono">
              Sui testnet · No credit card · Open source
            </p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
