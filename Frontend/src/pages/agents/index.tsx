'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, ChevronLeft, TrendingUp, BarChart2, Layers, ArrowRight, Zap } from 'lucide-react';
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

const DEMO_AGENTS: AgentInfo[] = [
  { objectId: '0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc', agentId: '0x8c8598ab', totalExecutions: 247, successfulExecutions: 244, uptimeScore: 99, totalVolume: 1_450_000_000_000, isFlagged: false },
  { objectId: '0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec', agentId: '0x8c8598ab', totalExecutions: 67, successfulExecutions: 62, uptimeScore: 95, totalVolume: 320_000_000_000, isFlagged: false },
  { objectId: '0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6', agentId: '0x8c8598ab', totalExecutions: 34, successfulExecutions: 14, uptimeScore: 41, totalVolume: 45_000_000_000, isFlagged: true },
];

async function getAllAgents(): Promise<AgentInfo[]> {
  // Fetch demo agents from server store
  let demoAgents: AgentInfo[] = [];
  try {
    const demoRes = await fetch('/api/agents/demo');
    const demoData = await demoRes.json();
    if (demoData.success && demoData.agents?.length > 0) {
      demoAgents = demoData.agents.map((a: any) => ({
        objectId: a.objectId,
        agentId: a.objectId,
        totalExecutions: a.totalExecutions,
        successfulExecutions: a.successfulExecutions,
        uptimeScore: a.uptimeScore,
        totalVolume: a.totalVolume,
        isFlagged: a.isFlagged,
      }));
    }
  } catch {}

  // Try to fetch from blockchain first
  try {
    const response = await fetch('https://fullnode.testnet.sui.io:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sui_getObject',
        params: [DEMO_AGENTS[0].objectId, { showContent: true }],
      }),
    });
    const data = await response.json();
    // If we get valid data, use it; otherwise fall back to demo data
    if (data.result?.data?.content?.dataType === 'moveObject') {
      const agents: AgentInfo[] = [];
      for (const demo of DEMO_AGENTS) {
        const res = await fetch('https://fullnode.testnet.sui.io:443', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'sui_getObject',
            params: [demo.objectId, { showContent: true }],
          }),
        });
        const d = await res.json();
        if (d.result?.data?.content?.dataType === 'moveObject') {
          const fields = d.result.data.content.fields;
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
      }
      if (agents.length > 0) {
        // Merge with demo agents, deduplicate by objectId
        const seen = new Set<string>();
        return [...agents, ...demoAgents].filter(a => {
          if (seen.has(a.objectId)) return false;
          seen.add(a.objectId);
          return true;
        });
      }
    }
  } catch (e) {
    console.log('Using demo data (fetch failed):', e);
  }
  // Return demo data + demo store agents
  const seen = new Set<string>();
  return [...DEMO_AGENTS, ...demoAgents].filter(a => {
    if (seen.has(a.objectId)) return false;
    seen.add(a.objectId);
    return true;
  });
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

