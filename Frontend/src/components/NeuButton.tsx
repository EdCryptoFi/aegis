import React, { ReactNode } from 'react';

interface NeuButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-12 py-5 text-lg',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
    secondary: 'text-purple-400 hover:bg-opacity-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-[16px]
        font-semibold
        transition-all
        duration-300
        cursor-pointer
        flex
        items-center
        gap-2
        border-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        boxShadow: 'var(--neu-shadow-light), var(--neu-shadow-dark)',
        background: variant === 'secondary' ? 'var(--neu-bg-base)' : undefined,
      }}
    >
      {children}
    </button>
  );
};
