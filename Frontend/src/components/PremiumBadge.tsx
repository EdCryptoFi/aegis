import React, { ReactNode } from 'react';

type BadgeType = 'success' | 'warning' | 'danger' | 'info' | 'high' | 'medium' | 'low' | 'flagged';
type BadgeSize = 'sm' | 'md' | 'lg';

interface PremiumBadgeProps {
  children: ReactNode;
  type?: BadgeType;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  children,
  type = 'info',
  size = 'md',
  icon,
  className = '',
}) => {
  const typeClasses = {
    success: 'bg-mint-secondary/20 text-mint-secondary border border-mint-secondary/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/30',
    high: 'bg-green-500/20 text-green-400 border border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    flagged: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <div
      className={`
        inline-flex
        items-center
        rounded-[8px]
        font-medium
        transition-all
        duration-200
        ${typeClasses[type]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};
