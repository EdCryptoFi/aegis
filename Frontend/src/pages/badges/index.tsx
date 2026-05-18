'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Shield, ShieldOff, AlertTriangle, Code2, ArrowRight, Activity, TrendingUp, Zap, BarChart2, CheckCircle, XCircle } from 'lucide-react';
import { EarnBadgeIcon, SuccessIcon, UptimeIcon, FlaggedIcon } from '../../components/AegisIcons';

const TIERS = [
  {
    level: 'LVL 5',
    name: 'GOLD LEVEL',
    shortName: 'Gold',
    WireIcon: EarnBadgeIcon,
    border: 'border-yellow-400/40',
    outerBorder: 'border-yellow-400/20',
    bg: 'bg-yellow-400/[0.04]',
    accentText: 'text-yellow-400',
    accentBg: 'bg-yellow-400/10',
    accent: '#ffd700',
    accessLabel: 'AUTONOMOUS - UNRESTRICTED',
    accessDesc: 'Full permission for autonomous execution of critical tasks and production systems. No human approval required.',
    chartPoints: '0,28 12,22 24,17 36,12 48,8 60,5 72,3 84,1',
    chartLabel: 'Peak performance trajectory',
    metrics: [
      { icon: Zap, label: 'Executions', value: '200+', pct: 100 },
      { icon: CheckCircle, label: 'Success Rate', value: '≥ 95%', pct: 95 },
      { icon: Activity, label: 'Volume', value: '≥ $1M', pct: 90 },
    ],
    reqs: ['200+ total executions', '95%+ success rate', '$1,000,000+ protected volume'],
  },
  {
    level: 'LVL 3',
    name: 'SILVER LEVEL',
    shortName: 'Silver',
    WireIcon: SuccessIcon,
    border: 'border-slate-400/40',
    outerBorder: 'border-slate-400/20',
    bg: 'bg-slate-400/[0.04]',
    accentText: 'text-slate-300',
    accentBg: 'bg-slate-400/10',
    accent: '#c0c0c0',
    accessLabel: 'SUPERVISED',
    accessDesc: 'Task execution under supervision. Human approval required for destructive or production-level actions.',
    chartPoints: '0,28 12,24 24,20 36,17 48,14 60,12 72,10 84,9',
    chartLabel: 'Steady upward track record',
    metrics: [
      { icon: Zap, label: 'Executions', value: '50+', pct: 50 },
      { icon: CheckCircle, label: 'Success Rate', value: '≥ 90%', pct: 90 },
      { icon: Activity, label: 'Volume', value: 'Any', pct: 40 },
    ],
    reqs: ['50+ total executions', '90%+ success rate'],
  },
  {
    level: 'LVL 1',
    name: 'BRONZE LEVEL',
    shortName: 'Bronze',
    WireIcon: UptimeIcon,
    border: 'border-amber-600/40',
    outerBorder: 'border-amber-600/20',
    bg: 'bg-amber-600/[0.04]',
    accentText: 'text-amber-500',
    accentBg: 'bg-amber-600/10',
    accent: '#cd7f32',
    accessLabel: 'RESTRICTED - READ ONLY',
    accessDesc: 'Sandbox-only access for read-only operations and non-sensitive data processing. No write permissions.',
    chartPoints: '0,28 12,26 24,25 36,23 48,21 60,19 72,18 84,17',
    chartLabel: 'Early track record building',
    metrics: [
      { icon: Zap, label: 'Executions', value: '10+', pct: 20 },
      { icon: CheckCircle, label: 'Success Rate', value: '≥ 80%', pct: 80 },
      { icon: Activity, label: 'Volume', value: 'Any', pct: 20 },
    ],
    reqs: ['10+ total executions', '80%+ success rate'],
  },
  {
    level: 'LVL 0',
    name: 'REVOKED',
    shortName: 'Revoked',
    WireIcon: FlaggedIcon,
    border: 'border-red-500/40',
    outerBorder: 'border-red-500/20',
    bg: 'bg-red-500/[0.04]',
    accentText: 'text-red-400',
    accentBg: 'bg-red-500/10',
    accent: '#ef4444',
    accessLabel: 'DISABLED - QUARANTINE',
    accessDesc: 'Credentials revoked due to violation or anomalous behavior. All access blocked pending manual review.',
    chartPoints: '0,4 10,7 20,10 30,13 40,16 50,18 60,20 70,21 80,22',
    chartLabel: 'Performance violation detected',
    metrics: [
      { icon: XCircle, label: 'Success Rate', value: '< 50%', pct: 50 },
      { icon: XCircle, label: 'Consec. Failures', value: '5+', pct: 100 },
      { icon: XCircle, label: 'Slippage', value: '> 500 BPS', pct: 100 },
    ],
    reqs: ['Success rate drops below 50%', '5+ consecutive failures', 'Slippage exceeds 500 BPS'],
  },
] as const;

