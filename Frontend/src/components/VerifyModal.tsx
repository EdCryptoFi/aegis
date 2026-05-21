'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, ShieldX, X, ExternalLink } from 'lucide-react';

export interface VerifyAgentData {
  objectId: string;
  name: string;
  totalExecutions: number;
  successfulExecutions: number;
  uptimeScore: number;
  totalVolume: number;
  isFlagged: boolean;
}

function formatVolume(mist: number): string {
  const sui = mist / 1_000_000_000;
  if (sui >= 1_000_000) return `${(sui / 1_000_000).toFixed(2)}M SUI`;
  if (sui >= 1_000) return `${(sui / 1_000).toFixed(2)}K SUI`;
  return `${sui.toFixed(4)} SUI`;
}

function getTrustLevel(agent: VerifyAgentData): string {
  if (agent.isFlagged) return 'FLAGGED';
  const sr = agent.totalExecutions > 0
    ? (agent.successfulExecutions / agent.totalExecutions) * 100 : 100;
  if (sr >= 95 && agent.totalExecutions >= 50) return 'HIGH';
  if (sr >= 80 && agent.totalExecutions >= 10) return 'MEDIUM';
  return 'LOW';
}

function getBadgeTier(agent: VerifyAgentData): 'gold' | 'silver' | 'bronze' | 'none' {
  if (agent.isFlagged) return 'none';
  const sr = agent.totalExecutions > 0
    ? (agent.successfulExecutions / agent.totalExecutions) * 100 : 100;
  const vol = agent.totalVolume / 1_000_000_000;
  if (agent.totalExecutions >= 200 && sr >= 95 && vol >= 1000) return 'gold';
  if (agent.totalExecutions >= 50 && sr >= 90) return 'silver';
  if (agent.totalExecutions >= 10 && sr >= 80) return 'bronze';
  return 'none';
}

