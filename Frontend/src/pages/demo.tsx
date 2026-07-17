'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, XCircle, CheckCircle2, ArrowRight, ArrowUpRight,
  Play, Pause, RotateCcw, ExternalLink, Code2, Vote, Mail,
} from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import AegisLogo from '@/components/AegisLogo';
import AgentCard from '@/components/AgentCard';
import CliWalkthrough from '@/components/CliWalkthrough';
import Footer from '@/components/Footer';
import { config } from '@/config';
import { DEMO_AGENTS } from '@/lib/demo-agents';

/* ───────────────────────── Demo Day rehearsal page ─────────────────────────
   9 slides, 1:1 with .suiperpower/pitch-deck.md. Each slide embeds the real
   feature it needs (live AgentCard reads, real package id, real links) rather
   than a static mock. Built for click-through rehearsal, not just viewing.
   Sized 2x (fonts, spacing, icons) for projection on a big screen. ───────── */

const SLIDES = [
  { id: 'hook', label: 'Hook' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'demo', label: 'Demo' },
  { id: 'why-sui', label: 'Why Sui' },
  { id: 'traction', label: 'Traction' },
  { id: 'business', label: 'Business' },
  { id: 'ask', label: 'Ask' },
  { id: 'close', label: 'Close' },
];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ─── Presenter timer. Official Demo Day rule: 5:00 hard cap, strictly
   enforced, no grace period. Target delivery is 4'20", leaving buffer. ─── */
function PresenterTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const targetSeconds = 260; // 4'20" rehearsal target
  const hardCapSeconds = 300; // 5:00 official limit

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const overTarget = seconds > targetSeconds;
  const overCap = seconds > hardCapSeconds;

  return (
    <div className="fixed top-8 left-8 z-50 flex items-center gap-4 rounded-full glass-card-heavy px-6 py-4">
      <span className={`font-mono text-2xl tabular-nums ${overCap ? 'text-error animate-pulse' : overTarget ? 'text-yellow-400' : 'text-cyan-primary'}`}>
        {formatTime(seconds)} <span className="text-text-muted">/ {formatTime(targetSeconds)} (cap {formatTime(hardCapSeconds)})</span>
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary hover:bg-cyan-primary/20 transition-colors"
        aria-label={running ? 'Pause' : 'Start'}
      >
        {running ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        onClick={() => { setSeconds(0); setRunning(false); }}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-surface-2 border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-text-primary transition-colors"
        aria-label="Reset"
      >
        <RotateCcw size={24} />
      </button>
    </div>
  );
}

