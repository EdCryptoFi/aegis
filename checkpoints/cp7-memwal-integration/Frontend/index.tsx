'use client';

import Link from 'next/link';
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
    <div className="docs-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="logo">📖 Aegis Docs</Link>
        </div>
        <nav className="sidebar-nav">
          {SIDEBAR.map((section) => (
            <div key={section.title} className="nav-section">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith('http') ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    ) : (
                      <Link href={item.href}>{item.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="docs-content">
        <h1>Welcome to Aegis Documentation</h1>
        <p className="intro">
          Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.
        </p>

        <section className="getting-started">
          <h2>🚀 Getting Started</h2>
          <div className="cards">
            <Link href="/developer" className="card">
              <span className="icon">⚡</span>
              <h3>Quick Start</h3>
              <p>Get up and running in 5 minutes</p>
            </Link>
            <Link href="/docs/faq" className="card">
              <span className="icon">❓</span>
              <h3>FAQ</h3>
              <p>Common questions answered</p>
            </Link>
            <Link href="/docs/terms" className="card">
              <span className="icon">📄</span>
              <h3>Terms & Privacy</h3>
              <p>Legal information</p>
            </Link>
          </div>
        </section>

        <section className="key-concepts">
          <h2>📚 Key Concepts</h2>
          <ul>
            <li><Link href="/agents"><strong>Reputation System</strong></Link> - On-chain metrics that track agent performance</li>
            <li><Link href="/badges"><strong>Badges</strong></Link> - Bronze, Silver, and Gold certifications</li>
            <li><strong>DeepBook Integration</strong> - Real execution data feeds reputation scores</li>
            <li><strong>MemWal (Add-on)</strong> - <a href="https://docs.memwal.ai/" target="_blank" rel="noopener">Private encrypted memory</a> for agent rationale</li>
          </ul>
        </section>

        <section className="memwal-section">
          <h2>🔐 MemWal Add-on</h2>
          <p>
            Aegis works seamlessly with <a href="https://docs.memwal.ai/" target="_blank" rel="noopener">MemWal</a> for private agent memory:
          </p>
          <ul>
            <li><strong>Private rationale</strong> - Agent's reasoning stays encrypted</li>
            <li><strong>Public metrics</strong> - Success/slippage verified on-chain</li>
            <li><strong>Linked audit trail</strong> - MemWal blob_id anchored in ReputationObject</li>
          </ul>
          <pre>{`// Using Aegis + MemWal
import { AegisDeepBookExecutor } from '@aegis/sdk';
import { MemWal } from '@mysten-incubation/memwal';

// 1. Configure both
const executor = await AegisDeepBookExecutor.create({
  signer,
  memwalConfig: {
    privateKey: '...',
    accountId: '...',
  }
});

// 2. Execute with rationale
const result = await executor.executeWithRationale(
  { poolName: 'DEEP_SUI', side: 'buy', quantity: 5 },
  {
    task: 'Buy DEEP',
    reasoning: 'DEEP undervalued vs SUI',
    decision: 'Market buy at current price'
  }
);

// 3. MemWal blob_id linked to Aegis publicly
// Anyone can verify: "Agent has 95% uptime, blob_id X links to full audit"
`}</pre>
          <p className="note">
            <strong>Note:</strong> Aegis ≠ MemWal. MemWal = private memory; Aegis = public reputation.
            Want both? Anchor MemWal blob_id in Aegis ReputationObject for linked audit.
          </p>
        </section>

        <section className="quick-example">
          <h2>💻 Quick Example</h2>
          <pre>{`import { registerAgent, recordExecution } from '@aegis/sdk';

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
        </section>

        <section className="help-links">
          <h2>❓ Need Help?</h2>
          <ul>
            <li><Link href="/docs/faq">FAQ</Link> - Common questions answered</li>
            <li><Link href="/docs/terms">Terms & Privacy</Link> - Legal information</li>
            <li><a href="https://github.com/aegis-ai" target="_blank">GitHub</a> - Report issues</li>
          </ul>
        </section>

        <style jsx>{`
          .docs-layout {
            display: flex;
            min-height: 100vh;
            background: #0f0f1a;
          }
          .sidebar {
            width: 260px;
            background: #0a0a12;
            border-right: 1px solid #222;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
          }
          .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid #222;
          }
          .logo {
            color: #8b5cf6;
            font-size: 18px;
            font-weight: bold;
            text-decoration: none;
          }
          .sidebar-nav {
            padding: 20px 0;
          }
          .nav-section {
            margin-bottom: 20px;
          }
          .nav-section h3 {
            color: #666;
            font-size: 11px;
            text-transform: uppercase;
            padding: 0 20px;
            margin: 0 0 8px 0;
          }
          .nav-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .nav-section li a {
            display: block;
            padding: 8px 20px;
            color: #888;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
          }
          .nav-section li a:hover {
            color: #fff;
            background: rgba(139, 92, 246, 0.1);
          }
          .docs-content {
            flex: 1;
            margin-left: 260px;
            padding: 40px 60px;
            max-width: 900px;
          }
          h1 {
            color: #fff;
            font-size: 36px;
            margin: 0 0 20px 0;
          }
          .intro {
            color: #888;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 40px;
          }
          h2 {
            color: #fff;
            font-size: 24px;
            margin: 40px 0 20px 0;
            padding-top: 20px;
            border-top: 1px solid #222;
          }
          .cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 20px;
          }
          .card {
            background: #1a1a2e;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            text-decoration: none;
            transition: all 0.2s;
          }
          .card:hover {
            border-color: #8b5cf6;
            transform: translateY(-2px);
          }
          .card .icon {
            font-size: 24px;
            display: block;
            margin-bottom: 12px;
          }
          .card h3 {
            color: #fff;
            font-size: 16px;
            margin: 0 0 8px 0;
          }
          .card p {
            color: #666;
            font-size: 13px;
            margin: 0;
          }
          .key-concepts ul {
            list-style: none;
            padding: 0;
          }
          .key-concepts li {
            padding: 12px 0;
            border-bottom: 1px solid #222;
          }
          .key-concepts a {
            color: #8b5cf6;
            text-decoration: none;
          }
          .key-concepts a:hover {
            text-decoration: underline;
          }
          .quick-example pre {
            background: #1a1a2e;
            padding: 20px;
            border-radius: 12px;
            overflow-x: auto;
            font-size: 13px;
            color: #a5f3fc;
            line-height: 1.5;
          }
          .help-links ul {
            list-style: none;
            padding: 0;
          }
          .help-links li {
            padding: 8px 0;
          }
          .help-links a {
            color: #8b5cf6;
            text-decoration: none;
          }
          .help-links a:hover {
            text-decoration: underline;
          }
          @media (max-width: 768px) {
            .docs-layout { flex-direction: column; }
            .sidebar { position: static; width: 100%; }
            .docs-content { margin-left: 0; padding: 20px; }
            .cards { grid-template-columns: 1fr; }
          }
        `}</style>
      </main>
    </div>
  );
}