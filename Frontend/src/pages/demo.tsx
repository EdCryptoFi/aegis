'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, XCircle, CheckCircle2, ArrowRight, ArrowUpRight,
  Play, Pause, RotateCcw, ExternalLink, Code2, Vote, Mail,
} from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import AegisLogo from '@/components/AegisLogo';
import AgentCard from '@/components/AgentCard';
import AgentDashboard from '@/components/AgentDashboard';
import CliWalkthrough from '@/components/CliWalkthrough';
import Footer from '@/components/Footer';
import { config } from '@/config';
import { DEMO_AGENTS } from '@/lib/demo-agents';

const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), { ssr: false });

// Simplified 1:1 with the 5 Solution bullets — no Move/SDK internals, just
// the flow a judge can follow in the ~5 seconds this slide gets on screen.
const SOLUTION_FLOW = `flowchart TD
    A([Register]) --> B([Execute])
    B --> C([Record])
    C --> D([Log · Walrus])
    D --> E{Badge}
    E -->|criteria met| F([🥇 Minted])
    E -->|criteria broken| G([🚫 Revoked])`;

/* ───────────────────────── Demo Day rehearsal page ─────────────────────────
   9 slides, 1:1 with .suiperpower/pitch-deck.md. Each slide embeds the real
   feature it needs (live AgentCard reads, real package id, real links) rather
   than a static mock. Built for click-through rehearsal, not just viewing.
   Sized ~1.6x baseline (fonts, spacing, icons) for projection on a big
   screen — scaled down 20% from the initial 2x pass. ───────────────────── */

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

const packageExplorerUrl = `https://suiscan.xyz/testnet/object/${config.packageId}/tx-blocks`;

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
    <div className="fixed top-6 left-6 z-50 flex items-center gap-3 rounded-full glass-card-heavy px-5 py-3">
      <span className={`font-mono text-lg tabular-nums ${overCap ? 'text-error animate-pulse' : overTarget ? 'text-yellow-400' : 'text-cyan-primary'}`}>
        {formatTime(seconds)} <span className="text-text-muted">/ {formatTime(targetSeconds)} (cap {formatTime(hardCapSeconds)})</span>
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary hover:bg-cyan-primary/20 transition-colors"
        aria-label={running ? 'Pause' : 'Start'}
      >
        {running ? <Pause size={19} /> : <Play size={19} />}
      </button>
      <button
        onClick={() => { setSeconds(0); setRunning(false); }}
        className="w-11 h-11 rounded-full flex items-center justify-center bg-surface-2 border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-text-primary transition-colors"
        aria-label="Reset"
      >
        <RotateCcw size={19} />
      </button>
    </div>
  );
}

/* ─── Dot nav + slide counter ─── */
function SlideNav({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(i)}
          className="group relative flex items-center"
          aria-label={`Go to slide ${i + 1}: ${s.label}`}
        >
          <span
            className={`w-4 h-4 rounded-full border transition-all ${
              i === active
                ? 'bg-cyan-primary border-cyan-primary shadow-glow-cyan scale-125'
                : 'bg-transparent border-text-muted/40 group-hover:border-cyan-primary/60'
            }`}
          />
          <span className="pointer-events-none absolute right-8 whitespace-nowrap rounded-md bg-surface-1 border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-base font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            {String(i + 1).padStart(2, '0')} · {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SlideCounter({ active }: { active: number }) {
  return (
    <div className="fixed top-6 right-6 md:right-28 z-50 rounded-full glass-card-heavy px-5 py-3 font-mono text-lg text-text-secondary">
      <span className="text-cyan-primary font-bold">{String(active + 1).padStart(2, '0')}</span>
      <span className="text-text-muted"> / {String(SLIDES.length).padStart(2, '0')}</span>
      <span className="hidden sm:inline text-text-muted ml-3 uppercase tracking-wider">{SLIDES[active].label}</span>
    </div>
  );
}

/** Package address, always shown in full, always linked to Suiscan. */
function PackageLink({ className = '' }: { className?: string }) {
  return (
    <a
      href={packageExplorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`font-mono text-cyan-primary hover:underline break-all ${className}`}
    >
      {config.packageId}
    </a>
  );
}

