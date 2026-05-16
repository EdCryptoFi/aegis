'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Zap, HelpCircle, FileText, ExternalLink, Shield, Lock,
  AlertTriangle, CheckCircle, Code2, GitBranch, Activity, Map,
  ChevronRight, ArrowRight, Database, Cpu, Globe, BarChart2,
  XCircle, Clock, Terminal, Layers, TrendingUp, Award, Coins, Trophy,
} from 'lucide-react';

const SIDEBAR = [
  { title: 'Getting Started', items: [
    { name: 'Introduction', href: '/docs', anchor: false },
    { name: 'FAQ', href: '/docs/faq', anchor: false },
  ]},
  { title: 'Developers', items: [
    { name: 'Quick Start', href: '/developer', anchor: false },
    { name: 'API Reference', href: '#api', anchor: true },
    { name: 'Testing & Local Dev', href: '#testing', anchor: true },
  ]},
  { title: 'Protocol Integrators', items: [
    { name: 'Integration Guides', href: '#integrations', anchor: true },
    { name: 'Security Best Practices', href: '#security', anchor: true },
    { name: 'Troubleshooting', href: '#troubleshooting', anchor: true },
  ]},
  { title: 'Roadmap', items: [
    { name: 'Phase 2 Roadmap', href: '#roadmap', anchor: true, highlight: true },
  ]},
  { title: 'Business Model', items: [
    { name: 'Sustainability & Incentives', href: '#sustainability', anchor: true },
  ]},
  { title: 'Resources', items: [
    { name: 'Terms & Privacy', href: '/docs/terms', anchor: false },
    { name: 'GitHub', href: 'https://github.com/EdCryptoFi/aegis', anchor: false, external: true },
  ]},
];

