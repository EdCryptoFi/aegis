'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NeuButton } from '@/components/NeuButton';
import { NeuCard } from '@/components/NeuCard';
import { PremiumInput } from '@/components/PremiumInput';
import { cardContainerVariants, cardItemVariants, fadeUpVariants } from '@/lib/animations';
import { Search } from 'lucide-react';

export default function Home() {
  return (
        <main className="min-h-screen bg-bg-base">
          <motion.header
            className="text-center mb-24 pt-20"
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-4"
            >
              <div className="inline-block h-1 w-12 bg-gradient-cyan-mint rounded-full mb-6" />
            </motion.div>
            <h1 className="font-display text-6xl font-bold text-text-primary mb-4">
              Aegis
            </h1>
            <p className="text-xl text-text-secondary font-medium">
              Trust is not asked. It's proven. On-chain.
            </p>
          </motion.header>

          <section className="w-full max-w-6xl mx-auto px-4 mb-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold text-text-primary">
                Quick Actions
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={cardContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { href: '/agents', icon: '👥', title: 'Browse Agents', desc: 'View all registered agents' },
                { href: '/leaderboard', icon: '🏆', title: 'Leaderboard', desc: 'Top performers ranked' },
                { href: '/badges', icon: '🏅', title: 'Badges', desc: 'Certified trust levels' },
                { href: '/developer', icon: '⚙️', title: 'For Developers', desc: 'Integrate your agent' },
              ].map((item) => (
                <motion.div key={item.href} variants={cardItemVariants}>
                  <Link href={item.href}>
                    <NeuCard animated={false} variant="glass" padding="md">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="text-4xl">{item.icon}</div>
                        <h3 className="font-display font-semibold text-text-primary text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                    </NeuCard>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <motion.section
            className="w-full max-w-2xl mx-auto px-4 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <NeuCard variant="glass" padding="lg">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                    Check Agent Reputation
                  </h2>
                  <p className="text-text-secondary">
                    Enter an agent address to check their reputation:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <PremiumInput
                      type="text"
                      placeholder="0x..."
                      id="agent-address"
                      icon={<Search size={16} />}
                      fullWidth
                    />
                  </div>
                  <NeuButton
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const input = document.getElementById('agent-address') as HTMLInputElement;
                      const address = input.value;
                      if (address) {
                        window.location.href = `/agent/${address}`;
                      }
                    }}
                  >
                    Check
                  </NeuButton>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-text-secondary uppercase tracking-wide mb-3">
                    Try with demo agents:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'AlphaTrader', addr: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc' },
                      { label: 'BetaBot', addr: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec' },
                      { label: 'GammaScam', addr: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', danger: true },
                    ].map((agent) => (
                      <button
                        key={agent.addr}
                        onClick={() => window.location.href = `/agent/${agent.addr}`}
                        className={`px-3 py-2 text-xs font-medium rounded-[8px] transition-all duration-200 border ${
                          agent.danger
                            ? 'border-error/30 text-error hover:bg-error/10 hover:border-error/50'
                            : 'border-cyan-primary/20 text-text-secondary hover:text-cyan-primary hover:border-cyan-primary/50 hover:bg-cyan-primary/5'
                        }`}
                      >
                        {agent.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </NeuCard>
          </motion.section>

          <motion.footer
            className="mt-32 pb-12 text-center text-text-secondary text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>Built for Sui Overflow 2026</p>
          </motion.footer>
        </main>
  );
}
