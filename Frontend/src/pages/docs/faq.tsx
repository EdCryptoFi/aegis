'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const FAQS = [
  {
    q: 'What is Aegis?',
    a: 'Aegis is a decentralized reputation oracle for AI agents on the Sui blockchain. It tracks onchain metrics such as success rate, volume, and slippage to create a verifiable trust score for any registered agent.'
  },
  {
    q: 'How does an agent get "flagged"?',
    a: 'Flagging is automatic. When an agent records executions, the smart contract checks: success rate < 50%, 5+ consecutive failures, or slippage > 5%. If any condition is met, the agent is automatically marked as flagged - no manual intervention required.'
  },
  {
    q: 'Who can call record_execution()?',
    a: 'Anyone. The system is permissionless - any address can record an execution for any agent. This creates a decentralized watchdog mechanism where failures cannot be hidden or omitted.'
  },
  {
    q: 'How do badges work?',
    a: 'Badges are granted automatically when an agent meets the thresholds: Bronze (10+ executions, 80%+ success), Silver (50+ executions, 90%+ success), Gold (200+ executions, 95%+, $1M+ volume). All verification is done onchain. Badges expire after 5 days and must be renewed by continued execution.'
  },
  {
    q: 'Is the data tamper-proof?',
    a: 'Yes. All metrics are stored in Move smart contracts on Sui. Once an execution is recorded, it cannot be altered or deleted. The full history is permanently auditable onchain.'
  },
  {
    q: 'What is Walrus and why is it used?',
    a: 'Walrus is a decentralized storage system by Mysten Labs. Aegis uses Walrus to store detailed execution logs that are too large to fit onchain, while anchoring the blob_id in the ReputationObject - creating a complete, verifiable audit trail.'
  },
  {
    q: 'Can I use Aegis without connecting a wallet?',
    a: 'Yes. All reputation data is public. You can browse and verify any agent\'s reputation without connecting a wallet. A wallet is only required for write actions: registering an agent, recording executions, or requesting a badge.'
  },
  {
    q: 'What happens when an agent is flagged?',
    a: 'A flagged agent is shown with a red warning in the UI. The flag cannot be removed manually - the agent must recover by completing 100 consecutive successful executions with 200+ total executions overall.'
  },
  {
    q: 'Does Aegis provide financial advice?',
    a: 'No. Aegis displays onchain metrics only. It is the user\'s responsibility to conduct their own due diligence (DYOR). Reputation is a tool, not a guarantee of future performance.'
  },
  {
    q: 'How do I integrate my agent with Aegis?',
    a: 'Use the TypeScript SDK. Run npm i @aegis/sdk, call registerAgent() to create a ReputationObject, then call recordExecution() after each operation. After 10+ executions with 80%+ success rate, your agent qualifies for the Bronze badge. See /developer for the full guide.'
  },
  {
    q: 'What is the difference between Aegis and MemWal?',
    a: 'MemWal provides private memory for agents - encrypted reasoning, context, and decision rationale. Aegis provides public reputation for third parties - verifiable onchain metrics. Use both together by anchoring the MemWal blob_id inside the ReputationObject for linked, fully auditable intelligence.'
  },
  {
    q: 'Can I use MemWal together with Aegis?',
    a: 'Yes. Use MemWal to store private agent decisions and reasoning. Aegis records the public metrics onchain. Link the MemWal blob_id in the ReputationObject for: (1) complete traceability, (2) decentralized verification, and (3) immutable audit trail.'
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open ? 'border-cyan-primary/20 bg-surface-1' : 'border-[rgba(255,255,255,0.06)] bg-surface-0/60 hover:border-[rgba(255,255,255,0.12)]'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-text-primary font-medium text-sm pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-180 text-cyan-primary' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-text-secondary text-sm leading-relaxed border-t border-[rgba(255,255,255,0.06)] pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
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
                        <ExternalLink size={12} className="flex-shrink-0" />
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-xl text-sm transition-all ${
                          item.href === '/docs/faq'
                            ? 'bg-cyan-primary/10 text-cyan-primary'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                        }`}
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

      {/* Main content */}
      <main className="ml-60 flex-1 px-12 py-12 max-w-[860px]">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle size={24} className="text-cyan-primary" />
          <h1 className="font-display text-4xl font-bold text-text-primary">FAQ</h1>
        </div>
        <p className="text-text-secondary text-lg mb-10">Frequently asked questions about Aegis.</p>

        <div className="space-y-3 mb-12">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>

        <div className="rounded-2xl p-6 bg-cyan-primary/[0.05] border border-cyan-primary/20">
          <h2 className="font-display text-lg font-bold text-text-primary mb-2">Still have questions?</h2>
          <p className="text-text-secondary text-sm">
            Check our{' '}
            <Link href="/docs" className="text-cyan-primary hover:text-mint-secondary transition-colors underline">full documentation</Link>
            {' '}or contact the team on{' '}
            <a href="https://github.com/EdCryptoFi/aegis" target="_blank" rel="noopener noreferrer" className="text-cyan-primary hover:text-mint-secondary transition-colors underline">GitHub</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
