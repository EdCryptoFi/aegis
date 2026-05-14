import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { buttonHoverVariants } from '@/lib/animations';

interface NeuButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-cyan-mint text-white font-semibold',
    secondary: 'bg-transparent border border-[rgba(255,255,255,0.1)] text-text-primary hover:border-cyan-primary font-medium',
    tertiary: 'bg-transparent text-cyan-primary hover:text-mint-secondary',
  };

  const baseClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    rounded-[28px]
    font-display font-semibold
    transition-all
    duration-200
    cursor-pointer
    flex
    items-center
    justify-center
    gap-2
    border-none
    outline-none
    focus:ring-2
    focus:ring-cyan-primary
    focus:ring-offset-2
    focus:ring-offset-bg-base
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-glow-cyan'}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
      variants={buttonHoverVariants}
    >
      {children}
    </motion.button>
  );
};
