'use client';

import Link from 'next/link';

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

export default function TermsPage() {
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
                    <Link href={item.href}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <main className="docs-content">
        <h1>Terms of Service & Privacy Policy</h1>
        <p className="last-updated">Last updated: May 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Aegis ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Aegis is a decentralized reputation oracle for AI agents built on the Sui blockchain. The Service provides:
          </p>
          <ul>
            <li>On-chain reputation tracking for AI agents</li>
            <li>Badge certification system (Bronze, Silver, Gold)</li>
            <li>Persistent memory storage via Walrus</li>
            <li>Automated flagging based on performance metrics</li>
          </ul>
        </section>

        <section>
          <h2>3. No Financial Advice</h2>
          <p className="warning">
            ⚠️ Aegis provides information about agent reputation but does not constitute financial advice. 
            Users should conduct their own due diligence before delegating funds or trusting any agent.
          </p>
        </section>

        <section>
          <h2>4. User Responsibilities</h2>
          <p>Users of Aegis agree to:</p>
          <ul>
            <li>Use the Service in compliance with applicable laws</li>
            <li>Not attempt to manipulate reputation metrics</li>
            <li>Maintain the security of their wallet and private keys</li>
            <li>Verify agent credentials independently</li>
          </ul>
        </section>

        <section>
          <h2>5. Reputation Accuracy</h2>
          <p>
            Aegis aggregates on-chain data to display reputation metrics. While we strive for accuracy, 
            we cannot guarantee the completeness or correctness of the data displayed. Reputation 
            metrics are derived directly from blockchain events and may be subject to:
          </p>
          <ul>
            <li>Network delays</li>
            <li>Front-running or manipulation attempts</li>
            <li>Incorrect reporting by agents</li>
            <li>Technical blockchain issues</li>
          </ul>
        </section>

        <section>
          <h2>6. Automated Flagging</h2>
          <p>
            The Service automatically flags agents based on on-chain metrics when:
          </p>
          <ul>
            <li>Success rate drops below 50%</li>
            <li>5+ consecutive failures occur</li>
            <li>Slippage exceeds 500 basis points (5%)</li>
          </ul>
          <p>
            These flags are algorithmic and based on on-chain data only. They do not constitute 
            legal judgment or guarantee of wrongdoing.
          </p>
        </section>

        <section>
          <h2>7. Privacy Policy</h2>
          <h3>Data Collection</h3>
          <p>Aegis operates as a decentralized, permissionless protocol. We do not collect personal data. However:</p>
          <ul>
            <li>Wallet addresses are visible on-chain</li>
            <li>All transaction data is public on the Sui blockchain</li>
            <li>Reputation metrics are stored on-chain and are public</li>
            <li>Walrus storage may contain audit logs which are also public</li>
          </ul>

          <h3>Cookies & Tracking</h3>
          <p>
            This website may use essential cookies for functionality. We do not use third-party 
            analytics or tracking services that collect personal information.
          </p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>
            Aegis is provided "as is" without warranties of any kind. The operators shall not be 
            liable for any damages arising from:
          </p>
          <ul>
            <li>Use or inability to use the Service</li>
            <li>Loss of funds due to trusted agents</li>
            <li>Inaccurate reputation data</li>
            <li>Technical failures or downtime</li>
            <li>Decentralized protocol failures</li>
          </ul>
        </section>

        <section>
          <h2>9. Third-Party Services</h2>
          <p>
            Aegis integrates with third-party services including:
          </p>
          <ul>
            <li>Sui Blockchain</li>
            <li>MemWal (Persistent Memory)</li>
          </ul>
          <p>
            We are not responsible for the availability or security of these external services.
          </p>
        </section>

        <section>
          <h2>10. Intellectual Property</h2>
          <p>
            The Aegis name, logo, and documentation are property of the project. Smart contracts 
            are open-source and available under MIT license. Users may build on top of Aegis 
            with proper attribution.
          </p>
        </section>

        <section>
          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Service 
            after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2>12. Contact</h2>
          <p>
            For questions about these terms, please contact the project team through official channels.
          </p>
        </section>

        <footer className="legal-footer">
          <p>© 2026 Aegis. Built for Sui Overflow Hackathon.</p>
          <p>This is a demonstration project. Not audited. Use at your own risk.</p>
        </footer>

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
            max-width: 800px;
          }
          h1 {
            color: #fff;
            font-size: 32px;
            margin: 0 0 10px 0;
          }
          .last-updated {
            color: #666;
            font-size: 14px;
            margin-bottom: 40px;
          }
          h2 {
            color: #fff;
            font-size: 20px;
            margin: 40px 0 16px 0;
            padding-top: 20px;
            border-top: 1px solid #222;
          }
          h3 {
            color: #8b5cf6;
            font-size: 16px;
            margin: 20px 0 12px 0;
          }
          p {
            color: #aaa;
            line-height: 1.7;
            margin: 12px 0;
          }
          ul {
            color: #aaa;
            line-height: 1.8;
            padding-left: 20px;
          }
          li {
            margin: 8px 0;
          }
          .warning {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 8px;
            padding: 16px;
            color: #ef4444;
          }
          .legal-footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #222;
            text-align: center;
          }
          .legal-footer p {
            color: #666;
            font-size: 13px;
          }
          @media (max-width: 768px) {
            .docs-layout { flex-direction: column; }
            .sidebar { position: static; width: 100%; }
            .docs-content { margin-left: 0; padding: 20px; }
          }
        `}</style>
      </main>
    </div>
  );
}