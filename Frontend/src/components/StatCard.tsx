import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { NeuCard } from './NeuCard';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
  subtitle?: string;
  animated?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  trend,
  unit,
  subtitle,
  animated = true,
  className = '',
}) => {
  const trendColor = trend === 'up' ? 'text-mint-secondary' : trend === 'down' ? 'text-error' : 'text-text-secondary';

  return (
    <NeuCard animated={animated} padding="md" className={className}>
      <div className="space-y-3">
        {/* Header with icon and label */}
        <div className="flex items-start justify-between">
          {icon && (
            <div className="text-cyan-primary opacity-75">
              {icon}
            </div>
          )}
          <div className="flex-1 ml-2">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              {label}
            </p>
          </div>
        </div>

        {/* Value with unit */}
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold font-display text-text-primary">
            {value}
          </p>
          {unit && (
            <span className="text-sm text-text-secondary font-medium">
              {unit}
            </span>
          )}
        </div>

        {/* Change/trend indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-1">
            <span className={`text-sm font-semibold ${trendColor}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {Math.abs(change)}%
            </span>
          </div>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </NeuCard>
  );
};