/* ─── Dot nav + slide counter ─── */
function SlideNav({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  return (
    <div className="fixed right-8 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(i)}
          className="group relative flex items-center"
          aria-label={`Go to slide ${i + 1}: ${s.label}`}
        >
          <span
            className={`w-5 h-5 rounded-full border transition-all ${
              i === active
                ? 'bg-cyan-primary border-cyan-primary shadow-glow-cyan scale-125'
                : 'bg-transparent border-text-muted/40 group-hover:border-cyan-primary/60'
            }`}
          />
          <span className="pointer-events-none absolute right-10 whitespace-nowrap rounded-md bg-surface-1 border border-[rgba(255,255,255,0.08)] px-4 py-2 text-xl font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            {String(i + 1).padStart(2, '0')} · {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SlideCounter({ active }: { active: number }) {
  return (
    <div className="fixed top-8 right-8 md:right-32 z-50 rounded-full glass-card-heavy px-6 py-4 font-mono text-xl text-text-secondary">
      <span className="text-cyan-primary font-bold">{String(active + 1).padStart(2, '0')}</span>
      <span className="text-text-muted"> / {String(SLIDES.length).padStart(2, '0')}</span>
      <span className="hidden sm:inline text-text-muted ml-4 uppercase tracking-wider">{SLIDES[active].label}</span>
    </div>
  );
}

function Slide({
  id, eyebrow, tall = false, wide = false, children,
}: { id: string; eyebrow?: string; tall?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={`snap-start w-full ${tall ? 'min-h-screen' : 'h-screen'} flex flex-col items-center justify-center px-12 py-32 relative`}
    >
      <div className={`w-full mx-auto ${wide ? 'max-w-[112rem]' : 'max-w-[72rem]'}`}>
        {eyebrow && (
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-3 px-6 py-2 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary font-mono uppercase tracking-wider text-2xl">
              {eyebrow}
            </span>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default function DemoPage() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const jump = useCallback((i: number) => {
    const el = document.getElementById(SLIDES[i].id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SLIDES.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    SLIDES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        jump(Math.min(active + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        jump(Math.max(active - 1, 0));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, jump]);

  const explorerUrl = `https://suivision.xyz/package/${config.packageId}`;

  return (
    <main className="relative bg-bg-base">
      <ParticleBackground />
      <GlowOrbs />
      <PresenterTimer />
      <SlideCounter active={active} />
      <SlideNav active={active} onJump={jump} />

      <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory relative z-10">

        {/* 1. HOOK */}
        <Slide id="hook">
          <div className="flex flex-col items-center text-center">
            <div className="w-56 h-56 mb-12" style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
              <AegisLogo className="w-full h-full" />
            </div>
            <span className="inline-flex items-center gap-4 px-8 py-3 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary font-mono uppercase tracking-wider text-2xl mb-12">
              <Shield size={26} />
              Sui Overflow 2026 · Demo Day
            </span>
            <h1 className="font-display text-[72px] md:text-[112px] font-black text-text-primary leading-none mb-8 tracking-tight">
              &ldquo;Trust is not asked.<br />It&rsquo;s proven. On-chain.&rdquo;
            </h1>
            <p className="font-display text-4xl md:text-5xl text-text-secondary max-w-4xl">
              Aegis — the reputation oracle for AI agents on Sui.
            </p>
            <p className="mt-8 text-text-muted text-2xl font-mono">
              Ed · building on Sui for 1+ year · winner of 2 hackathons this year · built solo
            </p>
            <p className="mt-16 font-mono text-xl text-text-muted uppercase tracking-widest animate-pulse">
              ↓ scroll or press → to advance
            </p>
          </div>
        </Slide>

        {/* 2. PROBLEM */}
        <Slide id="problem" eyebrow="The Problem">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-16">
            Autonomous agents hold funds. Nobody can verify them.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              'No standardized way to prove agent quality or reliability',
              "Memory fragmented per app/model/device — fragile systems",
              'Users and wallets fear delegating funds to unknown agents',
            ].map((text) => (
              <div key={text} className="glass-card-heavy rounded-[32px] p-10 flex items-start gap-6">
                <XCircle size={40} className="text-error shrink-0 mt-1" />
                <span className="text-text-primary text-2xl">{text}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[32px] bg-error/[0.06] border border-error/20 p-10 text-center">
            <p className="text-text-primary font-display font-bold text-3xl">Result: capital at risk, blind trust, no recourse.</p>
          </div>
        </Slide>

        {/* 3. SOLUTION */}
        <Slide id="solution" eyebrow="The Solution">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-16">
            Every execution becomes a verifiable, persistent, composable trust record.
          </h2>
          <div className="space-y-6">
            {[
              { n: '1', t: 'Register — agent gets a ReputationObject on Sui' },
              { n: '2', t: 'Execute — agent trades on DeepBook' },
              { n: '3', t: 'Record — success, volume, slippage written on-chain' },
              { n: '4', t: 'Log — full history anchored to Walrus (blob_id on-chain)' },
              { n: '5', t: 'Badge — Kiosk NFT minted, or auto-revoked, no human in the loop' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-8 glass-card-heavy rounded-[32px] p-8"
              >
                <span className="w-16 h-16 rounded-full bg-gradient-cyan-mint text-bg-base font-display font-bold text-2xl flex items-center justify-center shrink-0 shadow-glow-cyan">
                  {step.n}
                </span>
                <span className="text-text-primary text-2xl font-display font-semibold">{step.t}</span>
              </motion.div>
            ))}
          </div>
        </Slide>

        {/* 4. DEMO — live feature: real AgentCard reads + a real signed tx with explorer proof.
             Agents stacked in a left column, the live walkthrough pinned to the right,
             so a judge can watch existing state and a fresh live tx side by side. */}
        <Slide id="demo" eyebrow="Live Demo" tall wide>
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-4">
            Trust that updates itself — and can&rsquo;t be faked after the fact
          </h2>
          <p className="text-text-secondary text-2xl text-center mb-16 break-all px-4">
            Live on-chain reads, Sui Testnet. Package <code className="font-mono text-cyan-primary">{config.packageId}</code>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: existing agents, stacked */}
            <div className="flex flex-col gap-8">
              <p className="text-text-muted text-2xl font-mono uppercase tracking-wider text-center">Existing on-chain agents</p>
              {DEMO_AGENTS.map((agent) => (
                <div key={agent.address} className="flex flex-col items-center w-full">
                  <AgentCard agentAddress={agent.address} name={agent.name} />
                </div>
              ))}
              <p className="text-center text-text-muted text-xl font-mono">
                GammaScam auto-revoked — high slippage crossed the on-chain threshold, zero manual intervention.
              </p>
            </div>

            {/* Right: live walkthrough */}
            <div className="flex flex-col gap-8 lg:sticky lg:top-32">
              <p className="text-text-muted text-2xl font-mono uppercase tracking-wider text-center">
                Run it live now — a real signed transaction, verifiable on Sui Explorer
              </p>
              <CliWalkthrough compact />
            </div>
          </div>
        </Slide>

        {/* 5. WHY SUI */}
        <Slide id="why-sui" eyebrow="Why Sui">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-16">
            Load-bearing, not decorative.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { t: 'Object Model', d: 'Reputation is a first-class ReputationObject, not a row in a database.' },
              { t: 'Capabilities', d: 'Owner can revoke an agent badge instantly — no admin backdoor.' },
              { t: 'Kiosk', d: 'Badge NFTs are natively listable, tradeable, verifiable.' },
              { t: 'Walrus', d: 'Full audit trail anchored on-chain via blob_id, cheaply.' },
            ].map(({ t, d }) => (
              <div key={t} className="glass-card-heavy rounded-[32px] p-10 flex items-start gap-6">
                <CheckCircle2 size={40} className="text-mint-secondary shrink-0 mt-1" />
                <div>
                  <p className="font-display font-semibold text-text-primary text-3xl">{t}</p>
                  <p className="text-text-secondary text-xl mt-2">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 rounded-2xl bg-cyan-primary/[0.04] border border-cyan-primary/15 px-10 py-6 font-mono text-xl text-cyan-primary hover:bg-cyan-primary/[0.08] transition-all"
          >
            View deployed package on Sui Explorer <ExternalLink size={24} />
          </a>
        </Slide>

        {/* 6. TRACTION */}
        <Slide id="traction" eyebrow="Traction / Signal">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-6">
            Built and live today. Not a mockup.
          </h2>
          <p className="text-text-muted text-xl text-center font-mono mb-16">
            Build/deploy signal — no third-party users yet, said plainly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '4/4', label: 'Move unit tests passing' },
              { value: 'Live', label: 'deployed on Sui Testnet' },
              { value: '3', label: 'demo agents, on-chain' },
              { value: '100%', label: 'dashboard uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-heavy rounded-[32px] p-10 text-center">
                <p className="font-display text-5xl md:text-6xl font-black gradient-text-cyan mb-2">{stat.value}</p>
                <p className="text-text-muted font-mono text-xl uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href="https://aegisonchain.xyz" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:underline font-mono text-2xl">
              aegisonchain.xyz →
            </a>
          </div>
        </Slide>

        {/* 7. BUSINESS MODEL — who actually pays, per .suiperpower/business-model.md */}
        <Slide id="business" eyebrow="Business Model">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-6">
            The agent operator pays, not the wallet
          </h2>
          <div className="flex justify-center mb-12">
            <span className="px-6 py-3 rounded-pill bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xl font-mono uppercase tracking-wider">
              Hypothesis — not yet validated
            </span>
          </div>
          <div className="glass-card-heavy rounded-[32px] p-12 max-w-5xl mx-auto text-center mb-8">
            <p className="text-text-secondary text-2xl leading-relaxed">
              An agent needs a portable, on-chain, third-party-verifiable badge to attract delegated capital.
              So the operator pays for a <strong className="text-text-primary">Verified Agent</strong> tier: premium badge
              placement, a performance analytics dashboard, and a Walrus-anchored audit report.
              Wallets and marketplaces become the second paying side later, once there&rsquo;s enough badge volume
              to make a query API worth integrating.
            </p>
          </div>
          <p className="text-center text-text-muted text-xl font-mono">
            Next 2 weeks: DM outreach to other Sui agent-builder teams to test willingness to pay before building more.
          </p>
        </Slide>

        {/* 8. ASK */}
        <Slide id="ask" eyebrow="Ask">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-text-primary text-center mb-16">
            What we need from you
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <a
              href="https://vote.sui.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-12 py-6 rounded-[24px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-2xl hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
            >
              <Vote size={32} /> Vote for Aegis <ArrowUpRight size={28} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:hello@aegisonchain.xyz?subject=Aegis%20pilot%20intro"
              className="inline-flex items-center gap-4 px-12 py-6 rounded-[24px] border border-cyan-primary/30 bg-cyan-primary/[0.04] text-text-primary font-display font-bold text-2xl hover:bg-cyan-primary/[0.08] transition-all"
            >
              <Mail size={32} /> Intro us to an agent builder
            </a>
          </div>
        </Slide>

        {/* 9. CLOSE */}
        <Slide id="close">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-[56px] md:text-[80px] font-black text-text-primary mb-8 tracking-tight">
              &ldquo;Trust is not asked.<br /><span className="gradient-text-cyan">It&rsquo;s proven. On-chain.&rdquo;</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6 my-12">
              {[
                { icon: ExternalLink, label: 'Demo', href: 'https://aegisonchain.xyz' },
                { icon: Code2, label: 'Code', href: 'https://github.com/EdCryptoFi/aegis' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-10 py-6 rounded-[28px] border border-cyan-primary/25 bg-cyan-primary/[0.05] text-text-primary font-display font-semibold text-2xl hover:bg-cyan-primary/[0.12] hover:border-cyan-primary/50 hover:shadow-glow-cyan transition-all"
                >
                  <link.icon size={32} />
                  {link.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => jump(0)}
              className="text-text-muted text-xl font-mono uppercase tracking-widest hover:text-cyan-primary transition-colors flex items-center gap-2"
            >
              <RotateCcw size={22} /> Restart from Hook
            </button>
          </div>
        </Slide>

      </div>
    </main>
  );
}
