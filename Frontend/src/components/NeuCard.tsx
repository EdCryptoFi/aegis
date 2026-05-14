import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cardItemVariants } from '@/lib/animations';

interface NeuCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  animated?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
  padding?: 'sm' | 'md' | 'lg';
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  animated = false,
  variant = 'default',
  padding = 'md',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-surface-1/80 backdrop-blur-md border border-cyan-primary/10 shadow-neu-outset',
    glass: 'bg-surface-1/50 backdrop-blur-lg border border-glass border-white/5 shadow-neu-outset',
    minimal: 'bg-surface-1/40 backdrop-blur-sm border-0 shadow-drop',
  };

  const baseClasses = `
    rounded-[16px]
    ${paddingClasses[padding]}
    transition-all
    duration-300
    ${variantClasses[variant]}
    ${hoverable ? 'hover:-translate-y-1 hover:shadow-glow-cyan-intense hover:border-cyan-primary/20' : ''}
    ${onClick ? 'cursor-pointer active:scale-95' : ''}
    ${className}
  `;

  const content = (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        variants={cardItemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        exit="exit"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};
