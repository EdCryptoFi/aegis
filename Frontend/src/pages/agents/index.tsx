'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NeuButton } from '@/components/NeuButton';
import { NeuCard } from '@/components/NeuCard';
import { PremiumBadge } from '@/components/PremiumBadge';
import { cardContainerVariants, cardItemVariants, fadeUpVariants } from '@/lib/animations';
import { ChevronLeft } from 'lucide-react';
import { config } from '../../config';

interface AgentInfo {
  objectId: string;
  agentId: string;
  totalExecutions: number;
  successfulExecutions: number;
  uptimeScore: number;
  totalVolume: number;
  isFlagged: boolean;
}

async function getAllAgents(): Promise<AgentInfo[]> {
  const demoAgents = [
    { objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'AlphaTrader', badge: 'gold' },
    { objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'BetaBot', badge: 'silver' },
    { objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', agentId: '0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1', name: 'GammaScam', badge: 'revoked' },
  ];

  const agents: AgentInfo[] = [];
  for (const demo of demoAgents) {
    try {
      const response = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sui_getObject',
          params: [demo.objectId, { showContent: true }],
        }),
      });
      const data = await response.json();
      if (data.result?.data?.content?.dataType === 'moveObject') {
        const fields = data.result.data.content.fields;
        agents.push({
          objectId: demo.objectId,
          agentId: fields.agent_id,
          totalExecutions: Number(fields.total_executions),
          successfulExecutions: Number(fields.successful_executions),
          uptimeScore: Number(fields.uptime_score),
          totalVolume: Number(fields.total_volume),
          isFlagged: fields.is_flagged,
        });
      }
    } catch (e) {
      console.error('Failed to fetch agent:', e);
    }
  }
  return agents;
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function getTrustLevel(agent: AgentInfo): string {
  if (agent.isFlagged) return 'FLAGGED';
  const successRate = agent.totalExecutions > 0
    ? (agent.successfulExecutions / agent.totalExecutions) * 100 : 100;
  if (successRate >= 95 && agent.totalExecutions >= 50) return 'HIGH';
  if (successRate >= 80 && agent.totalExecutions >= 10) return 'MEDIUM';
  return 'LOW';
}

function getTrustColor(level: string): string {
  switch (level) {
    case 'HIGH': return '#22c55e';
    case 'MEDIUM': return '#eab308';
    case 'LOW': return '#f97316';
    case 'FLAGGED': return '#ef4444';
    default: return '#888';
  }
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'uptime' | 'volume' | 'executions'>('uptime');

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setLoading(true);
    const data = await getAllAgents();
    setAgents(data);
    setLoading(false);
  }

  const sortedAgents = [...agents].sort((a, b) => {
    switch (sortBy) {
      case 'uptime': return b.uptimeScore - a.uptimeScore;
      case 'volume': return b.totalVolume - a.totalVolume;
      case 'executions': return b.totalExecutions - a.totalExecutions;
      default: return 0;
    }
  });

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyan-primary hover:text-mint-secondary transition-colors mb-6"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="font-display text-5xl font-bold text-text-primary mb-2">
            Registered Agents
          </h1>
          <p className="text-text-secondary text-lg">
            Explore all agents registered on Aegis
          </p>
        </div>

        {/* Controls */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-text-secondary text-sm uppercase tracking-wide">Sort by:</span>
            <div className="flex gap-2 flex-wrap">
              {(['uptime', 'volume', 'executions'] as const).map((option) => (
                <NeuButton
                  key={option}
                  variant={sortBy === option ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSortBy(option)}
                >
                  {option === 'uptime' ? 'Uptime' : option === 'volume' ? 'Volume' : 'Executions'}
                </NeuButton>
              ))}
            </div>
          </div>
          <div className="text-sm text-text-secondary">
            {agents.length} agent{agents.length !== 1 ? 's' : ''} found
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-3 border-white/10 border-t-cyan-primary rounded-full animate-spin mb-4" />
            <p className="text-text-secondary">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-text-secondary text-lg">No agents found</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedAgents.map((agent, i) => {
              const level = getTrustLevel(agent);
              const successRate = agent.totalExecutions > 0
                ? Math.round((agent.successfulExecutions / agent.totalExecutions) * 100) : 100;

              const trustColor = {
                'HIGH': 'success',
                'MEDIUM': 'warning',
                'LOW': 'danger',
                'FLAGGED': 'danger',
              } as const;

              return (
                <motion.div key={agent.objectId} variants={cardItemVariants}>
                  <Link href={`/agent/${agent.objectId}`}>
                    <NeuCard animated={false} variant="glass" padding="md" className="h-full">
                      <div className="space-y-4">
                        {/* Rank and Badge */}
                        <div className="flex items-start justify-between">
                          <div className="text-3xl font-bold font-display text-cyan-primary">
                            #{i + 1}
                          </div>
                          <PremiumBadge type={trustColor[level]} size="sm">
                            {level}
                          </PremiumBadge>
                        </div>

                        {/* Agent ID */}
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                            Agent ID
                          </p>
                          <p className="font-mono text-sm text-text-primary">
                            {agent.objectId.slice(0, 8)}...{agent.objectId.slice(-4)}
                          </p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="bg-cyan-primary/5 rounded-[8px] p-2">
                            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                              Uptime
                            </p>
                            <p className="font-display font-semibold text-text-primary text-sm">
                              {agent.uptimeScore}%
                            </p>
                          </div>
                          <div className="bg-mint-secondary/5 rounded-[8px] p-2">
                            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                              Success
                            </p>
                            <p className="font-display font-semibold text-text-primary text-sm">
                              {successRate}%
                            </p>
                          </div>
                          <div className="bg-purple-tertiary/5 rounded-[8px] p-2">
                            <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
                              Volume
                            </p>
                            <p className="font-mono font-semibold text-text-primary text-xs">
                              {formatVolume(agent.totalVolume)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </NeuCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}