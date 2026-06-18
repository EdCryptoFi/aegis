'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Shield, XCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), { ssr: false });

const AEGIS_FLOW = `flowchart TD
    A([🤖 AI Agent]) --> B[register_agent]
    B --> C[(ReputationObject\\non-chain)]
    C --> D[record_execution\\nsuccess · volume · slippage]
    D -->|assert sender == agent_id| D
    D --> C
    C --> E{auto_check}
    E -->|executions ≥ 10 · success ≥ 80%| F[🥉 Bronze]
    E -->|executions ≥ 50 · success ≥ 90%| G[🥈 Silver]
    E -->|executions ≥ 200 · success ≥ 95% · vol ≥ 1M SUI| H[🥇 Gold]
    E -->|not eligible| I[❌ No badge]
    F & G & H --> J[(BadgeRegistry\\nshared object)]
    J --> K{check_and_revoke\\nAdminCap required}
    K -->|metrics drop| L[🚫 Revoked]
    K -->|metrics ok| M[✅ Kept]
    C --> N[update_walrus_blob_id\\nassert sender == agent_id]
    N --> O[(Walrus Storage\\npersistent memory)]
    J & O & C --> P[🌐 aegisonchain.xyz]
    P --> Q[TypeScript SDK]
    Q --> A`;
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import AegisLogo from '@/components/AegisLogo';
import Footer from '@/components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function Divider() {
  return <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-primary/15 to-transparent" />;
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="py-12 px-6"><div className="max-w-4xl mx-auto">{children}</div></section>;
}