const TRUST_PILL: Record<string, string> = {
  HIGH: 'bg-mint-secondary/10 text-mint-secondary border-mint-secondary/30',
  MEDIUM: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  LOW: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  FLAGGED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

type SortKey = 'uptime' | 'volume' | 'executions';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('uptime');
  const [limit, setLimit] = useState<10 | 20 | 100>(10);
  const [demoAgent, setDemoAgent] = useState<AgentInfo | null>(null);

  useEffect(() => {
    loadAgents();
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('aegis_demo_agent');
      if (raw) {
        try { setDemoAgent(JSON.parse(raw)); } catch {}
      }
    }
  }, []);

  async function loadAgents() {
    setLoading(true);
    const data = await getAllAgents();
    setAgents(data);
    setLoading(false);
  }

  const sortedAgents = [...agents]
    .sort((a, b) => {
      switch (sortBy) {
        case 'uptime': return b.uptimeScore - a.uptimeScore;
        case 'volume': return b.totalVolume - a.totalVolume;
        case 'executions': return b.totalExecutions - a.totalExecutions;
        default: return 0;
      }
    })
    .slice(0, limit);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'uptime', label: 'Uptime' },
    { key: 'volume', label: 'Volume' },
    { key: 'executions', label: 'Executions' },
  ];

  const LIMIT_OPTIONS: { value: 10 | 20 | 100; label: string }[] = [
    { value: 10, label: 'Top 10' },
    { value: 20, label: 'Top 20' },
    { value: 100, label: 'Top 100' },
  ];

  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cyan-primary hover:text-mint-secondary transition-colors mb-6">
            <ChevronLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users size={28} className="text-cyan-primary" />
              <h1 className="font-display text-5xl font-bold gradient-text-cyan">Registered Agents</h1>
            </div>
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-gradient-cyan-mint text-bg-base font-display font-bold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.03] transition-all shadow-glow-cyan"
            >
              <Zap size={14} /> Register Agent
            </Link>
          </div>
          <p className="text-text-secondary text-lg">Explore all agents registered on Aegis</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Left: Sort + Limit */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs uppercase tracking-wider">Sort by:</span>
                {SORT_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${sortBy === key
                        ? 'bg-cyan-primary text-bg-base font-bold shadow-glow-cyan'
                        : 'bg-surface-1 border border-[rgba(255,255,255,0.08)] text-text-secondary hover:text-text-primary hover:border-cyan-primary/30'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="w-px h-5 bg-[rgba(255,255,255,0.08)] hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-xs uppercase tracking-wider">Show:</span>
                {LIMIT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setLimit(value)}
                    className={`
                      px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                      ${limit === value
                        ? 'bg-mint-secondary/20 text-mint-secondary border border-mint-secondary/40 font-bold'
                        : 'bg-surface-1 border border-[rgba(255,255,255,0.08)] text-text-secondary hover:text-text-primary hover:border-mint-secondary/30'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Integrate CTA + count */}
            <div className="flex items-center gap-4">
              <span className="text-text-muted text-sm">{sortedAgents.length} of {agents.length} agent{agents.length !== 1 ? 's' : ''}</span>
              <Link
                href="/developer"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-cyan-mint text-bg-base font-display font-semibold text-sm hover:shadow-glow-cyan-intense hover:scale-[1.02] transition-all whitespace-nowrap"
              >
                Integrate your Agent
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Click hint */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-text-muted text-xs font-mono mb-8 -mt-4"
        >
          Click on an agent for Full Analytics Dashboard
        </motion.p>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
            <p className="text-text-secondary text-sm">Loading agents...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-24 text-text-secondary">No agents found</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {demoAgent && (() => {
              const demoSuccess = Math.round((demoAgent.successfulExecutions / demoAgent.totalExecutions) * 100);
              const demoLevel = getTrustLevel(demoAgent);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Link href={`/agent/${demoAgent.objectId}`} className="block h-full">
                    <div className="relative h-full rounded-2xl p-6 glass-card-heavy border-cyan-primary/20 hover:border-cyan-primary/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 cursor-pointer">
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-cyan-primary/10 border border-cyan-primary/20 font-mono text-[9px] text-cyan-primary uppercase tracking-widest">
                        DEMO
                      </span>
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-display text-3xl font-bold text-cyan-primary">★</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${TRUST_PILL[demoLevel]}`}>
                          {demoLevel}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Agent ID</p>
                        <p className="font-mono text-sm text-text-primary">
                          {demoAgent.objectId.slice(0, 8)}...{demoAgent.objectId.slice(-4)}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl p-3 bg-cyan-primary/[0.06]">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp size={10} className="text-cyan-primary" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Uptime</p>
                          </div>
                          <p className="font-mono font-bold text-sm text-cyan-primary">{demoAgent.uptimeScore}%</p>
                        </div>
                        <div className="rounded-xl p-3 bg-mint-secondary/[0.06]">
                          <div className="flex items-center gap-1 mb-1">
                            <BarChart2 size={10} className="text-mint-secondary" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Success</p>
                          </div>
                          <p className="font-mono font-bold text-sm text-mint-secondary">{demoSuccess}%</p>
                        </div>
                        <div className="rounded-xl p-3 bg-surface-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Layers size={10} className="text-text-muted" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Volume</p>
                          </div>
                          <p className="font-mono font-bold text-xs text-text-primary">{formatVolume(demoAgent.totalVolume)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })()}
            {sortedAgents.map((agent, i) => {
              const level = getTrustLevel(agent);
              const successRate = agent.totalExecutions > 0
                ? Math.round((agent.successfulExecutions / agent.totalExecutions) * 100) : 100;

              return (
                <motion.div
                  key={agent.objectId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/agent/${agent.objectId}`} className="block h-full">
                    <div className="h-full rounded-2xl p-6 glass-card-heavy hover:border-cyan-primary/20 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 cursor-pointer">

                      {/* Rank + badge */}
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-display text-3xl font-bold text-cyan-primary">#{i + 1}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${TRUST_PILL[level]}`}>
                          {level}
                        </span>
                      </div>

                      {/* Agent ID */}
                      <div className="mb-4">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Agent ID</p>
                        <p className="font-mono text-sm text-text-primary">
                          {agent.objectId.slice(0, 8)}...{agent.objectId.slice(-4)}
                        </p>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-xl p-3 bg-cyan-primary/[0.06]">
                          <div className="flex items-center gap-1 mb-1">
                            <TrendingUp size={10} className="text-cyan-primary" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Uptime</p>
                          </div>
                          <p className="font-mono font-bold text-sm text-cyan-primary">{agent.uptimeScore}%</p>
                        </div>
                        <div className="rounded-xl p-3 bg-mint-secondary/[0.06]">
                          <div className="flex items-center gap-1 mb-1">
                            <BarChart2 size={10} className="text-mint-secondary" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Success</p>
                          </div>
                          <p className="font-mono font-bold text-sm text-mint-secondary">{successRate}%</p>
                        </div>
                        <div className="rounded-xl p-3 bg-surface-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Layers size={10} className="text-text-muted" />
                            <p className="text-text-muted text-[10px] uppercase tracking-wide">Volume</p>
                          </div>
                          <p className="font-mono font-bold text-xs text-text-primary">{formatVolume(agent.totalVolume)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </main>
  );
}
