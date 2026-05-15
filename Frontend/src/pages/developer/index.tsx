'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, Copy, Check, Terminal, Zap, BookOpen, Lock, BarChart2, AlertTriangle } from 'lucide-react';
import { config } from '../../config';

export default function DeveloperPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div className="mb-12" initial="hidden" animate="visible" variants={fadeUp}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Code2 size={28} className="text-cyan-primary" />
            <h1 className="font-display text-5xl font-bold gradient-text-cyan">Developer Hub</h1>
          </div>
          <p className="text-text-secondary text-lg">Integrate your AI agent with Aegis</p>
        </motion.div>

        {/* Contract Addresses */}
        <motion.section
          className="mb-10"
          initial="hidden" animate="visible" variants={fadeUp}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Contract Addresses</h2>
          <div className="rounded-2xl glass-card-heavy divide-y divide-[rgba(255,255,255,0.06)]">
            {[
              { label: 'Package ID', value: config.packageId, id: 'package' },
              { label: 'BadgeRegistry', value: config.badgeRegistry, id: 'registry' },
            ].map(({ label, value, id }) => (
              <div key={id} className="flex items-center justify-between px-6 py-4 gap-4">
                <span className="text-text-muted text-sm min-w-[110px]">{label}</span>
                <code className="font-mono text-xs text-text-primary flex-1 truncate">{value}</code>
                <button
                  onClick={() => copyToClipboard(value, id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-cyan-primary/10 border border-[rgba(255,255,255,0.08)] hover:border-cyan-primary/30 text-text-secondary hover:text-cyan-primary text-xs font-medium transition-all"
                >
                  {copied === id ? <Check size={12} /> : <Copy size={12} />}
                  {copied === id ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
            <div className="flex items-center px-6 py-4 gap-4">
              <span className="text-text-muted text-sm min-w-[110px]">Network</span>
              <span className="font-mono text-xs font-bold text-cyan-primary">testnet</span>
            </div>
          </div>
        </motion.section>

        {/* Quick Start */}
        <motion.section className="mb-10" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Zap size={18} className="text-cyan-primary" /> Quick Start
          </h2>
          <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-6 overflow-x-auto">
            <pre className="font-mono text-sm text-cyan-primary leading-relaxed whitespace-pre">{`// 1. Register your agent
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
        </motion.section>

        {/* SDK Functions */}
        <motion.section className="mb-10" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">SDK Functions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'registerAgent()', desc: 'Create a new ReputationObject for your agent', tag: 'Returns', code: '{ digest: string, objectId: string }' },
              { name: 'recordExecution()', desc: 'Report execution results to build reputation', tag: 'Params', code: 'success: bool, volume: u64, slippage: u64' },
              { name: 'isEligibleForBadge()', desc: 'Check if agent meets badge requirements', tag: 'Params', code: 'badgeType: 1|2|3 (Bronze|Silver|Gold)' },
              { name: 'grantBadge()', desc: 'Request a badge from the registry', tag: 'Params', code: 'agentId, badgeType' },
              { name: 'getAgentReputation()', desc: 'Fetch agent metrics from blockchain', tag: 'Returns', code: 'ReputationData' },
              { name: 'checkAndRevokeInvalid()', desc: 'Trigger auto-revocation check — anyone can call', tag: null, code: null },
            ].map(({ name, desc, tag, code }) => (
              <div key={name} className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 transition-colors">
                <p className="font-mono text-sm font-semibold text-cyan-primary mb-1">{name}</p>
                <p className="text-text-secondary text-xs mb-3">{desc}</p>
                {tag && code && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-surface-2 text-text-muted text-[10px] font-semibold uppercase tracking-wide">{tag}</span>
                    <code className="font-mono text-xs text-text-primary">{code}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Badge Requirements Table */}
        <motion.section className="mb-10" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-cyan-primary" /> Badge Requirements
          </h2>
          <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
            <div className="grid grid-cols-4 px-5 py-3 bg-surface-0 border-b border-[rgba(255,255,255,0.06)]">
              {['Badge', 'Executions', 'Success Rate', 'Volume'].map(h => (
                <span key={h} className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {[
              { badge: '🥉 Bronze', execs: '10+', success: '80%+', volume: 'Any', color: 'text-amber-600' },
              { badge: '🥈 Silver', execs: '50+', success: '90%+', volume: 'Any', color: 'text-slate-300' },
              { badge: '🥇 Gold', execs: '200+', success: '95%+', volume: '$1M+', color: 'text-yellow-400' },
            ].map(({ badge, execs, success, volume, color }) => (
              <div key={badge} className="grid grid-cols-4 px-5 py-3.5 bg-surface-1 border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-surface-2/50 transition-colors">
                <span className={`font-semibold text-sm ${color}`}>{badge}</span>
                <span className="font-mono text-sm text-text-primary">{execs}</span>
                <span className="font-mono text-sm text-text-primary">{success}</span>
                <span className="font-mono text-sm text-text-primary">{volume}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Auto-revocation rules */}
        <motion.section className="mb-10" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" /> Auto-Revocation Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: '📉', title: 'Low Success Rate', desc: 'Agent flagged if success rate drops below 50%' },
              { icon: '❌', title: 'Consecutive Failures', desc: 'Agent flagged after 5+ consecutive failures' },
              { icon: '💸', title: 'High Slippage', desc: 'Agent flagged if slippage exceeds 500 BPS' },
              { icon: '🔄', title: 'Recovery', desc: 'Unflag after 100 consecutive successes' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-5 glass-card-matte flex gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-text-primary font-semibold text-sm mb-1">{title}</p>
                  <p className="text-text-secondary text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CLI Reference */}
        <motion.section className="mb-10" initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Terminal size={18} className="text-cyan-primary" /> CLI Reference
          </h2>
          <div className="rounded-2xl bg-bg-base border border-[rgba(255,255,255,0.08)] p-6 overflow-x-auto">
            <pre className="font-mono text-sm text-cyan-primary leading-relaxed whitespace-pre">{`# Register agent
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
        </motion.section>

        {/* Doc links */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeUp} viewport={{ once: true }}>
          <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-primary" /> Documentation
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📖', label: 'Integration Guide', href: '/docs/AGENT_INTEGRATION_GUIDE.md' },
              { icon: '⚡', label: 'Quick Start', href: '/docs/AGENT_QUICKSTART.md' },
              { icon: '📊', label: 'Performance Metrics', href: '/docs/AGENT_PERFORMANCE.md' },
              { icon: '🔒', label: 'Security Analysis', href: '/docs/SECURITY_ANALYSIS.md' },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="rounded-2xl p-5 glass-card-matte hover:bg-surface-2/60 hover:border-cyan-primary/20 hover:-translate-y-1 transition-all text-center flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-text-secondary text-xs font-medium leading-tight">{label}</span>
              </a>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
