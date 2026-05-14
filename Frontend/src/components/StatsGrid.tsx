'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'indigo' | 'purple' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
  red: 'from-red-500/20 to-red-600/10 border-red-500/30',
};

const iconColors = {
  indigo: 'text-indigo-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  red: 'text-red-400',
};

export function StatCard({ label, value, icon, trend, color = 'indigo' }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-2xl ${iconColors[color]}`}>{icon}</span>
        {trend && (
          <span className={`text-xs ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{ label: string; value: string | number; icon: string; color?: 'indigo' | 'purple' | 'green' | 'yellow' | 'red' }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} color={stat.color || 'indigo'} />
      ))}
    </div>
  );
}

export function AgentStatsRow({ agents, badges, volume }: { agents: number; badges: number; volume: string }) {
  return (
    <div className="flex justify-center items-center gap-6 py-4 border-t border-b border-slate-700/50">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{agents}</div>
        <div className="text-xs text-slate-500">Agents</div>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{badges}</div>
        <div className="text-xs text-slate-500">Badges</div>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{volume}</div>
        <div className="text-xs text-slate-500">Volume</div>
      </div>
    </div>
  );
}