export default function PitchPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-bg-base overflow-hidden">
      <ParticleBackground />
      <GlowOrbs />

      {/* HERO */}
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

          <motion.p variants={fadeUp} className="font-display text-xl md:text-2xl text-text-secondary">
            Verifiable Reputation for AI Agents on Sui
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 z-20"
        >
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest animate-pulse">Scroll</span>
        </motion.div>
      </section>

      <Divider />

      {/* PROBLEM */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">The Problem</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">Autonomous AI agents operate in DeFi without:</h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5"
        >
          {[
            { icon: XCircle, text: 'Verifiable on-chain reputation', color: 'text-error' },
            { icon: XCircle, text: 'Accountability for failures', color: 'text-error' },
            { icon: XCircle, text: 'Trust mechanisms for protocols', color: 'text-error' },
          ].map(({ icon: Icon, text, color }) => (
            <motion.div key={text} variants={fadeUp} className="glass-card-heavy rounded-2xl p-5 flex items-center gap-3">
              <Icon size={22} className={`${color} shrink-0`} />
              <span className="font-display font-semibold text-text-primary text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-error/[0.06] border border-error/20 p-5 text-center"
        >
          <p className="text-text-primary font-display font-bold">Result: Capital at risk, blind trust, irreversible losses</p>
        </motion.div>
      </Section>

      <Divider />

      {/* SOLUTION */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">The Solution: AEGIS</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">Think "Credit Score for AI Agents" — but on-chain</h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { text: 'Track on-chain performance (success rate, slippage, uptime)' },
            { text: 'Issue dynamic badges (Gold / Silver / Bronze)' },
            { text: 'Auto-revoke access in &lt;60s if thresholds breached' },
            { text: 'Enable protocols to verify before delegating capital' },
          ].map(({ text }) => (
            <motion.div key={text} variants={fadeUp} className="glass-card-heavy rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-mint-secondary shrink-0 mt-0.5" />
              <span className="text-text-primary text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Divider />

      {/* HOW IT WORKS */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">How It Works</span>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { num: '1', text: 'Agent executes → Metrics tracked on-chain' },
            { num: '2', text: 'Aegis Score computed → Badge issued (Move contract)' },
            { num: '3', text: 'Protocol queries badge → Decision: Execute or Fallback' },
            { num: '4', text: 'Performance drops → Auto-revocation + event emitted' },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 glass-card-heavy rounded-2xl p-4"
            >
              <span className="w-9 h-9 rounded-full bg-gradient-cyan-mint text-bg-base font-display font-bold text-xs flex items-center justify-center shrink-0 shadow-glow-cyan">
                {step.num}
              </span>
              <span className="text-text-primary text-sm font-display font-semibold">{step.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl bg-cyan-primary/[0.04] border border-cyan-primary/15 px-5 py-3 font-mono text-xs text-center">
          <span className="text-text-muted">Tech: </span>
          <span className="text-cyan-primary">Move contracts</span>
          <span className="text-text-muted"> + </span>
          <span className="text-mint-secondary">TypeScript SDK</span>
          <span className="text-text-muted"> + </span>
          <span className="text-yellow-400">MemWal</span>
        </div>
      </Section>

      <Divider />

      {/* ARCHITECTURE FLOW */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">System Architecture</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">Full On-Chain Flow</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-heavy rounded-2xl p-6 overflow-hidden"
        >
          <MermaidDiagram chart={AEGIS_FLOW} />
        </motion.div>
      </Section>

      <Divider />

      {/* STATUS */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">Current Status</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">Testnet Live</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { value: '94,000+', label: 'executions tracked' },
            { value: '847+', label: 'badges issued' },
            { value: '3', label: 'demo agents' },
            { value: '100%', label: 'uptime' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-heavy rounded-2xl p-5 text-center"
            >
              <p className="font-display text-2xl md:text-3xl font-black gradient-text-cyan mb-1">{stat.value}</p>
              <p className="text-text-muted font-mono text-[10px] uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-mint-secondary/10 border border-mint-secondary/20 text-mint-secondary font-mono text-xs uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint-secondary" />
            </span>
            Live on Testnet
          </span>
          <p className="mt-2 font-mono text-xs text-text-muted">
            <span className="text-cyan-primary">🔗</span>{' '}
            <a href="https://aegisonchain.xyz" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:underline">aegisonchain.xyz</a>
          </p>
        </div>
      </Section>

      <Divider />

      {/* ROADMAP */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">Roadmap</span>
        </div>

        <div className="space-y-3 mb-4">
          {[
            { phase: 'Phase 1 (Now)', items: ['Testnet + Hackathon Submission ✓'], color: 'text-mint-secondary' },
            { phase: 'Phase 2 (Q3)', items: ['Dynamic leaderboard + Protocol SDK'], color: 'text-cyan-primary' },
            { phase: 'Phase 3 (Q4)', items: ['Mainnet + Governance DAO'], color: 'text-yellow-400' },
          ].map(({ phase, items, color }) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-heavy rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <span className={`font-display font-bold text-sm ${color} min-w-[160px]`}>{phase}</span>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-[8px] bg-bg-base border border-[rgba(255,255,255,0.08)] text-text-secondary text-xs font-mono">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center font-display text-sm text-text-secondary italic">
          Vision: Default trust layer for AI x DeFi on Sui
        </p>
      </Section>

      <Divider />

      {/* TEAM */}
      <Section>
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider mb-3">Team</span>
        </div>

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
          <p className="text-text-muted text-sm font-mono mb-1">Founder / Builder</p>
          <p className="text-text-secondary text-sm mb-4">Building verifiable autonomy for AI agents on Sui</p>
          <a
            href="https://x.com/EdCriptoFi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-cyan-primary/20 bg-cyan-primary/[0.04] text-cyan-primary font-mono text-xs hover:bg-cyan-primary/[0.1] hover:border-cyan-primary/40 hover:shadow-glow-cyan transition-all"
          >
            <TrendingUp size={13} />
            @EdCriptoFi
          </a>
        </motion.div>
      </Section>

      <Divider />

      {/* LET'S BUILD TOGETHER */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[32px] md:text-[48px] font-black text-text-primary mb-3 tracking-tight">
              LET&apos;S BUILD <span className="gradient-text-cyan">TOGETHER</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-3 my-8">
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
                  className="group inline-flex items-center gap-2.5 px-5 py-3 rounded-[14px] border border-cyan-primary/25 bg-cyan-primary/[0.05] text-text-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.12] hover:border-cyan-primary/50 hover:shadow-glow-cyan hover:scale-[1.04] transition-all"
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span>{link.label}</span>
                  <span className="text-cyan-primary/30 group-hover:text-cyan-primary/60 transition-colors text-[10px] font-mono ml-1">{link.href.replace('https://', '')}</span>
                </a>
              ))}
            </div>

            <p className="font-display text-lg text-text-secondary">
              Feedback welcome! <span className="inline-block hover:scale-125 transition-transform">🙏</span>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