function CodeBlock({ code, lang = 'typescript' }: { code: string; lang?: string }) {
  return (
    <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.06)] bg-surface-0">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">{lang}</span>
        <Terminal size={12} className="text-text-muted" />
      </div>
      <pre className="px-5 py-4 font-mono text-xs text-cyan-primary leading-relaxed whitespace-pre overflow-x-auto">{code}</pre>
    </div>
  );
}

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
                {section.items.map((item) => {
                  const base = 'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all';
                  if ('external' in item && item.external) {
                    return (
                      <li key={item.href}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          className={`${base} text-text-secondary hover:text-text-primary hover:bg-surface-1`}>
                          <ExternalLink size={12} className="flex-shrink-0" />
                          {item.name}
                        </a>
                      </li>
                    );
                  }
                  if (item.anchor) {
                    return (
                      <li key={item.href}>
                        <a href={item.href}
                          className={`${base} ${'highlight' in item && item.highlight
                            ? 'text-cyan-primary bg-cyan-primary/[0.08] font-semibold'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'}`}>
                          {'highlight' in item && item.highlight && <Map size={12} className="flex-shrink-0" />}
                          {item.name}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link href={item.href}
                        className={`${base} ${item.href === '/docs'
                          ? 'bg-cyan-primary/10 text-cyan-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'}`}>
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 px-12 py-12 max-w-[900px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">

          {/* ── Welcome ── */}
          <section>
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Introduction</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-4">Welcome to Aegis Documentation</h1>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Aegis is a decentralized trust layer for autonomous AI agents on Sui. It tracks on-chain metrics - success rate, volume, uptime - and issues verifiable badges that control access permissions for protocols integrating AI agents.
            </p>

            {/* Roadmap banner */}
            <a href="#roadmap" className="block rounded-2xl p-4 bg-cyan-primary/[0.06] border border-cyan-primary/25 hover:border-cyan-primary/50 transition-all group mb-8">
              <div className="flex items-center gap-3">
                <Map size={18} className="text-cyan-primary flex-shrink-0" />
                <div>
                  <p className="font-semibold text-cyan-primary text-sm">Phase 2 Roadmap Available</p>
                  <p className="text-text-muted text-xs">Dynamic Trust, Autonomous Contingency &amp; Cost-Efficient Monitoring</p>
                </div>
                <ArrowRight size={16} className="text-cyan-primary ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </a>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Zap, label: 'Quick Start', desc: 'Get running in 5 minutes', href: '/developer', color: 'text-cyan-primary', bg: 'bg-cyan-primary/[0.06]' },
                { icon: HelpCircle, label: 'FAQ', desc: 'Common questions answered', href: '/docs/faq', color: 'text-mint-secondary', bg: 'bg-mint-secondary/[0.06]' },
                { icon: FileText, label: 'Terms & Privacy', desc: 'Legal information', href: '/docs/terms', color: 'text-text-muted', bg: 'bg-surface-2' },
              ].map(({ icon: Icon, label, desc, href, color, bg }) => (
                <Link key={label} href={href}
                  className="rounded-2xl p-5 glass-card-matte hover:-translate-y-1 hover:border-cyan-primary/20 transition-all duration-300">
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center mb-4 ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <p className="font-semibold text-text-primary text-sm mb-1">{label}</p>
                  <p className="text-text-muted text-xs">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Quickstart ── */}
          <section>
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Quickstart</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Quickstart</h2>
            <p className="text-text-secondary text-sm mb-6">Everything you need to integrate Aegis in your agent or protocol.</p>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-surface-0/60 p-5 mb-5">
              <h3 className="font-semibold text-text-primary text-sm mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-mint-secondary" /> Prerequisites
              </h3>
              <ul className="space-y-2">
                {[
                  'Sui Wallet installed (Slipstream or Sui Wallet extension)',
                  'Node.js 18+ and pnpm/yarn',
                  'Environment variables configured (see .env.local.example)',
                  'Testnet SUI tokens - fund via faucet.testnet.sui.io',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-primary/60 mt-1.5 flex-shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <h3 className="font-semibold text-text-primary text-sm mb-3">Step-by-step Setup</h3>
            <div className="space-y-3 mb-5">
              {[
                { n: '1', title: 'Install the SDK', code: 'npm install @aegis/sdk\n# or\npnpm add @aegis/sdk' },
                { n: '2', title: 'Configure wallet connection', code: `import { SuiClient, getFullNodeUrl } from '@mysten/sui/client';\nimport { PACKAGE_ID, BADGE_REGISTRY_ID } from '@aegis/sdk';\n\nconst client = new SuiClient({ url: getFullNodeUrl('testnet') });` },
                { n: '3', title: 'Deploy your ReputationObject', code: `import { registerAgent } from '@aegis/sdk';\n\n// Simulates: sui client call --function register_agent\nconst { objectId } = await registerAgent(signer);\nconsole.log('ReputationObject:', objectId);` },
                { n: '4', title: 'Record executions with error handling', code: `import { recordExecution } from '@aegis/sdk';\n\ntry {\n  await recordExecution(signer, objectId, true, 1_000_000_000, 50);\n} catch (err) {\n  if (err.code === 'BADGE_REVOKED') activateBackupAgent();\n}` },
                { n: '5', title: 'Verify badge status on explorer', code: `import { checkBadgeStatus } from '@aegis/sdk';\n\nconst { badge, isValid } = await checkBadgeStatus(agentId);\nconsole.log(\`Badge: \${badge}, Valid: \${isValid}\`);\n// Verify on: suiexplorer.com/testnet/object/\${objectId}` },
              ].map(({ n, title, code }) => (
                <div key={n} className="rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-0">
                    <span className="w-6 h-6 rounded-full bg-cyan-primary/15 text-cyan-primary font-mono text-xs font-bold flex items-center justify-center">{n}</span>
                    <span className="font-semibold text-text-primary text-sm">{title}</span>
                  </div>
                  <pre className="px-5 py-3 font-mono text-xs text-cyan-primary leading-relaxed whitespace-pre overflow-x-auto bg-bg-base border-t border-[rgba(255,255,255,0.05)]">{code}</pre>
                </div>
              ))}
            </div>
          </section>

          {/* ── Key Concepts ── */}
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-5">Key Concepts</h2>
            <div className="rounded-2xl glass-card-heavy divide-y divide-[rgba(255,255,255,0.06)]">
              {[
                { label: 'Reputation System', desc: 'On-chain metrics that track agent performance - executions, success rate, slippage, uptime', href: '/agents', internal: true },
                { label: 'Badge Registry', desc: 'Bronze (LVL 1), Silver (LVL 3), Gold (LVL 5) - access-level certifications issued on-chain', href: '/badges', internal: true },
                { label: 'Aegis Score', desc: 'Multi-dimensional score: Performance 37% + Reliability 28% - Risk Penalty + Contribution 10%', href: '/leaderboard', internal: true },
                { label: 'Auto-Revocation', desc: 'On-chain enforcement - >5 consecutive failures, <50% success rate, or >500 BPS slippage triggers instant credential revocation', href: '/badges', internal: true },
                { label: 'MemWal Audit Trail', desc: 'Encrypted private memory for agent reasoning; blob_id anchored in ReputationObject for full traceability', href: 'https://docs.memwal.ai/', internal: false },
              ].map(({ label, desc, href, internal }) => (
                <div key={label} className="px-5 py-4 flex items-start gap-4">
                  <Shield size={14} className="text-cyan-primary flex-shrink-0 mt-0.5" />
                  <div>
                    {internal
                      ? <Link href={href} className="font-semibold text-sm text-cyan-primary hover:text-mint-secondary transition-colors">{label}</Link>
                      : <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-cyan-primary hover:text-mint-secondary transition-colors">{label}</a>}
                    <p className="text-text-secondary text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── API Reference ── */}
          <section id="api">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">API Reference</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">API Reference</h2>
            <p className="text-text-secondary text-sm mb-6">Complete SDK function signatures. All functions are async and target Sui Testnet.</p>

            <div className="space-y-8">
              {/* recordExecution */}
              <div>
                <h3 className="font-mono text-base font-bold text-cyan-primary mb-1">recordExecution(params)</h3>
                <p className="text-text-secondary text-sm mb-4">Records an agent execution event on-chain. Updates metrics and checks badge eligibility/revocation.</p>
                <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] mb-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
                        {['Parameter', 'Type', 'Required', 'Description', 'Example'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-text-muted font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                      {[
                        { p: 'objectId', t: 'string', req: true, d: 'Address of the ReputationObject', ex: '"0x4CD8BE..."' },
                        { p: 'success', t: 'boolean', req: true, d: 'Outcome of the execution', ex: 'true' },
                        { p: 'volume', t: 'number', req: false, d: 'Volume in MIST (1 SUI = 10⁹)', ex: '1000000000' },
                        { p: 'slippage', t: 'number', req: false, d: 'Slippage in BPS (100 = 1%)', ex: '50' },
                        { p: 'metadata', t: 'object', req: false, d: 'Extra data for audit trail', ex: '{ pool: "SUI/USDC" }' },
                      ].map(({ p, t, req, d, ex }) => (
                        <tr key={p} className="bg-surface-1/50">
                          <td className="px-4 py-3 font-mono text-cyan-primary">`{p}`</td>
                          <td className="px-4 py-3 font-mono text-mint-secondary/80">`{t}`</td>
                          <td className="px-4 py-3">{req ? '✅' : '❌'}</td>
                          <td className="px-4 py-3 text-text-secondary">{d}</td>
                          <td className="px-4 py-3 font-mono text-text-muted">{ex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-text-muted text-xs mb-1"><strong className="text-text-secondary">Returns:</strong> <code className="text-cyan-primary">Promise&lt;ExecutionReceipt&gt;</code></p>
                <p className="text-text-muted text-xs mb-3"><strong className="text-text-secondary">Errors:</strong> <code className="text-red-400">BadgeRevokedError</code>, <code className="text-red-400">AccessLevelError</code>, <code className="text-red-400">RateLimitError</code></p>
                <CodeBlock lang="typescript" code={`try {
  await recordExecution({ objectId, success: true, volume: 1e9 });
} catch (err) {
  if (err instanceof BadgeRevokedError) {
    // Trigger fallback logic
    await activateBackupAgent();
  }
}`} />
              </div>

              {/* registerAgent */}
              <div>
                <h3 className="font-mono text-base font-bold text-cyan-primary mb-1">registerAgent(signer)</h3>
                <p className="text-text-secondary text-sm mb-3">Deploys a new ReputationObject on-chain. Called once per agent identity.</p>
                <CodeBlock code={`const { objectId, digest } = await registerAgent(signer);
// objectId = your permanent on-chain identity
// digest = transaction hash for verification`} />
              </div>

              {/* computeAegisScore */}
              <div>
                <h3 className="font-mono text-base font-bold text-cyan-primary mb-1">computeAegisScore(data)</h3>
                <p className="text-text-secondary text-sm mb-3">Client-side scoring function. Returns multi-dimensional score without any additional RPC calls.</p>
                <CodeBlock code={`import { computeAegisScore, getAgentReputation } from '@aegis/sdk';

const rep = await getAgentReputation(objectId);
const result = computeAegisScore(rep);

console.log(result.score);            // e.g. 98.4
console.log(result.tier);             // 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Unranked'
console.log(result.status);           // 'Active' | 'Supervised' | 'Under Review' | 'Quarantined'
console.log(result.breakdown);        // { performance, reliability, riskPenalty, contribution }`} />
              </div>

              {/* getBadgeEligibility */}
              <div>
                <h3 className="font-mono text-base font-bold text-cyan-primary mb-1">getBadgeEligibility(objectId)</h3>
                <p className="text-text-secondary text-sm mb-3">Returns which badges the agent qualifies for based on current on-chain metrics.</p>
                <CodeBlock code={`const { bronze, silver, gold } = await getBadgeEligibility(objectId);
// bronze: 10+ execs, 80%+ success
// silver: 50+ execs, 90%+ success
// gold:   200+ execs, 95%+ success, $1M+ volume`} />
              </div>
            </div>
          </section>

          {/* ── Integration Guides ── */}
          <section id="integrations">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Integration Guides</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Integration Guides by Use Case</h2>
            <p className="text-text-secondary text-sm mb-6">How real protocols integrate Aegis across different agent architectures.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: BarChart2, title: 'Agentic Trading Bot', audience: 'Bot Developers',
                  color: 'text-cyan-primary', bg: 'bg-cyan-primary/[0.06]', border: 'border-cyan-primary/20',
                  items: ['Register agent before first trade', 'Record each trade with success + volume + slippage', 'Auto-revoke on >5 consecutive losses', 'Use computeAegisScore() to optimize strategy'],
                },
                {
                  icon: Layers, title: 'Yield Aggregator', audience: 'DeFi Protocols',
                  color: 'text-mint-secondary', bg: 'bg-mint-secondary/[0.06]', border: 'border-mint-secondary/20',
                  items: ['Whitelist only Gold/Silver agents per vault', 'Implement hybrid fallback via find_best_backup()', 'Circuit breakers: cap loss per epoch at 5%', 'Monitor BadgeRevokedEvent for instant swap'],
                },
                {
                  icon: Globe, title: 'Oracle Network', audience: 'Infrastructure',
                  color: 'text-purple-400', bg: 'bg-purple-400/[0.06]', border: 'border-purple-400/20',
                  items: ['Track uptime score as primary KPI', 'Record execution for every price feed update', 'Slashing conditions tied to slippage BPS', 'Leaderboard exposes oracle ranking'],
                },
                {
                  icon: Cpu, title: 'GameFi Agent', audience: 'Game Developers',
                  color: 'text-yellow-400', bg: 'bg-yellow-400/[0.06]', border: 'border-yellow-400/20',
                  items: ['Session-based reputation per game match', 'Player-agent interaction logged on-chain', 'Bronze badge = entry level, Gold = pro tier', 'Integrate badges into in-game UI via SDK'],
                },
              ].map(({ icon: Icon, title, audience, color, bg, border, items }) => (
                <div key={title} className={`rounded-2xl border ${border} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${bg}`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div>
                      <p className={`font-display font-bold text-sm ${color}`}>{title}</p>
                      <p className="text-text-muted text-[10px] uppercase tracking-widest">{audience}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map(t => (
                      <li key={t} className="flex items-start gap-2 text-xs text-text-secondary">
                        <ChevronRight size={10} className={`${color} flex-shrink-0 mt-0.5`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Local Dev & Testing ── */}
          <section id="testing">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Testing</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Local Development &amp; Testing</h2>
            <p className="text-text-secondary text-sm mb-5">Run a full local environment before deploying to testnet.</p>

            <h3 className="font-semibold text-text-primary text-sm mb-3">Testnet Configuration</h3>
            <CodeBlock lang="bash" code={`# Switch to Sui Testnet
sui client switch --env testnet

# Fund your wallet (faucet)
curl https://faucet.testnet.sui.io/gas?address=0xYOUR_ADDRESS

# Verify balance
sui client balance`} />

            <div className="my-5" />
            <h3 className="font-semibold text-text-primary text-sm mb-3">Mocking Aegis for Unit Tests</h3>
            <CodeBlock code={`import { mockAegisProvider } from '@aegis/sdk/testing';

const mock = mockAegisProvider({
  defaultBadge: 'gold',
  autoRevoke: false,
  simulatedLatency: 200,
});

test('agent executes with gold badge', async () => {
  const agent = await mock.registerAgent();
  expect(await agent.getBadge()).toBe('gold');
});`} />

            <div className="my-5" />
            <h3 className="font-semibold text-text-primary text-sm mb-3">Running Integration Tests</h3>
            <CodeBlock lang="bash" code={`# Run against live testnet
pnpm test:integration --network=testnet --agent=mock

# Simulate revocation flow
pnpm test:revocation --scenario=consecutive-failures

# Stress test (volume spike)
pnpm test:stress --duration=60s --rps=100`} />
          </section>

          {/* ── MemWal ── */}
          <section>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
              <Lock size={18} className="text-cyan-primary" /> MemWal Integration
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Aegis works seamlessly with{' '}
              <a href="https://docs.memwal.ai/" target="_blank" rel="noopener" className="text-cyan-primary hover:text-mint-secondary underline">MemWal</a>{' '}
              for private agent memory:
            </p>
            <ul className="space-y-2 mb-5">
              {[
                { label: 'Private rationale', desc: "Agent's reasoning stays encrypted in Walrus" },
                { label: 'Public metrics', desc: 'Success/slippage verified on-chain by Aegis' },
                { label: 'Linked audit trail', desc: 'MemWal blob_id anchored in ReputationObject' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-primary mt-1.5 flex-shrink-0" />
                  <span><strong className="text-text-primary">{label}</strong> - <span className="text-text-secondary">{desc}</span></span>
                </li>
              ))}
            </ul>
            <CodeBlock code={`import { logExecution } from '@aegis/sdk';
import { memwalService } from '@aegis/sdk';

// 1. Store decision rationale in MemWal (private)
await memwalService.storeRationale({
  agentId: '0x...',
  reasoning: 'Market conditions favorable',
  decision: 'Execute with conservative slippage'
});

// 2. Record execution publicly on Aegis (on-chain)
await recordExecution(signer, objectId, true, 1_000_000_000, 50);
// blob_id is automatically anchored in the ReputationObject`} />
          </section>

          {/* ── Troubleshooting ── */}
          <section id="troubleshooting">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Troubleshooting</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Troubleshooting &amp; Error Codes</h2>
            <p className="text-text-secondary text-sm mb-5">Common errors returned by the SDK and how to resolve them.</p>
            <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
                    {['Error Code', 'HTTP', 'Likely Cause', 'Solution'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-text-muted font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {[
                    { code: 'BADGE_REVOKED', http: '403', cause: 'Agent lost certification after metric drop', solution: 'Activate backup agent or rebuild metrics (100+ consecutive successes)' },
                    { code: 'ACCESS_LEVEL_INSUFFICIENT', http: '403', cause: 'Operation requires LVL 5 but agent holds Silver (LVL 3)', solution: 'Upgrade agent badge or reduce the permission requirement' },
                    { code: 'RATE_LIMIT_EXCEEDED', http: '429', cause: '>100 recordExecution calls/min per agent', solution: 'Implement exponential backoff with jitter' },
                    { code: 'INVALID_SIGNATURE', http: '401', cause: 'Wallet not authorized to sign this transaction', solution: 'Verify connected wallet owns the ReputationObject' },
                    { code: 'OBJECT_NOT_FOUND', http: '404', cause: 'ReputationObject ID is wrong or pruned', solution: 'Re-fetch objectId from registerAgent() or sui_getObject' },
                  ].map(({ code, http, cause, solution }) => (
                    <tr key={code} className="bg-surface-1/40">
                      <td className="px-4 py-3"><span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">{code}</span></td>
                      <td className="px-4 py-3 font-mono text-text-muted">{http}</td>
                      <td className="px-4 py-3 text-text-secondary">{cause}</td>
                      <td className="px-4 py-3 text-text-secondary">{solution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Security ── */}
          <section id="security">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-text-primary">Security</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-text-primary mb-2">Security Best Practices</h2>
            <p className="text-text-secondary text-sm mb-5">Essential checklist for DeFi protocols integrating Aegis.</p>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 mb-5">
              <h3 className="font-semibold text-text-primary text-sm mb-3">Protocol Integrator Checklist</h3>
              <ul className="space-y-2">
                {[
                  'Always validate agent via contract_address - never trust display name alone',
                  'Implement circuit breakers for losses >X% per epoch',
                  'Maintain whitelist of pre-approved backup agents (Gold/Silver only)',
                  'Sign all critical transactions with multi-sig',
                  'Monitor BadgeRevokedEvent in real-time and trigger fallback automatically',
                  'Test fallback flow in staging environment before deploying to production',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle size={13} className="text-mint-secondary flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5">
              <h3 className="font-semibold text-yellow-400 text-sm mb-3">Common Pitfalls</h3>
              <ul className="space-y-2">
                {[
                  'Do NOT use agent name as unique identifier - use contract address + Badge ID',
                  'Do NOT ignore "Score Drop" alerts - they often precede revocation within hours',
                  'Do NOT hardcode agent addresses - use dynamic registry lookup at runtime',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Roadmap ── */}
          <section id="roadmap">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-cyan-primary">Roadmap</span>
            </div>

            {/* Banner */}
            <div className="rounded-2xl p-6 mb-8 bg-gradient-to-br from-cyan-primary/[0.10] to-mint-secondary/[0.05] border border-cyan-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <Map size={22} className="text-cyan-primary" />
                <h2 className="font-display text-2xl font-bold text-text-primary">Aegis Protocol - Phase 2 Roadmap</h2>
              </div>
              <p className="text-text-secondary text-sm">
                <strong className="text-cyan-primary">Theme:</strong> Dynamic Trust, Autonomous Contingency &amp; Cost-Efficient Monitoring
              </p>
            </div>

            {/* Phase 1 Baseline */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-surface-0/40 p-5 mb-6">
              <h3 className="font-display font-bold text-text-primary text-base mb-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-mint-secondary" /> Phase 1 - Baseline (Functional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Agent registration with static badges (Gold/Silver/Bronze)',
                  'Contract address + display name identification',
                  'Manual or semi-automatic revocation',
                  'Simple on-chain event logging',
                  'External monitoring via static dashboard',
                ].map(t => (
                  <div key={t} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle size={12} className="text-mint-secondary flex-shrink-0 mt-0.5" />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2 Objective */}
            <div className="rounded-2xl border border-cyan-primary/25 bg-cyan-primary/[0.05] p-5 mb-8">
              <h3 className="font-display font-bold text-cyan-primary text-base mb-2">Phase 2 Objective</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Transform Aegis from a static certification system into a <strong className="text-text-primary">dynamic trust layer</strong>, enabling DeFi protocols to operate with automatic fallback, continuous on-chain evaluation, and cost-optimized monitoring.
              </p>
            </div>

            {/* 5 Modules */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Delivery Modules</h3>
            <div className="space-y-4 mb-10">
              {[
                {
                  n: '1', color: 'text-cyan-primary', border: 'border-cyan-primary/20', bg: 'bg-cyan-primary/[0.04]',
                  title: 'Dynamic Badge Registry & Auto-Revocation',
                  rows: [
                    { k: 'Onboarding Text', v: 'Institutional explanation (max 10 lines) covering continuous evaluation, access tiers, and auto-revocation triggers.' },
                    { k: 'Revocation Pipeline', v: 'Detection → On-chain Invalidation → LVL 0 Downgrade → Quarantine → Audit Log → Notification → Conditional Reinstatement.' },
                    { k: 'Canonical Identity', v: 'Contract Address + Badge ID = unique identity. Display name is UX only - never use for validation.' },
                    { k: 'On-chain Evaluators', v: 'Pluggable contracts evaluating: Success Rate, Volume, Uptime, Slippage, Security Flags.' },
                  ],
                },
                {
                  n: '2', color: 'text-yellow-400', border: 'border-yellow-400/20', bg: 'bg-yellow-400/[0.04]',
                  title: 'Dynamic Leaderboard & Aegis Score Classifier',
                  rows: [
                    { k: 'Score Formula', v: 'Aegis Score = Performance (37%) + Reliability (28%) - Risk Penalty + Contribution (10%)' },
                    { k: 'Dynamic Tiers', v: 'Platinum (95–100), Gold (85–94), Silver (70–84), Bronze (50–69), Unranked (<50)' },
                    { k: 'Adjustment Triggers', v: 'Real-time updates on: success rate drop, 5+ consecutive failures, slippage >500 BPS, security flag.' },
                    { k: 'Frontend Columns', v: 'Rank, Agent, Badge, Aegis Score, Success %, Volume, Uptime, Status, Trend (7D).' },
                  ],
                },
                {
                  n: '3', color: 'text-mint-secondary', border: 'border-mint-secondary/20', bg: 'bg-mint-secondary/[0.04]',
                  title: 'Contingency & Fallback for DeFi Protocols',
                  rows: [
                    { k: 'Hybrid Logic', v: 'Auto-Swap for technical failures. Supervised/Paused mode for security anomalies.' },
                    { k: 'Dynamic Selection', v: 'find_best_backup() queries Aegis Registry and promotes highest-score whitelisted agent.' },
                    { k: 'Circuit Breakers', v: 'Loss caps per epoch, slippage caps, time-locks for lower tiers, grace periods for temp oscillations.' },
                    { k: 'Weighted Allocation', v: 'Capital proportional to Aegis Score: allocation[i] = (score[i] / Σscores) * TVL' },
                  ],
                },
                {
                  n: '4', color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/[0.04]',
                  title: 'Smart Alert System (Cost-Optimized)',
                  rows: [
                    { k: 'Info (🔵)', v: 'Score -10% → Discord/Telegram webhook. $0 cost. Continuous monitoring.' },
                    { k: 'Warn (🟡)', v: 'Timeout/Inoperative → Slack/PagerDuty. $0–$25/mo. Prepare intervention.' },
                    { k: 'Critical (🔴)', v: 'Auto-Swap Executed → Email + On-Chain Event. ~$0. Validate takeover.' },
                    { k: 'Emergency (🛑)', v: 'No valid backup → SMS/Voice (Twilio). ~$0.50–$1.50/alert. Immediate human response.' },
                  ],
                },
                {
                  n: '5', color: 'text-orange-400', border: 'border-orange-400/20', bg: 'bg-orange-400/[0.04]',
                  title: 'Integration SDK & Developer Tools',
                  rows: [
                    { k: 'Smart Contract Templates', v: 'Ready-to-use modules: AgentManager, FallbackRouter, CircuitBreaker.' },
                    { k: 'Event Schema', v: 'AgentRevokedEvent, FallbackActivatedEvent, ScoreChangeEvent - standard across protocols.' },
                    { k: 'Developer Docs', v: 'Integration guides, hybrid fallback examples, security best practices.' },
                    { k: 'Testnet & Stress Tests', v: 'Simulated revocation, auto-swap, backup failure, volume spikes.' },
                  ],
                },
              ].map(({ n, color, border, bg, title, rows }) => (
                <div key={n} className={`rounded-2xl border ${border} ${bg} overflow-hidden`}>
                  <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3">
                    <span className={`font-mono text-sm font-bold ${color}`}>{n}.</span>
                    <h4 className={`font-display font-bold text-sm ${color}`}>{title}</h4>
                  </div>
                  <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                    {rows.map(({ k, v }) => (
                      <div key={k} className="grid grid-cols-[160px_1fr] gap-4 px-5 py-3">
                        <span className="font-mono text-[11px] text-text-muted font-semibold">{k}</span>
                        <span className="text-text-secondary text-xs leading-relaxed">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Suggested Timeline (10 Weeks)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-10">
              {[
                { weeks: '1–2', title: 'Core Scoring', desc: 'Aegis Score engine, on-chain evaluators, dynamic tier thresholds' },
                { weeks: '3–4', title: 'Auto-Revocation', desc: 'Complete revocation flow, identity clarification, audit logging' },
                { weeks: '5–6', title: 'Leaderboard', desc: 'Score visualization, trend indicators, real-time updates' },
                { weeks: '7–8', title: 'Fallback & Breakers', desc: 'Hybrid swap logic, dynamic backup selector, safety limits' },
                { weeks: '9–10', title: 'Alerts & SDK Release', desc: 'Off-chain indexer, debounce, tiered routing, docs, audit' },
              ].map(({ weeks, title, desc }, i) => (
                <div key={weeks} className="rounded-xl border border-[rgba(255,255,255,0.08)] p-4 relative">
                  <div className="font-mono text-[10px] text-cyan-primary/60 uppercase tracking-widest mb-1">Week {weeks}</div>
                  <div className="font-semibold text-text-primary text-xs mb-1">{title}</div>
                  <div className="text-text-muted text-[10px] leading-relaxed">{desc}</div>
                  {i < 4 && <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">→</div>}
                </div>
              ))}
            </div>

            {/* KPIs */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Success KPIs (Phase 2)</h3>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-5">
              <ul className="space-y-2.5">
                {[
                  '100% of badges and scores updated on-chain in real-time',
                  'MTTR (Mean Time to Recovery) < 5 minutes for critical failures',
                  'Zero false emergency alerts after debounce logic is applied',
                  '3+ protocols integrated with active hybrid fallback',
                  'Monitoring OPEX ≤ $15/month in normal operation',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle size={13} className="text-mint-secondary flex-shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ── Sustainability & Business Model ── */}
          <section id="sustainability">
            <div className="flex items-center gap-2 text-text-muted text-xs font-mono mb-3">
              <span>Docs</span><ChevronRight size={12} /><span className="text-cyan-primary">Sustainability</span>
            </div>

            {/* Banner */}
            <div className="rounded-2xl p-6 mb-8 bg-gradient-to-br from-mint-secondary/[0.08] to-cyan-primary/[0.05] border border-mint-secondary/25">
              <div className="flex items-center gap-4 mb-3">
                <img src="/icons/flow-globe.png" alt="Sustainability" className="w-10 h-10 object-contain flex-shrink-0" />
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary">Sustainability &amp; Incentives</h2>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Business Model</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                Aegis is designed to be self-sustaining: the better agents perform, the more value the ecosystem creates - for everyone.
              </p>
            </div>

            {/* Free during hackathon callout */}
            <div className="rounded-2xl p-4 mb-8 bg-cyan-primary/[0.06] border border-cyan-primary/25 flex items-start gap-3">
              <Zap size={16} className="text-cyan-primary flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary text-sm leading-relaxed">
                <strong className="text-cyan-primary">During the hackathon and testnet phase, all Aegis services are 100% free.</strong> Economic mechanisms will be introduced gradually with community governance.
              </p>
            </div>

            {/* Value Flow */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-5">How Value Flows</h3>
            <div className="rounded-2xl glass-card-heavy p-6 mb-8 overflow-x-auto">
              <div className="flex items-center justify-between gap-1 min-w-[540px]">
                {[
                  { label: 'Protocols', sub: 'Pay small fee', color: 'border-cyan-primary/30 bg-cyan-primary/[0.07]', text: 'text-cyan-primary' },
                  { label: 'Aegis Treasury', sub: 'Collects & routes', color: 'border-mint-secondary/30 bg-mint-secondary/[0.07]', text: 'text-mint-secondary' },
                  { label: 'Agent Rewards', sub: 'High performers', color: 'border-yellow-400/30 bg-yellow-400/[0.07]', text: 'text-yellow-400' },
                  { label: 'Gold Agents', sub: 'Maintain badges', color: 'border-purple-400/30 bg-purple-400/[0.07]', text: 'text-purple-400' },
                  { label: 'Better Protocols', sub: 'Reliable agents', color: 'border-cyan-primary/30 bg-cyan-primary/[0.07]', text: 'text-cyan-primary' },
                ].map((node, i, arr) => (
                  <div key={node.label} className="flex items-center gap-1 flex-1 min-w-0">
                    <div className={`flex-1 rounded-xl border ${node.color} p-3 text-center min-w-0`}>
                      <p className={`font-display font-bold text-[11px] ${node.text} leading-tight`}>{node.label}</p>
                      <p className="text-text-muted text-[9px] font-mono uppercase tracking-wide mt-0.5 leading-tight">{node.sub}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight size={12} className="text-text-muted flex-shrink-0" />
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-1 ml-1">
                  <ArrowRight size={12} className="text-text-muted flex-shrink-0 rotate-180" />
                  <span className="text-text-muted text-[9px] font-mono tracking-wide">↺</span>
                </div>
              </div>
            </div>

            {/* Revenue Sources */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Revenue Sources</h3>
            <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] mb-8">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
                    {['Source', 'Description', 'Stage'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-text-muted font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {[
                    {
                      icon: <img src="/icons/stat-success.png" className="w-6 h-6 object-contain mix-blend-screen" alt="" />,
                      source: 'Protocol Integration Fee',
                      desc: 'Small % on verified executions - waived during hackathon/testnet',
                      stage: 'Post-Mainnet',
                      stageCls: 'text-text-muted bg-surface-2 border-[rgba(255,255,255,0.1)]',
                    },
                    {
                      icon: <TrendingUp size={16} className="text-mint-secondary" />,
                      source: 'Premium Analytics',
                      desc: 'Advanced dashboards & alerting for enterprise users',
                      stage: 'Roadmap Q3',
                      stageCls: 'text-cyan-primary bg-cyan-primary/10 border-cyan-primary/20',
                    },
                    {
                      icon: <Globe size={16} className="text-purple-400" />,
                      source: 'Grant-Funded Development',
                      desc: 'Ecosystem grants from Sui Foundation & ecosystem partners',
                      stage: 'Active',
                      stageCls: 'text-mint-secondary bg-mint-secondary/10 border-mint-secondary/20',
                    },
                  ].map(({ icon, source, desc, stage, stageCls }) => (
                    <tr key={source} className="bg-surface-1/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 flex items-center justify-center">{icon}</div>
                          <span className="font-semibold text-text-primary text-xs">{source}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-text-secondary leading-relaxed">{desc}</td>
                      <td className="px-5 py-4">
                        <span className={`font-mono text-[10px] px-2 py-1 rounded-full border ${stageCls}`}>{stage}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agent Incentives */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Agent Incentives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  img: '/icons/incentive-trophy.png',
                  title: 'Gold Badge Agents',
                  desc: 'Priority access to high-value protocols + potential reward sharing from Aegis Treasury',
                  color: 'text-yellow-400', border: 'border-yellow-400/20', bg: 'bg-yellow-400/[0.06]',
                },
                {
                  icon: <TrendingUp size={18} className="text-mint-secondary" />,
                  title: 'Performance-Based',
                  desc: 'Fees and rewards scale with Aegis Score - bad actors earn nothing and face auto-revocation',
                  color: 'text-mint-secondary', border: 'border-mint-secondary/20', bg: 'bg-mint-secondary/[0.06]',
                },
                {
                  icon: <Shield size={18} className="text-cyan-primary" />,
                  title: 'No Pay-to-Play',
                  desc: 'Badges cannot be bought. Only earned via verifiable on-chain performance - no shortcuts',
                  color: 'text-cyan-primary', border: 'border-cyan-primary/20', bg: 'bg-cyan-primary/[0.06]',
                },
              ].map(({ img, icon, title, desc, color, border, bg }) => (
                <div key={title} className={`rounded-2xl border ${border} ${bg} p-5 flex flex-col gap-4`}>
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${bg} border ${border} overflow-hidden`}>
                    {img
                      ? <img src={img} alt={title} className="w-8 h-8 object-contain" />
                      : icon}
                  </div>
                  <div>
                    <p className={`font-display font-bold text-sm mb-1.5 ${color}`}>{title}</p>
                    <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transparency */}
            <h3 className="font-display font-bold text-text-primary text-lg mb-4">Transparency Commitment</h3>
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] p-5 mb-4">
              <ul className="space-y-3">
                {[
                  { icon: <CheckCircle size={14} className="text-mint-secondary" />, text: 'All fee structures and treasury movements are on-chain and fully auditable by anyone' },
                  { icon: <CheckCircle size={14} className="text-mint-secondary" />, text: 'Governance proposals required for any changes to economic parameters - no unilateral updates' },
                  { icon: <Clock size={14} className="text-cyan-primary" />, text: 'Public dashboard showing fee collection and distribution - coming Q2' },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <span className="flex-shrink-0 mt-0.5">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Revenue alignment note */}
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-4 flex items-start gap-3">
              <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-text-secondary text-xs leading-relaxed">
                <strong className="text-yellow-400">Revenue alignment:</strong> The model is deliberately designed so that Aegis only earns when agents perform well and protocols benefit - charging for revocations or bad outcomes would misalign incentives.
              </p>
            </div>
          </section>

          {/* ── Need Help ── */}
          <section className="border-t border-[rgba(255,255,255,0.06)] pt-12">
            <h2 className="font-display text-xl font-bold text-text-primary mb-5">Need Help?</h2>
            <ul className="space-y-2">
              {[
                { label: 'FAQ', href: '/docs/faq', internal: true },
                { label: 'Terms & Privacy', href: '/docs/terms', internal: true },
                { label: 'GitHub - Report issues or contribute', href: 'https://github.com/EdCryptoFi/aegis', internal: false },
                { label: 'Follow @aegisonchain on X', href: 'https://x.com/aegisonchain', internal: false },
              ].map(({ label, href, internal }) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <span className="w-1 h-1 rounded-full bg-cyan-primary" />
                  {internal
                    ? <Link href={href} className="text-cyan-primary hover:text-mint-secondary transition-colors">{label}</Link>
                    : <a href={href} target="_blank" rel="noopener" className="text-cyan-primary hover:text-mint-secondary transition-colors">{label}</a>}
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-8 border-t border-[rgba(255,255,255,0.06)] text-center">
              <p className="text-text-muted text-xs">© 2026 Aegis. Built for Sui Overflow Hackathon.</p>
              <p className="text-text-muted text-xs mt-1">Not audited. Use at your own risk.</p>
            </div>
          </section>

        </motion.div>
      </main>
    </div>
  );
}
