'use client';

import { motion } from 'framer-motion';
import { Workflow, Database, Trophy, Code2, ArrowRight } from 'lucide-react';

const components = [
  {
    name: 'Reputation Object',
    desc: 'On-chain metrics tracked in Move smart contracts - executions, volume, slippage, uptime.',
    icon: Database,
    accent: 'text-cyan-primary',
    bg: 'bg-cyan-primary/[0.06]',
    border: 'border-cyan-primary/20',
  },
  {
    name: 'Walrus Memory',
    desc: 'Persistent execution history stored off-chain in Walrus decentralized storage, anchored on-chain.',
    icon: Workflow,
    accent: 'text-mint-secondary',
    bg: 'bg-mint-secondary/[0.06]',
    border: 'border-mint-secondary/20',
  },
  {
    name: 'Badge Registry',
    desc: 'NFT certificates issued as Kiosk objects on Sui - Bronze, Silver, Gold tiers with auto-revocation.',
    icon: Trophy,
    accent: 'text-yellow-400',
    bg: 'bg-yellow-400/[0.06]',
    border: 'border-yellow-400/20',
  },
  {
    name: 'SDK & API',
    desc: 'TypeScript SDK for seamless integration - register, record, check eligibility, mint badges.',
    icon: Code2,
    accent: 'text-purple-400',
    bg: 'bg-purple-400/[0.06]',
    border: 'border-purple-400/20',
  },
];

const flow = [
  { step: '01', title: 'Agent Execution', desc: 'AI agent executes trades on DeepBook DEX' },
  { step: '02', title: 'On-Chain Log', desc: 'Success/failure recorded in the ReputationObject via Move' },
  { step: '03', title: 'Persistent Storage', desc: 'Full history stored in Walrus, blob_id anchored on-chain' },
  { step: '04', title: 'Badge Unlock', desc: 'Milestones trigger badge mints in the Kiosk registry' },
];

const techStack = [
  { tech: 'Move', desc: 'Smart Contracts', icon: '⛓️', color: 'text-cyan-primary' },
  { tech: 'Sui SDK', desc: 'Blockchain Integration', icon: '🔗', color: 'text-mint-secondary' },
  { tech: 'TypeScript', desc: 'Backend & SDK', icon: '📝', color: 'text-purple-400' },
  { tech: 'Next.js', desc: 'Frontend', icon: '⚛️', color: 'text-text-primary' },
];

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-bg-base px-4 py-16 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-32 right-16 w-80 h-80 rounded-full blur-3xl bg-cyan-primary/[0.04]" />
        <div className="absolute bottom-16 left-16 w-72 h-72 rounded-full blur-3xl bg-purple-400/[0.04]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-4">System Design</p>
          <h1 className="font-display text-6xl md:text-7xl font-black mb-4 gradient-text-cyan">Architecture</h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">How Aegis works under the hood - from execution to reputation to badge.</p>
        </motion.div>

        {/* Core Components */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-10">Core Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {components.map((comp, i) => {
              const Icon = comp.icon;
              return (
                <motion.div
                  key={comp.name}
                  className={`rounded-2xl p-7 border ${comp.border} ${comp.bg} hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center mb-5 ${comp.bg} border ${comp.border}`}>
                    <Icon size={20} className={comp.accent} />
                  </div>
                  <h3 className={`font-display text-xl font-bold mb-2 ${comp.accent}`}>{comp.name}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{comp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Data Flow */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-10">Data Flow</h2>
          <div className="rounded-2xl glass-card-heavy p-8">
            <div className="space-y-0">
              {flow.map((item, i) => (
                <motion.div
                  key={item.step}
                  className="flex gap-5 pb-6 last:pb-0"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-cyan-primary/10 border border-cyan-primary/20">
                      <span className="font-mono text-xs font-bold text-cyan-primary">{item.step}</span>
                    </div>
                    {i < flow.length - 1 && (
                      <div className="w-px flex-1 mt-2 bg-gradient-to-b from-cyan-primary/20 to-transparent min-h-[24px]" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h4 className="font-semibold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-text-secondary text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-10">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((item, i) => (
              <motion.div
                key={item.tech}
                className="rounded-2xl p-6 glass-card-matte hover:-translate-y-1 hover:border-cyan-primary/20 transition-all duration-300 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="text-4xl block mb-3">{item.icon}</span>
                <p className={`font-display font-bold text-base mb-1 ${item.color}`}>{item.tech}</p>
                <p className="text-text-muted text-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}