export default function BadgesPage() {
  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <Award size={28} className="text-cyan-primary" />
              <h1 className="font-display text-5xl font-bold gradient-text-cyan">Badge Registry</h1>
            </div>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-cyan-primary/[0.08] border border-cyan-primary/30 text-cyan-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.14] hover:shadow-glow-cyan transition-all whitespace-nowrap self-start sm:self-auto"
            >
              <Code2 size={14} />
              Integrate your Agent
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-text-secondary text-lg">Certified agent trust badges on Sui</p>
        </motion.div>

        {/* Registry Explanation */}
        <motion.div
          className="mb-12 rounded-2xl border border-cyan-primary/20 bg-cyan-primary/[0.04] overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="px-6 py-5 border-b border-cyan-primary/10">
            <p className="text-text-secondary text-base leading-relaxed">
              The <span className="text-cyan-primary font-semibold">Badge Registry</span> is Aegis&apos;s trust certification system for autonomous agents on Sui. It evaluates real-world performance - success rate, processed volume, uptime - and assigns verification badges that determine access levels and permissions. The registry is integrated on-chain for full public auditability. Performance drops or violations trigger <span className="text-red-400 font-semibold">automatic revocation</span>, instantly removing agent privileges.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[rgba(255,255,255,0.06)]">
            {[
              { text: 'Evaluates agents via objective on-chain metrics (executions, success rate, volume)' },
              { text: 'Classifies into 3 tiers: Gold (LVL 5), Silver (LVL 3), Bronze (LVL 1)' },
              { text: 'Controls access permissions automatically based on tier classification' },
              { text: 'Monitors continuously and revokes credentials on failure or violation' },
              { text: 'Records everything on-chain for full transparency and public audit' },
            ].map(({ text }, i) => (
              <div key={i} className="flex items-start gap-2.5 px-4 py-3">
                <span className="text-cyan-primary text-sm font-mono font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="text-text-muted text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4 Badge Tiers */}
        <div className="space-y-8 mb-16">
          {TIERS.map((tier, idx) => (
            <motion.div
              key={tier.shortName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-5 rounded-2xl border ${tier.outerBorder} p-5`}
            >

              {/* ── Left: LVL card ── */}
              <div className={`rounded-xl border ${tier.border} ${tier.bg} p-6 flex flex-col gap-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-mono text-sm font-bold ${tier.accentText} tracking-widest`}>{tier.level}</p>
                    <h2 className={`font-display text-2xl font-bold ${tier.accentText} mt-0.5`}>{tier.name}</h2>
                  </div>
                  <span className={`font-mono text-xs px-3 py-1 rounded-full ${tier.accentBg} ${tier.accentText} border ${tier.border}`}>
                    {tier.shortName}
                  </span>
                </div>

                {/* Wireframe Icon */}
                <div className={`w-20 h-20 mx-auto ${tier.accentText}`}>
                  <tier.WireIcon />
                </div>

                {/* Sparkline */}
                <div className={`rounded-xl bg-bg-base/80 border border-[rgba(255,255,255,0.06)] px-4 pt-3 pb-2`}>
                  <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">{tier.chartLabel}</p>
                  <svg viewBox="0 0 84 30" className="w-full h-10" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`lvlgrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={tier.accent} stopOpacity="0.35" />
                        <stop offset="100%" stopColor={tier.accent} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <polygon points={`${tier.chartPoints} 84,30 0,30`} fill={`url(#lvlgrad-${idx})`} />
                    <polyline points={tier.chartPoints} fill="none" stroke={tier.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Access level */}
                <div className={`rounded-xl ${tier.accentBg} px-4 py-3`}>
                  <p className={`font-mono text-xs font-bold tracking-widest ${tier.accentText} mb-1`}>{tier.accessLabel}</p>
                  <p className="text-text-muted text-sm leading-relaxed">{tier.accessDesc}</p>
                </div>
              </div>

              {/* ── Right: How Aegis Evaluates ── */}
              <div className={`rounded-xl border ${tier.border} ${tier.bg} p-6 flex flex-col gap-5`}>
                <div>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-widest mb-1">How Aegis Evaluates</p>
                  <h3 className="font-display text-xl font-bold text-text-primary">Criteria for {tier.shortName}</h3>
                </div>

                {/* Metric bars */}
                <div className="space-y-4 flex-1">
                  {tier.metrics.map(({ icon: MIcon, label, value, pct }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <MIcon size={13} className={tier.accentText} />
                          <span className="text-text-secondary text-sm uppercase tracking-wide">{label}</span>
                        </div>
                        <span className={`font-mono text-sm font-bold ${tier.accentText}`}>{value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: tier.accent }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: idx * 0.08 + 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Requirements checklist */}
                <div className={`rounded-xl border ${tier.border} bg-bg-base/60 px-5 py-4`}>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-widest mb-3">Requirements</p>
                  <ul className="space-y-2">
                    {tier.reqs.map(r => (
                      <li key={r} className={`text-sm flex items-center gap-2.5 ${tier.accentText}`}>
                        {tier.shortName === 'Revoked'
                          ? <XCircle size={13} />
                          : <CheckCircle size={13} />
                        }
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Complete Auto-Revocation Process */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.04] overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-red-500/20">
              <AlertTriangle size={16} className="text-red-400" />
              <h3 className="text-red-400 font-display font-semibold text-base">Complete Auto-Revocation Process</h3>
              <span className="ml-auto font-mono text-xs text-red-400/60 uppercase tracking-widest">On-Chain Enforcement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-red-500/10">
              {[
                { step: '1', icon: XCircle, title: 'Trigger Detection', text: 'Success rate drops below threshold (<95% Gold, <90% Silver), 5+ consecutive failures, slippage >500 BPS, or suspicious behavior detected.' },
                { step: '2', icon: ShieldOff, title: 'On-Chain Invalidation', text: 'Agent credentials marked "Revoked" in the smart contract. New privileged executions are blocked at the protocol level.' },
                { step: '3', icon: AlertTriangle, title: 'Access Downgrade', text: 'Access level immediately downgraded to LVL 0. No write or production permissions remain active for the agent.' },
                { step: '4', icon: Shield, title: 'Operational Block', text: 'Agent quarantined. Critical autonomous tasks paused pending manual review and resolution of the incident.' },
              ].map(({ step, icon: RIcon, title, text }) => (
                <div key={step} className="flex flex-col gap-2 px-5 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400/50">{step}.</span>
                    <RIcon size={13} className="text-red-400" />
                    <span className="text-red-300 font-semibold text-sm">{title}</span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-red-500/10 border-t border-red-500/10">
              {[
                { step: '5', icon: Activity, title: 'Public Registry Update', text: 'Registry status updates in real-time, displaying a Revoked badge for full community transparency.' },
                { step: '6', icon: BarChart2, title: 'Audit Logging', text: 'Event logged with timestamp, revocation reason, and incident metrics. Permanent on-chain record for post-analysis.' },
                { step: '7', icon: Zap, title: 'Stakeholder Alert', text: 'Relevant stakeholders and the agent operator are notified of the status change via on-chain events.' },
                { step: '8', icon: CheckCircle, title: 'Conditional Reinstatement', text: 'Agent may reapply for certification only after resolving issues and passing manual review. No automatic reinstatement.' },
              ].map(({ step, icon: RIcon, title, text }) => (
                <div key={step} className="flex flex-col gap-2 px-5 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-400/50">{step}.</span>
                    <RIcon size={13} className="text-red-400" />
                    <span className="text-red-300 font-semibold text-sm">{title}</span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