const TRUST_PILL: Record<string, string> = {
  HIGH:    'bg-mint-secondary/10 text-mint-secondary border-mint-secondary/30',
  MEDIUM:  'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  LOW:     'bg-orange-500/10 text-orange-400 border-orange-500/30',
  FLAGGED: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const BADGE_CONFIG = {
  gold:   { label: 'GOLD',     color: 'text-yellow-400', bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30',  glow: 'shadow-[0_0_24px_rgba(251,191,36,0.15)]' },
  silver: { label: 'SILVER',   color: 'text-slate-300',  bg: 'bg-slate-300/10',   border: 'border-slate-300/30',   glow: '' },
  bronze: { label: 'BRONZE',   color: 'text-orange-400', bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  glow: '' },
  none:   { label: 'UNRANKED', color: 'text-text-muted', bg: 'bg-surface-2',      border: 'border-[rgba(255,255,255,0.08)]', glow: '' },
};

function buildCliLines(agent: VerifyAgentData, level: string, badge: string, sr: number): { text: string; color: string; delay: number }[] {
  const short = `${agent.objectId.slice(0, 12)}...${agent.objectId.slice(-6)}`;
  const isVerified = !agent.isFlagged;
  const lines = [
    { text: `$ aegis verify --agent ${short}`, color: 'text-cyan-primary', delay: 0 },
    { text: '', color: '', delay: 300 },
    { text: 'Connecting to Sui testnet...', color: 'text-text-muted', delay: 500 },
    { text: 'Fetching reputation object...', color: 'text-text-muted', delay: 900 },
    { text: `✓  Found on-chain`, color: 'text-mint-secondary', delay: 1300 },
    { text: '─────────────────────────', color: 'text-[rgba(255,255,255,0.12)]', delay: 1500 },
    { text: `  AGENT     ${agent.name}`, color: 'text-text-primary', delay: 1700 },
    { text: `  BADGE     ${badge.toUpperCase()}`, color: badge === 'gold' ? 'text-yellow-400' : badge === 'silver' ? 'text-slate-300' : badge === 'bronze' ? 'text-orange-400' : 'text-text-muted', delay: 1950 },
    { text: `  TRUST     ${level}`, color: level === 'HIGH' ? 'text-mint-secondary' : level === 'MEDIUM' ? 'text-yellow-400' : level === 'FLAGGED' ? 'text-red-400' : 'text-orange-400', delay: 2200 },
    { text: `  SUCCESS   ${sr}%`, color: 'text-cyan-primary', delay: 2400 },
    { text: `  UPTIME    ${agent.uptimeScore}%`, color: 'text-cyan-primary', delay: 2600 },
    { text: `  VOLUME    ${formatVolume(agent.totalVolume)}`, color: 'text-text-secondary', delay: 2800 },
    { text: `  EXECS     ${agent.totalExecutions}`, color: 'text-text-secondary', delay: 3000 },
    { text: '─────────────────────────', color: 'text-[rgba(255,255,255,0.12)]', delay: 3200 },
    {
      text: isVerified ? '  STATUS    VERIFIED ✓' : '  STATUS    REVOKED ✗',
      color: isVerified ? 'text-mint-secondary' : 'text-red-400',
      delay: 3500,
    },
    {
      text: isVerified ? '  ACCESS    GRANTED' : '  ACCESS    BLOCKED',
      color: isVerified ? 'text-mint-secondary' : 'text-red-400',
      delay: 3750,
    },
  ];
  return lines;
}

interface VerifyModalProps {
  agent: VerifyAgentData;
  onClose: () => void;
}

export default function VerifyModal({ agent, onClose }: VerifyModalProps) {
  const level = getTrustLevel(agent);
  const badge = getBadgeTier(agent);
  const sr = agent.totalExecutions > 0
    ? Math.round((agent.successfulExecutions / agent.totalExecutions) * 100) : 100;
  const bc = BADGE_CONFIG[badge];
  const isVerified = !agent.isFlagged;
  const cliLines = buildCliLines(agent, level, badge, sr);

  const [visibleCli, setVisibleCli] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    setVisibleCli(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    cliLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCli(i + 1), cliLines[i].delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [agent.objectId]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-3xl rounded-2xl bg-surface-1 border border-cyan-primary/20 shadow-[0_0_60px_rgba(0,212,184,0.08)] overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Verify Info */}
          <div className="p-8 border-r border-[rgba(255,255,255,0.06)]">
            <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-primary mb-1">Verify Agent</p>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-1">{agent.name}</h2>
            <p className="font-mono text-xs text-text-muted mb-1">
              {agent.objectId.slice(0, 12)}...{agent.objectId.slice(-6)}
            </p>
            {!agent.objectId.startsWith('0xdemo') && !agent.objectId.startsWith('0xSIM') && (
              <a
                href={`https://suiscan.xyz/testnet/object/${agent.objectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-primary/60 hover:text-cyan-primary transition-colors mb-4"
              >
                <ExternalLink size={10} /> View on SuiScan
              </a>
            )}
            {(agent.objectId.startsWith('0xdemo') || agent.objectId.startsWith('0xSIM')) && (
              <div className="mb-4" />
            )}

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${bc.bg} border ${bc.border} ${bc.glow} mb-4`}>
              {isVerified
                ? <ShieldCheck size={15} className={bc.color} />
                : <ShieldX size={15} className="text-red-400" />}
              <span className={`font-mono font-bold text-sm ${isVerified ? bc.color : 'text-red-400'}`}>
                {agent.isFlagged ? 'FLAGGED' : `${bc.label} BADGE`}
              </span>
            </div>

            {/* Trust pill */}
            <div className="mb-5">
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold border ${TRUST_PILL[level]}`}>
                {level} TRUST
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-text-muted text-[10px] uppercase mb-1">Uptime</p>
                <p className="font-mono font-bold text-xl text-cyan-primary">{agent.uptimeScore}%</p>
              </div>
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-text-muted text-[10px] uppercase mb-1">Success</p>
                <p className="font-mono font-bold text-xl text-mint-secondary">{sr}%</p>
              </div>
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-text-muted text-[10px] uppercase mb-1">Volume</p>
                <p className="font-mono font-bold text-sm text-text-primary">{formatVolume(agent.totalVolume)}</p>
              </div>
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-text-muted text-[10px] uppercase mb-1">Executions</p>
                <p className="font-mono font-bold text-xl text-text-primary">{agent.totalExecutions}</p>
              </div>
            </div>

            {/* Verdict */}
            {isVerified ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-primary/[0.06] border border-cyan-primary/20">
                <ShieldCheck size={18} className="text-cyan-primary flex-shrink-0" />
                <div>
                  <p className="font-display font-bold text-cyan-primary text-sm">AGENT VERIFIED</p>
                  <p className="text-text-secondary text-xs mt-0.5">Safe to delegate. Recorded on Sui testnet.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/20">
                <ShieldX size={18} className="text-red-400 flex-shrink-0" />
                <div>
                  <p className="font-display font-bold text-red-400 text-sm">ACCESS REVOKED</p>
                  <p className="text-text-secondary text-xs mt-0.5">Agent flagged. Do not delegate funds.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: CLI Terminal */}
          <div className="p-6 bg-[#0a0d0f] flex flex-col">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 font-mono text-[10px] text-text-muted">aegis - verify</span>
            </div>
            <div className="flex-1 font-mono text-xs leading-relaxed space-y-0.5 overflow-hidden">
              {cliLines.slice(0, visibleCli).map((line, i) => (
                <p key={i} className={line.color || 'text-transparent select-none'}>
                  {line.text || ' '}
                </p>
              ))}
              {visibleCli < cliLines.length && (
                <span className="inline-block w-2 h-4 bg-cyan-primary animate-pulse align-middle" />
              )}
            </div>
            <p className="text-text-muted text-[9px] font-mono mt-4 text-right">
              Powered by Aegis · Sui Testnet
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
