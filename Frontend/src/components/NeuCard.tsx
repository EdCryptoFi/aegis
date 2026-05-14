import React, { ReactNode } from 'react';

interface NeuCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
}) => {
  return (
    <div
      className={`
        rounded-[24px]
        p-8
        shadow-lg
        transition-all
        duration-400
        border
        border-white/5
        ${hoverable ? 'hover:shadow-xl hover:-translate-y-2 cursor-default' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        background: 'var(--neu-bg-base)',
        boxShadow: 'var(--neu-shadow-light), var(--neu-shadow-dark)',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
