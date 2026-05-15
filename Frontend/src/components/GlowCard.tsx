'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlowCard({
  children,
  className = '',
  delay = 0,
  hover = true,
  onClick,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: '0 8px 32px rgba(0, 245, 255, 0.12), 0 0 1px rgba(0, 245, 255, 0.3)',
              borderColor: 'rgba(0, 245, 255, 0.2)',
              transition: { duration: 0.3 },
            }
          : undefined
      }
      onClick={onClick}
      className={`
        bg-surface-1
        border border-[rgba(255,255,255,0.08)]
        rounded-[24px]
        p-6
        transition-colors
        duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
