'use client';

import { motion } from 'framer-motion';
import { NeuCard } from '../../components/NeuCard';
import { AnimatedSection, AnimatedCard } from '../../components/AnimatedSection';
import Navbar from '../../components/Navbar';

export default function ArchitecturePage() {
  const components = [
    { name: 'Reputation Object', desc: 'On-chain metrics (Move)', icon: '📊', color: 'from-purple-400 to-pink-400' },
    { name: 'Walrus Memory', desc: 'Persistent history', icon: '💾', color: 'from-blue-400 to-cyan-400' },
    { name: 'Badge Registry', desc: 'NFT Certificates (Kiosk)', icon: '🏆', color: 'from-yellow-400 to-orange-400' },
    { name: 'SDK & API', desc: 'TypeScript integrations', icon: '⚙️', color: 'from-green-400 to-emerald-400' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white px-4 py-8">
      <Navbar />

      {/* BG Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Architecture
            </h1>
            <p className="text-slate-300 text-lg">How Aegis works under the hood</p>
          </div>
        </AnimatedSection>

        {/* Core Components */}
        <AnimatedSection delay={0.2} className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Core Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {components.map((comp, i) => (
              <AnimatedCard key={i} index={i}>
                <NeuCard className="group hover:shadow-2xl h-full">
                  <div className={`text-5xl mb-3 group-hover:scale-110 transition-transform`}>
                    {comp.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${comp.color} bg-clip-text text-transparent`}>
                    {comp.name}
                  </h3>
                  <p className="text-slate-300">{comp.desc}</p>
                </NeuCard>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>

        {/* Flow Diagram */}
        <AnimatedSection delay={0.4} className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Data Flow</h2>
          
          <NeuCard className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <div className="space-y-4">
              {[
                { step: '1', title: 'Agent Execution', desc: 'AI agent executes trades on DeepBook' },
                { step: '2', title: 'On-Chain Log', desc: 'Success/failure recorded in ReputationObject' },
                { step: '3', title: 'Persistent Storage', desc: 'Full history stored in Walrus' },
                { step: '4', title: 'Badge Unlock', desc: 'Milestones trigger badge mints' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4 items-start pb-4 border-b border-slate-700/50 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{item.title}</h4>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </NeuCard>
        </AnimatedSection>

        {/* Tech Stack */}
        <AnimatedSection delay={0.6}>
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Tech Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { tech: 'Move', desc: 'Smart Contracts', icon: '⛓️' },
              { tech: 'Sui SDK', desc: 'Blockchain Integration', icon: '🔗' },
              { tech: 'TypeScript', desc: 'Backend & SDK', icon: '📝' },
              { tech: 'Next.js', desc: 'Frontend', icon: '⚛️' },
            ].map((item, i) => (
              <AnimatedCard key={i} index={i}>
                <NeuCard className="text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h4 className="font-bold text-lg text-purple-400">{item.tech}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </NeuCard>
              </AnimatedCard>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="h-20" />
    </main>
  );
}
