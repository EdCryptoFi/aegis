'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Zap, HelpCircle, FileText, ExternalLink, Shield, Lock } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

const SIDEBAR = [
  { title: 'Getting Started', items: [
    { name: 'Introduction', href: '/docs' },
    { name: 'Developer Hub', href: '/developer' },
    { name: 'FAQ', href: '/docs/faq' },
  ]},
  { title: 'Resources', items: [
    { name: 'Terms & Privacy', href: '/docs/terms' },
    { name: 'GitHub', href: 'https://github.com/EdCryptoFi/aegis' },
  ]},
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen bg-bg-base">

      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 fixed h-screen overflow-y-auto bg-surface-0 border-r border-[rgba(255,255,255,0.06)] z-10">
        <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <Link href="/" className="flex items-center gap-2 text-cyan-primary font-bold text-base hover:text-mint-secondary transition-colors">
            <BookOpen size={18} />
            Aegis Docs
          </Link>
        </div>
        <nav className="py-5">
          {SIDEBAR.map((section) => (
            <div key={section.title} className="mb-5 px-5">
              <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest mb-2">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-all"
                      >
                        <ExternalLink size={13} className="flex-shrink-0" />
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-all"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="ml-60 flex-1 px-12 py-12 max-w-[860px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-4">Welcome to Aegis Documentation</h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-12">
            Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.
          </p>

          {/* Getting started cards */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-text-primary mb-5">Getting Started</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: 'Quick Start', desc: 'Get up and running in 5 minutes', href: '/developer', color: 'text-cyan-primary', bg: 'bg-cyan-primary/[0.06]' },
                { icon: HelpCircle, label: 'FAQ', desc: 'Common questions answered', href: '/docs/faq', color: 'text-mint-secondary', bg: 'bg-mint-secondary/[0.06]' },
                { icon: FileText, label: 'Terms & Privacy', desc: 'Legal information', href: '/docs/terms', color: 'text-text-muted', bg: 'bg-surface-2' },
              ].map(({ icon: Icon, label, desc, href, color, bg }) => (
                <Link
                  key={label}
                  href={href}
                  className="rounded-2xl p-5 glass-card-matte hover:-translate-y-1 hover:border-cyan-primary/20 transition-all duration-300"
                >
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <p className="font-semibold text-text-primary text-sm mb-1">{label}</p>
                  <p className="text-text-muted text-xs">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Key concepts */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-text-primary mb-5">Key Concepts</h2>
            <div className="rounded-2xl glass-card-heavy divide-y divide-[rgba(255,255,255,0.06)]">
              {[
                { label: 'Reputation System', desc: 'On-chain metrics that track agent performance', href: '/agents', internal: true },
                { label: 'Badges', desc: 'Bronze, Silver, and Gold certifications based on execution history', href: '/badges', internal: true },
                { label: 'MemWal Audit Trail', desc: 'Encrypted memory for agent decision logs and verification', href: 'https://docs.memwal.ai/', internal: false },
              ].map(({ label, desc, href, internal }) => (
                <div key={label} className="px-5 py-4 flex items-center gap-4">
                  <Shield size={14} className="text-cyan-primary flex-shrink-0" />
                  <div>
                    {internal ? (
                      <Link href={href} className="font-semibold text-sm text-cyan-primary hover:text-mint-secondary transition-colors">{label}</Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-cyan-primary hover:text-mint-secondary transition-colors">{label}</a>
                    )}
                    <p className="text-text-secondary text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* MemWal section */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
              <Lock size={18} className="text-cyan-primary" /> MemWal Add-on
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Aegis works seamlessly with <a href="https://docs.memwal.ai/" target="_blank" rel="noopener" className="text-cyan-primary hover:text-mint-secondary underline">MemWal</a> for private agent memory:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: 'Private rationale', desc: "Agent's reasoning stays encrypted" },
                { label: 'Public metrics', desc: 'Success/slippage verified on-chain' },
                { label: 'Linked audit trail', desc: 'MemWal blob_id anchored in ReputationObject' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-primary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-text-primary">{label}</strong> — <span className="text-text-secondary">{desc}</span></span>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-5 overflow-x-auto">
              <pre className="font-mono text-xs text-cyan-primary leading-relaxed whitespace-pre">{`// Using Aegis with MemWal Integration
import { logExecution, storeExecutionLog } from '@aegis/sdk';
import { memwalService } from '@aegis/sdk';

// 1. Log the execution locally
const log = logExecution({
  agentId: '0x...',
  action: 'execute_transaction',
  success: true,
  volume: 1000000000,
  timestamp: Date.now()
});

// 2. Store decision rationale in MemWal (private)
await memwalService.storeRationale({
  agentId: '0x...',
  task: 'Optimize trading',
  reasoning: 'Market conditions favorable',
  decision: 'Execute with conservative slippage'
});

// 3. ReputationObject updated on blockchain
// blob_id links to MemWal for full audit trail`}</pre>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-cyan-primary/[0.05] border border-cyan-primary/20">
              <p className="text-text-secondary text-xs leading-relaxed">
                <strong className="text-text-primary">Core Validation:</strong> Aegis validates reputation on-chain (execution counts, badges). MemWal provides the <em>why</em> (decision rationale) — fully auditable, fully private.
              </p>
            </div>
          </section>

          {/* Quick example */}
          <section className="mb-12">
            <h2 className="font-display text-xl font-bold text-text-primary mb-5">Quick Example</h2>
            <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-5 overflow-x-auto">
              <pre className="font-mono text-xs text-cyan-primary leading-relaxed whitespace-pre">{`import { registerAgent, recordExecution } from '@aegis/sdk';

// 1. Register your agent
const { objectId } = await registerAgent();

// 2. After each execution, record the result
await recordExecution({
  objectId,
  success: true,
  volume: 1000000000, // 1 SUI
  slippage: 50, // 0.5%
});

// 3. Check eligibility for badges
const eligible = await isEligibleForBadge(objectId, 2); // Silver`}</pre>
            </div>
          </section>

          {/* Help links */}
          <section>
            <h2 className="font-display text-xl font-bold text-text-primary mb-5">Need Help?</h2>
            <ul className="space-y-2">
              {[
                { label: 'FAQ', href: '/docs/faq', internal: true },
                { label: 'Terms & Privacy', href: '/docs/terms', internal: true },
                { label: 'GitHub — Report issues', href: 'https://github.com/aegis-ai', internal: false },
              ].map(({ label, href, internal }) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <span className="w-1 h-1 rounded-full bg-cyan-primary" />
                  {internal ? (
                    <Link href={href} className="text-cyan-primary hover:text-mint-secondary transition-colors">{label}</Link>
                  ) : (
                    <a href={href} target="_blank" rel="noopener" className="text-cyan-primary hover:text-mint-secondary transition-colors">{label}</a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