function Slide({
  id, eyebrow, tall = false, wide = false, children,
}: { id: string; eyebrow?: string; tall?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={`snap-start w-full ${tall ? 'min-h-screen' : 'h-screen'} flex flex-col items-center justify-center px-10 py-24 relative`}
    >
      <div className={`w-full mx-auto ${wide ? 'max-w-[92rem]' : 'max-w-[60rem]'}`}>
        {eyebrow && (
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-3 px-5 py-1.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary font-mono uppercase tracking-wider text-xl">
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
            <div className="w-44 h-44 mb-10" style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
              <AegisLogo className="w-full h-full" />
            </div>
            <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary font-mono uppercase tracking-wider text-xl mb-10">
              <Shield size={21} />
              Sui Overflow 2026 · Demo Day
            </span>
            <h1 className="font-display text-[58px] md:text-[90px] font-black text-text-primary leading-none mb-6 tracking-tight">
              &ldquo;Trust is not asked.<br />It&rsquo;s proven. Onchain.&rdquo;
            </h1>
            <p className="font-display text-3xl md:text-4xl text-text-secondary max-w-3xl">
              Aegis — the reputation oracle for AI agents on Sui.
            </p>
            <p className="mt-12 font-mono text-lg text-text-muted uppercase tracking-widest animate-pulse">
              ↓ scroll or press → to advance
            </p>
          </div>
        </Slide>

        {/* 2. PROBLEM */}
        <Slide id="problem" eyebrow="The Problem">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-12">
            Autonomous agents hold funds. Nobody can verify them.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              'No standardized way to prove agent quality or reliability',
              "Memory fragmented per app/model/device — fragile systems",
              'Users and wallets fear delegating funds to unknown agents',
            ].map((text) => (
              <div key={text} className="glass-card-heavy rounded-[26px] p-8 flex items-start gap-5">
                <XCircle size={32} className="text-error shrink-0 mt-1" />
                <span className="text-text-primary text-xl">{text}</span>
              </div>
            ))}
          </div>
          <div className="rounded-[26px] bg-error/[0.06] border border-error/20 p-8 text-center">
            <p className="text-text-primary font-display font-bold text-2xl">Result: capital at risk, blind trust, no recourse.</p>
          </div>
        </Slide>

        {/* 3. SOLUTION */}
        <Slide id="solution" eyebrow="The Solution" wide>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-12">
            Every execution becomes a verifiable, persistent, composable trust record.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: the 5 steps as text */}
            <div className="space-y-5">
              {[
                {
                  n: '1',
                  t: 'Register — agent gets a ReputationObject on Sui',
                  d: "One signed transaction permanently binds a shared, publicly-readable ReputationObject to the creator's address — only that address can log future executions, and enough of them at a high success rate earns a Bronze, Silver, or Gold badge.",
                },
                { n: '2', t: 'Execute — agent trades on DeepBook' },
                { n: '3', t: 'Record — success, volume, slippage written onchain' },
                { n: '4', t: 'Log — full history anchored to Walrus (blob_id onchain)' },
                { n: '5', t: 'Badge — Kiosk NFT minted, or auto-revoked, no human in the loop' },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-6 glass-card-heavy rounded-[26px] p-6"
                >
                  <span className="w-12 h-12 rounded-full bg-gradient-cyan-mint text-bg-base font-display font-bold text-xl flex items-center justify-center shrink-0 shadow-glow-cyan">
                    {step.n}
                  </span>
                  <div>
                    <p className="text-text-primary text-xl font-display font-semibold">{step.t}</p>
                    {step.d && <p className="text-text-secondary text-lg mt-2">{step.d}</p>}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: the same 5 steps as a flow diagram */}
            <div className="glass-card-heavy rounded-[26px] p-8">
              <MermaidDiagram chart={SOLUTION_FLOW} />
            </div>
          </div>
        </Slide>

        {/* 4. DEMO — live feature: real AgentCard reads + a real signed tx with explorer proof.
             Agents stacked in a left column, the live walkthrough pinned to the right,
             so a judge can watch existing state and a fresh live tx side by side. */}
        <Slide id="demo" eyebrow="Live Demo" tall wide>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-3">
            Trust that updates itself — and can&rsquo;t be faked after the fact
          </h2>
          <p className="text-text-secondary text-xl text-center mb-12 px-4">
            Live onchain reads, Sui Testnet. Package <PackageLink />
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: existing agents, stacked */}
            <div className="flex flex-col gap-6">
              <p className="text-text-muted text-xl font-mono uppercase tracking-wider text-center">Existing onchain agents</p>
              {DEMO_AGENTS.filter((agent) => agent.name !== 'BetaBot').map((agent) => (
                <div key={agent.address} className="flex flex-col items-center w-full">
                  <AgentCard agentAddress={agent.address} name={agent.name} />
                </div>
              ))}
              <p className="text-center text-text-muted text-lg font-mono">
                GammaScam auto-revoked — high slippage crossed the onchain threshold, zero manual intervention.
              </p>
            </div>

            {/* Right: live walkthrough */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-24">
              <p className="text-text-muted text-xl font-mono uppercase tracking-wider text-center">
                Run it live now — a real signed transaction, verifiable on Sui Explorer
              </p>
              <CliWalkthrough compact />
            </div>
          </div>
        </Slide>

        {/* 5. WHY SUI */}
        <Slide id="why-sui" eyebrow="Why Sui">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-12">
            Load-bearing, not decorative.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { t: 'Object Model', d: 'Reputation becomes a first-class onchain object — not a database row.' },
              { t: 'Capabilities', d: 'Only the correct owner can issue or revoke a badge — no admin backdoors. Badges are Kiosk NFTs: natively listable, tradeable, verifiable.' },
              { t: 'Walrus', d: 'Stores the complete audit trail efficiently, using blob IDs.' },
            ].map(({ t, d }) => (
              <div key={t} className="glass-card-heavy rounded-[26px] p-8 flex items-start gap-5">
                <CheckCircle2 size={32} className="text-mint-secondary shrink-0 mt-1" />
                <div>
                  <p className="font-display font-semibold text-text-primary text-2xl">{t}</p>
                  <p className="text-text-secondary text-lg mt-1.5">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-text-muted text-lg font-mono mb-8">
            Remove any one of these three and the trust model doesn&rsquo;t work — that&rsquo;s why Aegis was built specifically on Sui.
          </p>
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-cyan-primary/[0.04] border border-cyan-primary/15 px-8 py-5 font-mono text-lg">
            <span className="text-text-muted">Package:</span>
            <PackageLink />
            <ExternalLink size={19} className="text-cyan-primary shrink-0" />
          </div>
        </Slide>

        {/* 6. TRACTION */}
        <Slide id="traction" eyebrow="Traction / Signal">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-5">
            Built and live today. Not a mockup.
          </h2>
          <p className="text-text-muted text-lg text-center font-mono mb-12">
            Build/deploy signal — no third-party users yet, said plainly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: '4/4', label: 'Move unit tests passing' },
              { value: 'Live', label: 'deployed on Sui Testnet' },
              { value: '2', label: 'demo agents, onchain' },
              { value: '100%', label: 'dashboard uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-heavy rounded-[26px] p-8 text-center">
                <p className="font-display text-4xl md:text-5xl font-black gradient-text-cyan mb-1.5">{stat.value}</p>
                <p className="text-text-muted font-mono text-lg uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="https://aegisonchain.xyz" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:underline font-mono text-xl">
              aegisonchain.xyz →
            </a>
          </div>
        </Slide>

        {/* 7. BUSINESS MODEL — who actually pays, per .suiperpower/business-model.md */}
        <Slide id="business" eyebrow="Business Model" tall wide>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-6">
            My first customer isn&rsquo;t the wallet — it&rsquo;s the agent operator
          </h2>
          <div className="glass-card-heavy rounded-[26px] p-10 mx-auto text-center mb-8">
            <p className="text-text-secondary text-xl leading-relaxed">
              Anyone running an autonomous trading strategy on DeepBook needs delegated capital, and that
              requires reputation that&rsquo;s independently verifiable, not self-reported. That&rsquo;s the
              <strong className="text-text-primary"> Verified Agent</strong> tier: premium badge placement,
              a performance analytics dashboard, and a Walrus-anchored audit report — the same due-diligence
              package a DeFi vault or fund would otherwise have to build in-house. As more verified agents
              join, wallets and marketplaces become the second side of the network.
            </p>
          </div>

          {/* Live proof: the actual analytics dashboard for a Gold-badged agent,
               rendered directly (not embedded) — same component as /agent/[address] */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-muted text-xl font-mono uppercase tracking-wider">
              The Verified Agent dashboard, live — AlphaTrader (Gold)
            </p>
            <a
              href="/agent/0xfe3cb0c9dd9e147b860034ae9ec5591f10f6a35517e5d2bd6023a9aa86bd1a2a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cyan-primary hover:underline text-lg font-mono shrink-0"
            >
              Open full page <ExternalLink size={18} />
            </a>
          </div>
          <AgentDashboard
            address="0xfe3cb0c9dd9e147b860034ae9ec5591f10f6a35517e5d2bd6023a9aa86bd1a2a"
            showFooterLink={false}
            compact
          />
        </Slide>

        {/* 8. ASK */}
        <Slide id="ask" eyebrow="Ask">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary text-center mb-12">
            What we need from you
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://vote.sui.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-[20px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-xl hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
            >
              <Vote size={26} /> Vote for Aegis <ArrowUpRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:hello@aegisonchain.xyz?subject=Aegis%20pilot%20intro"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-[20px] border border-cyan-primary/30 bg-cyan-primary/[0.04] text-text-primary font-display font-bold text-xl hover:bg-cyan-primary/[0.08] transition-all"
            >
              <Mail size={26} /> Intro us to an agent builder
            </a>
          </div>
        </Slide>

        {/* 9. CLOSE */}
        <Slide id="close">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-[45px] md:text-[64px] font-black text-text-primary mb-6 tracking-tight">
              &ldquo;Trust is not asked.<br /><span className="gradient-text-cyan">It&rsquo;s proven. Onchain.&rdquo;</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-5 my-10">
              {[
                { icon: ExternalLink, label: 'Demo', href: 'https://aegisonchain.xyz' },
                { icon: Code2, label: 'Code', href: 'https://github.com/EdCryptoFi/aegis' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-5 rounded-[22px] border border-cyan-primary/25 bg-cyan-primary/[0.05] text-text-primary font-display font-semibold text-xl hover:bg-cyan-primary/[0.12] hover:border-cyan-primary/50 hover:shadow-glow-cyan transition-all"
                >
                  <link.icon size={26} />
                  {link.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => jump(0)}
              className="text-text-muted text-lg font-mono uppercase tracking-widest hover:text-cyan-primary transition-colors flex items-center gap-2"
            >
              <RotateCcw size={18} /> Restart from Hook
            </button>
          </div>
        </Slide>

      </div>
    </main>
  );
}
