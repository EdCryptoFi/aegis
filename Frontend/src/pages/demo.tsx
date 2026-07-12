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
import Footer from '@/components/Footer';
import { config } from '@/config';

/* ───────────────────────── Demo Day rehearsal page ─────────────────────────
   10 slides, 1:1 with .suiperpower/pitch-deck.md. Each slide embeds the real
   feature it needs (live AgentCard reads, real package id, real links) rather
   than a static mock. Built for click-through rehearsal, not just viewing. */

const SLIDES = [
  { id: 'hook', label: 'Hook' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'demo', label: 'Demo' },
  { id: 'why-sui', label: 'Why Sui' },
  { id: 'traction', label: 'Traction' },
  { id: 'team', label: 'Team' },
  { id: 'business', label: 'Business' },
  { id: 'ask', label: 'Ask' },
  { id: 'close', label: 'Close' },
];

const DEMO_AGENTS = [
  { name: 'AlphaTrader', address: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc' },
  { name: 'BetaBot', address: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec' },
  { name: 'GammaScam', address: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6' },
];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ─── Presenter timer, target 3'20" per the rehearsal script ─── */
function PresenterTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const targetSeconds = 200; // 3'20"

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const over = seconds > targetSeconds;

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full glass-card-heavy px-3 py-2">
      <span className={`font-mono text-sm tabular-nums ${over ? 'text-error' : 'text-cyan-primary'}`}>
        {formatTime(seconds)} <span className="text-text-muted">/ {formatTime(targetSeconds)}</span>
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary hover:bg-cyan-primary/20 transition-colors"
        aria-label={running ? 'Pause' : 'Start'}
      >
        {running ? <Pause size={12} /> : <Play size={12} />}
      </button>
      <button
        onClick={() => { setSeconds(0); setRunning(false); }}
        className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-2 border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-text-primary transition-colors"
        aria-label="Reset"
      >
        <RotateCcw size={12} />
      </button>
    </div>
  );
}

/* ─── Dot nav + slide counter ─── */
function SlideNav({ active, onJump }: { active: number; onJump: (i: number) => void }) {
  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {SLIDES.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onJump(i)}
          className="group relative flex items-center"
          aria-label={`Go to slide ${i + 1}: ${s.label}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full border transition-all ${
              i === active
                ? 'bg-cyan-primary border-cyan-primary shadow-glow-cyan scale-125'
                : 'bg-transparent border-text-muted/40 group-hover:border-cyan-primary/60'
            }`}
          />
          <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-md bg-surface-1 border border-[rgba(255,255,255,0.08)] px-2 py-1 text-[10px] font-mono text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
            {String(i + 1).padStart(2, '0')} · {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function SlideCounter({ active }: { active: number }) {
  return (
    <div className="fixed top-4 right-4 md:right-16 z-50 rounded-full glass-card-heavy px-3 py-2 font-mono text-xs text-text-secondary">
      <span className="text-cyan-primary font-bold">{String(active + 1).padStart(2, '0')}</span>
      <span className="text-text-muted"> / {String(SLIDES.length).padStart(2, '0')}</span>
      <span className="hidden sm:inline text-text-muted ml-2 uppercase tracking-wider">{SLIDES[active].label}</span>
    </div>
  );
}

function Slide({
  id, eyebrow, tall = false, children,
}: { id: string; eyebrow?: string; tall?: boolean; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={`snap-start w-full ${tall ? 'min-h-screen' : 'h-screen'} flex flex-col items-center justify-center px-6 py-16 relative`}
    >
      <div className="w-full max-w-4xl mx-auto">
        {eyebrow && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-cyan-primary/10 border border-cyan-primary/[0.15] text-cyan-primary text-label-xs font-mono uppercase tracking-wider">
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
            <div className="w-28 h-28 mb-6" style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
              <AegisLogo className="w-full h-full" />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-cyan-primary/10 border border-cyan-primary/20 text-cyan-primary text-label-sm font-mono uppercase tracking-wider mb-6">
              <Shield size={13} />
              Sui Overflow 2026 · Demo Day
            </span>
            <h1 className="font-display text-[36px] md:text-[56px] font-black text-text-primary leading-none mb-4 tracking-tight">
              &ldquo;Trust is not asked.<br />It&rsquo;s proven. On-chain.&rdquo;
            </h1>
            <p className="font-display text-lg md:text-xl text-text-secondary max-w-xl">
              Aegis — the reputation oracle for AI agents on Sui.
            </p>
            <p className="mt-8 font-mono text-[10px] text-text-muted uppercase tracking-widest animate-pulse">
              ↓ scroll or press → to advance
            </p>
          </div>
        </Slide>

        {/* 2. PROBLEM */}
        <Slide id="problem" eyebrow="The Problem">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
            Autonomous agents hold funds. Nobody can verify them.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              'No standardized way to prove agent quality or reliability',
              "Memory fragmented per app/model/device — fragile systems",
              'Users and wallets fear delegating funds to unknown agents',
            ].map((text) => (
              <div key={text} className="glass-card-heavy rounded-2xl p-5 flex items-start gap-3">
                <XCircle size={20} className="text-error shrink-0 mt-0.5" />
                <span className="text-text-primary text-sm">{text}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-error/[0.06] border border-error/20 p-5 text-center">
            <p className="text-text-primary font-display font-bold">Result: capital at risk, blind trust, no recourse.</p>
          </div>
        </Slide>

        {/* 3. SOLUTION */}
        <Slide id="solution" eyebrow="The Solution">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
            Every execution becomes a verifiable, persistent, composable trust record.
          </h2>
          <div className="space-y-3">
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
                className="flex items-center gap-4 glass-card-heavy rounded-2xl p-4"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-cyan-mint text-bg-base font-display font-bold text-xs flex items-center justify-center shrink-0 shadow-glow-cyan">
                  {step.n}
                </span>
                <span className="text-text-primary text-sm font-display font-semibold">{step.t}</span>
              </motion.div>
            ))}
          </div>
        </Slide>

        {/* 4. DEMO — live feature: real AgentCard reads from testnet */}
        <Slide id="demo" eyebrow="Live Demo" tall>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-2">
            Trust that updates itself — and can&rsquo;t be faked after the fact
          </h2>
          <p className="text-text-secondary text-sm text-center mb-8">
            Live on-chain reads, Sui Testnet. Package <code className="font-mono text-cyan-primary">{config.packageId.slice(0, 10)}…</code>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {DEMO_AGENTS.map((agent) => (
              <div key={agent.address} className="flex flex-col items-center">
                <p className="font-display font-bold text-text-primary text-sm mb-3">{agent.name}</p>
                <AgentCard agentAddress={agent.address} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-text-muted text-xs font-mono">
            GammaScam auto-revoked — high slippage crossed the on-chain threshold, zero manual intervention.
          </p>
        </Slide>

        {/* 5. WHY SUI */}
        <Slide id="why-sui" eyebrow="Why Sui">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
            Load-bearing, not decorative.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { t: 'Object Model', d: 'Reputation is a first-class ReputationObject, not a row in a database.' },
              { t: 'Capabilities', d: 'Owner can revoke an agent badge instantly — no admin backdoor.' },
              { t: 'Kiosk', d: 'Badge NFTs are natively listable, tradeable, verifiable.' },
              { t: 'Walrus', d: 'Full audit trail anchored on-chain via blob_id, cheaply.' },
            ].map(({ t, d }) => (
              <div key={t} className="glass-card-heavy rounded-2xl p-5 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-mint-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-semibold text-text-primary text-sm">{t}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-primary/[0.04] border border-cyan-primary/15 px-5 py-3 font-mono text-xs text-cyan-primary hover:bg-cyan-primary/[0.08] transition-all"
          >
            View deployed package on Sui Explorer <ExternalLink size={12} />
          </a>
        </Slide>

        {/* 6. TRACTION */}
        <Slide id="traction" eyebrow="Traction / Signal">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-3">
            Built and live today. Not a mockup.
          </h2>
          <p className="text-text-muted text-xs text-center font-mono mb-8">
            Build/deploy signal — no third-party users yet, said plainly.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '4/4', label: 'Move unit tests passing' },
              { value: 'Live', label: 'deployed on Sui Testnet' },
              { value: '3', label: 'demo agents, on-chain' },
              { value: '100%', label: 'dashboard uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card-heavy rounded-2xl p-5 text-center">
                <p className="font-display text-2xl md:text-3xl font-black gradient-text-cyan mb-1">{stat.value}</p>
                <p className="text-text-muted font-mono text-[10px] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href="https://aegisonchain.xyz" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:underline font-mono text-xs">
              aegisonchain.xyz →
            </a>
          </div>
        </Slide>

        {/* 7. TEAM */}
        <Slide id="team" eyebrow="Team">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
            Who&rsquo;s building this
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="glass-card-heavy rounded-2xl p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-cyan-mint flex items-center justify-center mx-auto mb-3 shadow-glow-cyan">
                <span className="font-display font-black text-bg-base text-lg">E</span>
              </div>
              <p className="font-display font-bold text-text-primary">Ed (@EdCriptoFi)</p>
              <p className="text-text-muted text-xs font-mono">Founder / Builder</p>
            </div>
            <div className="rounded-2xl border border-dashed border-text-muted/20 p-6 text-center flex flex-col items-center justify-center opacity-60">
              <p className="font-display font-bold text-text-secondary text-sm">+ Add teammate</p>
              <p className="text-text-muted text-xs font-mono mt-1">Move · Frontend · Video roles open per SPEC.md</p>
            </div>
          </div>
          <p className="text-center text-text-muted text-[11px] font-mono mt-6">
            Fill in real names before Demo Day — placeholders will read as incomplete to judges.
          </p>
        </Slide>

        {/* 8. BUSINESS MODEL */}
        <Slide id="business" eyebrow="Business Model">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-3">
            A trust layer wallets and marketplaces pay to use
          </h2>
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded-pill bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[11px] font-mono uppercase tracking-wider">
              Hypothesis — not yet validated
            </span>
          </div>
          <div className="glass-card-heavy rounded-2xl p-6 max-w-xl mx-auto text-center">
            <p className="text-text-secondary text-sm leading-relaxed">
              Usage-based API for reputation lookups, plus a revenue share on badge-gated marketplace listings.
              Next step: a design-partner pilot to test willingness to pay.
            </p>
          </div>
        </Slide>

        {/* 9. ASK */}
        <Slide id="ask" eyebrow="Ask">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-8">
            What we need from you
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://vote.sui.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all"
            >
              <Vote size={16} /> Vote for Aegis <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:hello@aegisonchain.xyz?subject=Aegis%20pilot%20intro"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] border border-cyan-primary/30 bg-cyan-primary/[0.04] text-text-primary font-display font-bold text-sm hover:bg-cyan-primary/[0.08] transition-all"
            >
              <Mail size={16} /> Intro us to a wallet/marketplace
            </a>
          </div>
        </Slide>

        {/* 10. CLOSE */}
        <Slide id="close">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-[28px] md:text-[40px] font-black text-text-primary mb-4 tracking-tight">
              &ldquo;Trust is not asked.<br /><span className="gradient-text-cyan">It&rsquo;s proven. On-chain.&rdquo;</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3 my-6">
              {[
                { icon: ExternalLink, label: 'Demo', href: 'https://aegisonchain.xyz' },
                { icon: Code2, label: 'Code', href: 'https://github.com/EdCryptoFi/aegis' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[14px] border border-cyan-primary/25 bg-cyan-primary/[0.05] text-text-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.12] hover:border-cyan-primary/50 hover:shadow-glow-cyan transition-all"
                >
                  <link.icon size={16} />
                  {link.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => jump(0)}
              className="text-text-muted text-xs font-mono uppercase tracking-widest hover:text-cyan-primary transition-colors flex items-center gap-1"
            >
              <RotateCcw size={11} /> Restart from Hook
            </button>
          </div>
        </Slide>

      </div>
    </main>
  );
}
