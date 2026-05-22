'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, XCircle, CheckCircle2, TrendingUp, Users, Zap, Award, ArrowRight } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import AegisLogo from '@/components/AegisLogo';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative py-20 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-12">
      {sub && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-4">{sub}</span>}
      <h2 className="font-display text-[28px] md:text-[36px] font-bold text-text-primary leading-tight">{children}</h2>
    </div>
  );
}

export default function PitchPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-bg-base overflow-hidden">
      <ParticleBackground />
      <GlowOrbs />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none ambient-breathe" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

        <motion.div
          initial="hidden"
          animate={mounted ? 'visible' : 'hidden'}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          className="relative z-20 flex flex-col items-center text-center max-w-3xl"
        >
          <motion.div variants={fadeUp} className="w-32 h-32 mb-6" style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
            <AegisLogo className="w-full h-full" />
          </motion.div>

          <motion.div variants={fadeUp} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary text-label-sm font-mono uppercase tracking-wider">
              <Shield size={13} />
              Sui Overflow Hackathon 2026
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-[40px] md:text-[64px] font-black text-text-primary leading-none mb-4 tracking-tight">
            AEGIS
          </motion.h1>

          <motion.p variants={fadeUp} className="font-display text-xl md:text-2xl text-text-secondary mb-4">
            Verifiable Reputation for AI Agents on Sui
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 z-20"
        >
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest animate-pulse">Scroll</span>
        </motion.div>
      </section>

      {/* ═══════ THE PROBLEM ═══════ */}
      <Section>
        <SectionTitle sub="The Problem">Autonomous AI agents operate in DeFi without:</SectionTitle>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          {[
            { icon: XCircle, text: 'Verifiable on-chain reputation', color: 'text-error' },
            { icon: XCircle, text: 'Accountability for failures', color: 'text-error' },
            { icon: XCircle, text: 'Trust mechanisms for protocols', color: 'text-error' },
          ].map(({ icon: Icon, text, color }) => (
            <motion.div key={text} variants={fadeUp} className="glass-card-heavy rounded-2xl p-6 flex items-center gap-4">
              <Icon size={24} className={`${color} shrink-0`} />
              <span className="font-display font-semibold text-text-primary text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-error/[0.06] border border-error/20 p-6 text-center"
        >
          <p className="text-text-primary font-display font-bold text-lg">Result: Capital at risk, blind trust, irreversible losses</p>
        </motion.div>
      </Section>

      {/* ═══════ THE SOLUTION ═══════ */}
      <Section>
        <SectionTitle sub="The Solution: AEGIS">Aegis solves all four</SectionTitle>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {[
            { icon: CheckCircle2, text: 'Track on-chain performance (success rate, slippage, uptime)', color: 'text-mint-secondary' },
            { icon: CheckCircle2, text: 'Issue dynamic badges (Gold / Silver / Bronze)', color: 'text-mint-secondary' },
            { icon: CheckCircle2, text: 'Auto-revoke access in &lt;60s if thresholds breached', color: 'text-mint-secondary' },
            { icon: CheckCircle2, text: 'Enable protocols to verify before delegating capital', color: 'text-mint-secondary' },
          ].map(({ icon: Icon, text, color }) => (
            <motion.div key={text} variants={fadeUp} className="glass-card-heavy rounded-2xl p-6 flex items-start gap-4">
              <Icon size={22} className={`${color} shrink-0 mt-0.5`} />
              <span className="text-text-primary text-sm leading-relaxed">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl glass-card-matte p-6 text-center"
        >
          <p className="font-display text-lg text-cyan-primary font-bold">
            Think &ldquo;Credit Score for AI Agents&rdquo; — but on-chain
          </p>
        </motion.div>
      </Section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <Section>
        <SectionTitle sub="How It Works">Four-step flow</SectionTitle>
        <div className="space-y-5">
          {[
            { num: '1', text: 'Agent executes → Metrics tracked on-chain' },
            { num: '2', text: 'Aegis Score computed → Badge issued (Move contract)' },
            { num: '3', text: 'Protocol queries badge → Decision: Execute or Fallback' },
            { num: '4', text: 'Performance drops → Auto-revocation + event emitted' },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-5 glass-card-heavy rounded-2xl p-5"
            >
              <span className="w-10 h-10 rounded-full bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm flex items-center justify-center shrink-0 shadow-glow-cyan">
                {step.num}
              </span>
              <span className="text-text-primary text-sm font-display font-semibold">{step.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-5 rounded-xl bg-cyan-primary/[0.04] border border-cyan-primary/15 px-6 py-4 font-mono text-xs leading-relaxed"
        >
          <span className="text-text-muted">Tech: </span>
          <span className="text-cyan-primary">Move contracts</span>
          <span className="text-text-muted"> + </span>
          <span className="text-mint-secondary">TypeScript SDK</span>
          <span className="text-text-muted"> + </span>
          <span className="text-yellow-400">MemWal</span>
        </motion.div>
      </Section>

      {/* ═══════ CURRENT STATUS ═══════ */}
      <Section>
        <SectionTitle sub="Current Status">📊 Testnet Live</SectionTitle>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { value: '94,000+', label: 'executions tracked' },
            { value: '847+', label: 'badges issued' },
            { value: '3', label: 'demo agents running' },
            { value: '100%', label: 'uptime' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-heavy rounded-2xl p-6 text-center"
            >
              <p className="font-display text-3xl md:text-4xl font-black gradient-text-cyan mb-1">{stat.value}</p>
              <p className="text-text-muted font-mono text-xs uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-mint-secondary/10 border border-mint-secondary/20 text-mint-secondary font-mono text-xs uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-secondary" />
            </span>
            Live on Testnet
          </span>
          <p className="mt-3 font-mono text-xs text-text-muted">
            <span className="text-cyan-primary">🔗</span>{' '}
            <a href="https://aegisonchain.xyz" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:underline">
              aegisonchain.xyz
            </a>
          </p>
        </motion.div>
      </Section>

      {/* ═══════ ROADMAP ═══════ */}
      <Section>
        <SectionTitle sub="Roadmap">What&apos;s next</SectionTitle>

        <div className="space-y-4">
          {[
            { phase: 'Phase 1 (Now)', items: ['Testnet + Hackathon Submission ✓'], color: 'text-mint-secondary' },
            { phase: 'Phase 2 (Q3)', items: ['Dynamic leaderboard + Protocol SDK'], color: 'text-cyan-primary' },
            { phase: 'Phase 3 (Q4)', items: ['Mainnet + Governance DAO'], color: 'text-yellow-400' },
          ].map(({ phase, items, color }) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-heavy rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <span className={`font-display font-bold text-sm ${color} min-w-[160px]`}>{phase}</span>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-[8px] bg-bg-base border border-[rgba(255,255,255,0.08)] text-text-secondary text-xs font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center font-display text-sm text-text-secondary italic"
        >
          Vision: Default trust layer for AI x DeFi on Sui
        </motion.p>
      </Section>

      {/* ═══════ TEAM ═══════ */}
      <Section>
        <SectionTitle sub="Team">Who&apos;s building this</SectionTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card-heavy rounded-2xl p-8 text-center max-w-sm mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-cyan-mint flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
            <span className="font-display font-black text-bg-base text-xl">E</span>
          </div>
          <p className="font-display font-bold text-text-primary text-lg">Ed (@EdCriptoFi)</p>
          <p className="text-text-muted text-sm font-mono mb-4">Founder / Builder</p>
          <p className="text-text-secondary text-sm">Building verifiable autonomy for AI agents on Sui</p>
        </motion.div>
      </Section>

      {/* ═══════ LET'S BUILD TOGETHER ═══════ */}
      <section className="relative py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[36px] md:text-[52px] font-black text-text-primary mb-4 tracking-tight">
              LET&apos;S BUILD
              <br />
              <span className="gradient-text-cyan">TOGETHER</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mt-10 mb-10">
              {[
                { emoji: '🔗', label: 'Demo', href: 'https://aegisonchain.xyz' },
                { emoji: '📚', label: 'Docs', href: 'https://aegisonchain.xyz/docs' },
                { emoji: '💻', label: 'Code', href: 'https://github.com/EdCryptoFi/aegis' },
                { emoji: '🐦', label: 'Updates', href: 'https://x.com/aegisonchain' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[14px] border border-cyan-primary/25 bg-cyan-primary/[0.05] text-text-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.12] hover:border-cyan-primary/50 hover:shadow-glow-cyan hover:scale-[1.04] transition-all"
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span>{link.label}</span>
                  <span className="text-cyan-primary/30 group-hover:text-cyan-primary/60 transition-colors text-[10px] font-mono ml-1">
                    {link.href.replace('https://', '')}
                  </span>
                </a>
              ))}
            </div>

            <p className="font-display text-xl text-text-secondary">
              Feedback welcome! <span className="inline-block hover:scale-125 transition-transform">🙏</span>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
