'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, TrendingUp, Layers, BarChart2, Hash } from 'lucide-react';
import { config } from '../config';

interface ReputationData {
  agentId: string;
  objectId?: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalVolume: number;
  totalSlippage: number;
  uptimeScore: number;
  lastUpdate: number;
  isFlagged: boolean;
}

interface AgentStats {
  successRate: number;
  averageSlippage: number;
  estimatedUptime: string;
  badge: string;
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function formatSlippage(basisPoints: number): string {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

async function getAgentReputation(objectId: string): Promise<ReputationData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUI_RPC || 'https://fullnode.testnet.sui.io'}/rpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sui_getObject',
        params: [objectId, { showContent: true }],
      }),
    });
    const data = await response.json();
    if (data.result?.data?.content?.dataType === 'moveObject') {
      const fields = data.result.data.content.fields;
      return {
        agentId: fields.agent_id,
        totalExecutions: Number(fields.total_executions),
        successfulExecutions: Number(fields.successful_executions),
        failedExecutions: Number(fields.failed_executions),
        totalVolume: Number(fields.total_volume),
        totalSlippage: Number(fields.total_slippage),
        uptimeScore: Number(fields.uptime_score),
        lastUpdate: Number(fields.last_update),
        isFlagged: fields.is_flagged,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get agent reputation:', error);
    return null;
  }
}

function calculateAgentStats(data: ReputationData): AgentStats {
  const successRate = data.totalExecutions > 0
    ? (data.successfulExecutions / data.totalExecutions) * 100
    : 100;

  const averageSlippage = data.totalExecutions > 0
    ? data.totalSlippage / data.totalExecutions
    : 0;

  let badge: string;
  if (data.isFlagged) {
    badge = 'revoked';
  } else {
    const vol = data.totalVolume / 1_000_000_000;
    if (data.totalExecutions >= 200 && successRate >= 95 && vol >= 1000) badge = 'gold';
    else if (data.totalExecutions >= 50 && successRate >= 90) badge = 'silver';
    else if (data.totalExecutions >= 10 && successRate >= 80) badge = 'bronze';
    else badge = 'none';
  }

  return {
    successRate: Math.round(successRate * 100) / 100,
    averageSlippage: Math.round(averageSlippage * 100) / 100,
    estimatedUptime: `${data.uptimeScore}%`,
    badge,
  };
}

const BADGE_STYLES: Record<string, { pill: string; label: string }> = {
  gold:    { pill: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',              label: 'Gold Badge'   },
  silver:  { pill: 'bg-slate-300/10 text-slate-300 border-slate-300/30',                 label: 'Silver Badge' },
  bronze:  { pill: 'bg-orange-400/10 text-orange-400 border-orange-400/30',              label: 'Bronze Badge' },
  revoked: { pill: 'bg-red-500/10 text-red-400 border-red-500/30',                       label: 'Revoked'      },
  none:    { pill: 'bg-surface-2 text-text-muted border-[rgba(255,255,255,0.08)]',       label: 'Unranked'     },
};

export default function AgentCard({ agentAddress }: { agentAddress: string }) {
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const successRate = reputation && reputation.totalExecutions > 0
    ? Math.round((reputation.successfulExecutions / reputation.totalExecutions) * 100)
    : 100;
  const totalExecutions = reputation?.totalExecutions || 0;
  const totalVolume = reputation?.totalVolume || 0;

  useEffect(() => {
    loadReputation();
  }, [agentAddress]);

  async function loadReputation() {
    setLoading(true);
    const rep = await getAgentReputation(agentAddress);
    if (rep) {
      setReputation(rep);
      setStats(calculateAgentStats(rep));
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
        <div className="w-10 h-10 border-2 border-[rgba(255,255,255,0.08)] border-t-cyan-primary rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Loading reputation...</p>
      </div>
    );
  }

  if (!reputation) {
    return (
      <div className="rounded-2xl glass-card-heavy p-8 max-w-lg w-full text-center">
        <p className="text-text-primary font-semibold mb-2">Agent Not Found</p>
        <p className="text-text-secondary text-sm mb-3">No reputation data available for this agent.</p>
        <p className="font-mono text-text-muted text-xs">{agentAddress}</p>
      </div>
    );
  }

  const badgeStyle = BADGE_STYLES[stats?.badge || 'none'];

  const metrics = [
    { icon: Activity, label: 'Uptime Score', value: stats?.estimatedUptime, color: 'text-cyan-primary', bg: 'bg-cyan-primary/[0.06]' },
    { icon: TrendingUp, label: 'Success Rate', value: `${stats?.successRate}%`, color: 'text-mint-secondary', bg: 'bg-mint-secondary/[0.06]' },
    { icon: Layers, label: 'Total Executions', value: reputation.totalExecutions, color: 'text-text-primary', bg: 'bg-surface-2' },
    { icon: BarChart2, label: 'Total Volume', value: formatVolume(reputation.totalVolume), color: 'text-text-primary', bg: 'bg-surface-2' },
    { icon: TrendingUp, label: 'Avg Slippage', value: formatSlippage(stats?.averageSlippage || 0), color: 'text-text-secondary', bg: 'bg-surface-2' },
    { icon: Hash, label: 'Agent ID', value: `${reputation.agentId?.slice(0, 10)}...`, color: 'text-text-muted', bg: 'bg-surface-2', mono: true },
  ];

  const badgeChecks = [
    { emoji: '🥉', name: 'Bronze', eligible: successRate >= 80 && totalExecutions >= 10 },
    { emoji: '🥈', name: 'Silver', eligible: successRate >= 90 && totalExecutions >= 50 },
    { emoji: '🥇', name: 'Gold', eligible: successRate >= 95 && totalExecutions >= 200 && totalVolume >= 1_000_000_000_000 },
  ];

  return (
    <motion.div
      className="rounded-2xl glass-card-heavy p-6 w-full max-w-lg"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-bold text-text-primary">Agent Reputation</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle.pill}`}>
          {badgeStyle.label}
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {metrics.map(({ icon: Icon, label, value, color, bg, mono }) => (
          <div key={label} className={`rounded-xl p-4 ${bg}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} className="text-text-muted" />
              <p className="text-text-muted text-[10px] uppercase tracking-wide">{label}</p>
            </div>
            <p className={`${mono ? 'font-mono text-xs' : 'font-display font-bold text-base'} ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Flagged warning */}
      {reputation.isFlagged && (
        <div className="flex items-center gap-3 rounded-xl p-4 bg-red-500/[0.08] border border-red-500/30 mb-5">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">This agent has been flagged for suspicious activity.</p>
        </div>
      )}

      {/* Badge eligibility */}
      <div className="border-t border-[rgba(255,255,255,0.06)] pt-5">
        <p className="text-text-muted text-xs uppercase tracking-wide mb-3">Badge Eligibility</p>
        <div className="grid grid-cols-3 gap-2">
          {badgeChecks.map(({ emoji, name, eligible }) => (
            <div
              key={name}
              className={`
                rounded-xl p-3 flex flex-col items-center gap-1 border
                ${eligible
                  ? 'bg-mint-secondary/[0.06] border-mint-secondary/30'
                  : 'bg-surface-2 border-[rgba(255,255,255,0.06)] opacity-50'
                }
              `}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-text-muted text-[10px]">{name}</span>
              <span className={`text-sm font-bold ${eligible ? 'text-mint-secondary' : 'text-red-400'}`}>
                {eligible ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
