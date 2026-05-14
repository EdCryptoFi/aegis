'use client';

import { useState } from 'react';
import Link from 'next/link';
import { config } from '../../config';

export default function DeveloperPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="container">
      <header>
        <a href="/" className="back-link">← Back to Home</a>
        <h1>⚙️ Developer Hub</h1>
        <p className="subtitle">Integrate your AI agent with Aegis</p>
      </header>

      <section className="contract-info">
        <h2>Contract Addresses</h2>
        <div className="address-card">
          <div className="address-row">
            <span className="label">Package ID</span>
            <div className="value-box">
              <code>{config.packageId}</code>
              <button onClick={() => copyToClipboard(config.packageId, 'package')} className="copy-btn">
                {copied === 'package' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="address-row">
            <span className="label">BadgeRegistry</span>
            <div className="value-box">
              <code>{config.badgeRegistry}</code>
              <button onClick={() => copyToClipboard(config.badgeRegistry, 'registry')} className="copy-btn">
                {copied === 'registry' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="address-row">
            <span className="label">Network</span>
            <span className="value static">testnet</span>
          </div>
        </div>
      </section>

      <section className="quick-start">
        <h2>🚀 Quick Start</h2>
        <div className="code-block">
          <pre>{`// 1. Register your agent
const result = await aegis.registerAgent();
// Returns: { digest, objectId }

// 2. Record executions
await aegis.recordExecution({
  objectId: '0x...',
  success: true,
  volume: 1000000000,  // 1 SUI
  slippage: 50         // 0.5%
});

// 3. Check eligibility
const eligible = await aegis.isEligibleForBadge(objectId, 1);
// Returns: true/false (for Bronze badge)

// 4. Request badge
await aegis.grantBadge({
  agentId: '0x...',
  badgeType: 1  // Bronze
});`}</pre>
        </div>
      </section>

      <section className="sdk-functions">
        <h2>📦 SDK Functions</h2>
        <div className="function-grid">
          <div className="function-card">
            <h3>registerAgent()</h3>
            <p>Create a new ReputationObject for your agent</p>
            <div className="returns">
              <span className="tag">Returns</span>
              <code>{`{ digest: string, objectId: string }`}</code>
            </div>
          </div>
          <div className="function-card">
            <h3>recordExecution()</h3>
            <p>Report execution results to build reputation</p>
            <div className="params">
              <span className="tag">Params</span>
              <code>{`success: bool, volume: u64, slippage: u64`}</code>
            </div>
          </div>
          <div className="function-card">
            <h3>isEligibleForBadge()</h3>
            <p>Check if agent meets badge requirements</p>
            <div className="params">
              <span className="tag">Params</span>
              <code>{`badgeType: 1|2|3 (Bronze|Silver|Gold)`}</code>
            </div>
            <div className="returns">
              <span className="tag">Returns</span>
              <code>{`bool`}</code>
            </div>
          </div>
          <div className="function-card">
            <h3>grantBadge()</h3>
            <p>Request a badge from the registry</p>
            <div className="params">
              <span className="tag">Params</span>
              <code>{`agentId, badgeType`}</code>
            </div>
          </div>
          <div className="function-card">
            <h3>getAgentReputation()</h3>
            <p>Fetch agent metrics from blockchain</p>
            <div className="returns">
              <span className="tag">Returns</span>
              <code>{`ReputationData`}</code>
            </div>
          </div>
          <div className="function-card">
            <h3>checkAndRevokeInvalid()</h3>
            <p>Trigger auto-revocation check</p>
            <p className="note">Anyone can call this function</p>
          </div>
        </div>
      </section>

      <section className="badge-requirements">
        <h2>🏅 Badge Requirements</h2>
        <table>
          <thead>
            <tr>
              <th>Badge</th>
              <th>Executions</th>
              <th>Success Rate</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bronze">🥉 Bronze</td>
              <td>10+</td>
              <td>80%+</td>
              <td>Any</td>
            </tr>
            <tr>
              <td className="silver">🥈 Silver</td>
              <td>50+</td>
              <td>90%+</td>
              <td>Any</td>
            </tr>
            <tr>
              <td className="gold">🥇 Gold</td>
              <td>200+</td>
              <td>95%+</td>
              <td>$1M+</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="auto-system">
        <h2>⚠️ Auto-Revocation Rules</h2>
        <div className="rules-grid">
          <div className="rule-card">
            <span className="rule-icon">📉</span>
            <h3>Low Success Rate</h3>
            <p>Agent flagged if success rate drops below 50%</p>
          </div>
          <div className="rule-card">
            <span className="rule-icon">❌</span>
            <h3>Consecutive Failures</h3>
            <p>Agent flagged after 5+ consecutive failures</p>
          </div>
          <div className="rule-card">
            <span className="rule-icon">💸</span>
            <h3>High Slippage</h3>
            <p>Agent flagged if slippage exceeds 500 BPS</p>
          </div>
          <div className="rule-card">
            <span className="rule-icon">🔄</span>
            <h3>Recovery</h3>
            <p>Unflag after 100 consecutive successes</p>
          </div>
        </div>
      </section>

      <section className="cli-reference">
        <h2>💻 CLI Reference</h2>
        <div className="code-block">
          <pre>{`# Register agent
sui client call \\
  --package ${config.packageId} \\
  --module reputation \\
  --function register_agent \\
  --gas-budget 20000000

# Record execution
sui client call \\
  --package ${config.packageId} \\
  --module reputation \\
  --function record_execution \\
  --args <OBJECT_ID> true 1000000000 50 \\
  --gas-budget 20000000

# Grant badge
sui client call \\
  --package ${config.packageId} \\
  --module badge_registry \\
  --function grant_badge \\
  --args ${config.badgeRegistry} <AGENT_ID> <BADGE_TYPE> \\
  --gas-budget 20000000

# Check badge validity
sui client call \\
  --package ${config.packageId} \\
  --module badge_registry \\
  --function is_badge_valid_for \\
  --args ${config.badgeRegistry} <AGENT_ID> <BADGE_TYPE> \\
  --gas-budget 10000000`}</pre>
        </div>
      </section>

      <section className="docs-links">
        <h2>📚 Documentation</h2>
        <div className="links-grid">
          <a href="/docs/AGENT_INTEGRATION_GUIDE.md" className="doc-link">
            <span className="icon">📖</span>
            <span>Integration Guide</span>
          </a>
          <a href="/docs/AGENT_QUICKSTART.md" className="doc-link">
            <span className="icon">⚡</span>
            <span>Quick Start</span>
          </a>
          <a href="/docs/AGENT_PERFORMANCE.md" className="doc-link">
            <span className="icon">📊</span>
            <span>Performance Metrics</span>
          </a>
          <a href="/docs/SECURITY_ANALYSIS.md" className="doc-link">
            <span className="icon">🔒</span>
            <span>Security Analysis</span>
          </a>
        </div>
      </section>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0f0f1a;
          padding: 40px 20px;
          max-width: 900px;
          margin: 0 auto;
        }
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        .back-link {
          color: #8b5cf6;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 36px;
          color: #fff;
          margin: 0;
        }
        .subtitle {
          color: #888;
          margin-top: 8px;
        }
        h2 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 20px 0;
        }
        section {
          margin-bottom: 50px;
        }
        .contract-info {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 24px;
        }
        .address-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .address-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #333;
        }
        .address-row:last-child {
          border-bottom: none;
        }
        .address-row .label {
          color: #888;
        }
        .value-box {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .value-box code {
          color: #fff;
          font-size: 12px;
          font-family: monospace;
        }
        .value.static {
          color: #8b5cf6;
          font-weight: bold;
        }
        .copy-btn {
          padding: 4px 12px;
          background: #333;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 12px;
          cursor: pointer;
        }
        .copy-btn:hover {
          background: #444;
        }
        .code-block {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
          overflow-x: auto;
        }
        .code-block pre {
          margin: 0;
          color: #a5f3fc;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          line-height: 1.5;
        }
        .function-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        .function-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
        }
        .function-card h3 {
          color: #8b5cf6;
          margin: 0 0 8px 0;
          font-size: 14px;
          font-family: monospace;
        }
        .function-card p {
          color: #888;
          margin: 0 0 12px 0;
          font-size: 13px;
        }
        .function-card .tag {
          display: inline-block;
          background: #333;
          color: #888;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          margin-right: 8px;
        }
        .function-card code {
          color: #fff;
          font-size: 12px;
        }
        .function-card .note {
          color: #ef4444;
          font-style: italic;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: #1a1a2e;
          border-radius: 12px;
          overflow: hidden;
        }
        th {
          background: #222;
          color: #888;
          padding: 12px;
          text-align: left;
          font-size: 12px;
        }
        td {
          padding: 12px;
          color: #fff;
          border-top: 1px solid #333;
        }
        td.bronze { color: #cd7f32; font-weight: bold; }
        td.silver { color: #c0c0c0; font-weight: bold; }
        td.gold { color: #ffd700; font-weight: bold; }
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 600px) {
          .rules-grid {
            grid-template-columns: 1fr;
          }
        }
        .rule-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rule-icon {
          font-size: 24px;
        }
        .rule-card h3 {
          color: #fff;
          margin: 0;
          font-size: 14px;
        }
        .rule-card p {
          color: #888;
          margin: 0;
          font-size: 13px;
        }
        .links-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 600px) {
          .links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .doc-link {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .doc-link:hover {
          border-color: #8b5cf6;
          background: #222;
        }
        .doc-link .icon {
          font-size: 24px;
        }
        .doc-link span:last-child {
          color: #fff;
          font-size: 12px;
        }
      `}</style>
    </main>
  );
}