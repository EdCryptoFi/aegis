import React, { InputHTMLAttributes, ReactNode } from 'react';

interface PremiumInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  error,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const baseClasses = `
    bg-bg-base
    border border-white/8
    rounded-[12px]
    ${sizeClasses[size]}
    text-text-primary
    placeholder-text-secondary
    transition-all
    duration-200
    focus:outline-none
    focus:border-cyan-primary/30
    focus:ring-2
    focus:ring-cyan-primary/20
    focus:shadow-glow-cyan
    ${fullWidth ? 'w-full' : ''}
    ${error ? 'border-error focus:border-error' : ''}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-50">
            {icon}
          </div>
        )}
        <input className={baseClasses} {...props} />
      </div>
      {error && (
        <p className="mt-1 text-xs font-medium text-error">{error}</p>
      )}
    </div>
  );
};
