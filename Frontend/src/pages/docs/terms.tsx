'use client';

import Link from 'next/link';
import { BookOpen, ExternalLink, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

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

const sections = [
  {
    num: '1',
    title: 'Acceptance of Terms',
    content: 'By accessing and using Aegis ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this Service.',
  },
  {
    num: '2',
    title: 'Description of Service',
    content: 'Aegis is a decentralized reputation oracle for AI agents built on the Sui blockchain. The Service provides:',
    list: [
      'On-chain reputation tracking for AI agents',
      'Badge certification system (Bronze, Silver, Gold)',
      'Persistent memory storage via Walrus',
      'Automated flagging based on performance metrics',
    ],
  },
  {
    num: '4',
    title: 'User Responsibilities',
    content: 'Users of Aegis agree to:',
    list: [
      'Use the Service in compliance with applicable laws',
      'Not attempt to manipulate reputation metrics',
      'Maintain the security of their wallet and private keys',
      'Verify agent credentials independently',
    ],
  },
  {
    num: '5',
    title: 'Reputation Accuracy',
    content: 'Aegis aggregates on-chain data to display reputation metrics. While we strive for accuracy, we cannot guarantee the completeness or correctness of the data displayed. Reputation metrics are derived directly from blockchain events and may be subject to:',
    list: [
      'Network delays',
      'Front-running or manipulation attempts',
      'Incorrect reporting by agents',
      'Technical blockchain issues',
    ],
  },
  {
    num: '6',
    title: 'Automated Flagging',
    content: 'The Service automatically flags agents based on on-chain metrics when:',
    list: [
      'Success rate drops below 50%',
      '5+ consecutive failures occur',
      'Slippage exceeds 500 basis points (5%)',
    ],
    footnote: 'These flags are algorithmic and based on on-chain data only. They do not constitute legal judgment or guarantee of wrongdoing.',
  },
  {
    num: '7',
    title: 'Privacy Policy',
    sub: [
      {
        title: 'Data Collection',
        content: 'Aegis operates as a decentralized, permissionless protocol. We do not collect personal data. However:',
        list: [
          'Wallet addresses are visible on-chain',
          'All transaction data is public on the Sui blockchain',
          'Reputation metrics are stored on-chain and are public',
          'Walrus storage may contain audit logs which are also public',
        ],
      },
      {
        title: 'Cookies & Tracking',
        content: 'This website may use essential cookies for functionality. We do not use third-party analytics or tracking services that collect personal information.',
      },
    ],
  },
  {
    num: '8',
    title: 'Limitation of Liability',
    content: 'Aegis is provided "as is" without warranties of any kind. The operators shall not be liable for any damages arising from:',
    list: [
      'Use or inability to use the Service',
      'Loss of funds due to trusted agents',
      'Inaccurate reputation data',
      'Technical failures or downtime',
      'Decentralized protocol failures',
    ],
  },
  {
    num: '9',
    title: 'Third-Party Services',
    content: 'Aegis integrates with third-party services including:',
    list: ['Sui Blockchain', 'MemWal (Persistent Memory)', 'Walrus (Decentralized Storage)'],
    footnote: 'We are not responsible for the availability or security of these external services.',
  },
  {
    num: '10',
    title: 'Intellectual Property',
    content: 'The Aegis name, logo, and documentation are property of the project. Smart contracts are open-source and available under MIT license. Users may build on top of Aegis with proper attribution.',
  },
  {
    num: '11',
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.',
  },
  {
    num: '12',
    title: 'Contact',
    content: 'For questions about these terms, please contact the project team through official channels on GitHub.',
  },
];

export default function TermsPage() {
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
                          item.href === '/docs/terms'
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-cyan-primary" />
            <h1 className="font-display text-4xl font-bold text-text-primary">Terms of Service & Privacy</h1>
          </div>
          <p className="text-text-muted text-sm font-mono mb-10">Last updated: May 2026</p>

          {/* Warning card */}
          <div className="rounded-2xl flex items-start gap-4 p-5 mb-10 bg-red-500/[0.06] border border-red-500/20">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 text-sm mb-1">Section 3 - No Financial Advice</p>
              <p className="text-text-secondary text-sm leading-relaxed">
                Aegis provides information about agent reputation but does <strong className="text-text-primary">not</strong> constitute financial advice.
                Users should conduct their own due diligence before delegating funds or trusting any agent.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.num} className="border-t border-[rgba(255,255,255,0.06)] pt-8">
                <h2 className="font-display text-lg font-bold text-text-primary mb-3 flex items-baseline gap-2">
                  <span className="font-mono text-sm text-cyan-primary">{s.num}.</span>
                  {s.title}
                </h2>
                {s.content && (
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">{s.content}</p>
                )}
                {s.list && (
                  <ul className="space-y-1.5 mb-3">
                    {s.list.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="w-1 h-1 rounded-full bg-cyan-primary/60 mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.footnote && (
                  <p className="text-text-muted text-xs leading-relaxed mt-2">{s.footnote}</p>
                )}
                {s.sub?.map((sub) => (
                  <div key={sub.title} className="mt-4 pl-4 border-l border-[rgba(255,255,255,0.06)]">
                    <h3 className="font-semibold text-cyan-primary text-sm mb-2">{sub.title}</h3>
                    {sub.content && (
                      <p className="text-text-secondary text-sm leading-relaxed mb-2">{sub.content}</p>
                    )}
                    {sub.list && (
                      <ul className="space-y-1.5">
                        {sub.list.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                            <span className="w-1 h-1 rounded-full bg-cyan-primary/60 mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] text-center">
            <p className="text-text-muted text-xs">© 2026 Aegis. Built for Sui Overflow Hackathon.</p>
            <p className="text-text-muted text-xs mt-1">This is a demonstration project. Not audited. Use at your own risk.</p>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
