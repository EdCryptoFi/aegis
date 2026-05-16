'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AegisLogo({ className = '' }: { className?: string }) {
  const [key] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pathVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.2, ease: 'easeOut', delay: custom * 0.15 },
        opacity: { duration: 0.3, delay: custom * 0.15 },
      },
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const glowVariants: any = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (custom: number) => ({
      opacity: [0, 0.6, 1, 0.8, 1],
      scale: 1,
      transition: { duration: 1.0, ease: 'easeInOut', delay: custom * 0.15 + 1.2 },
    }),
  };

  return (
    <motion.div
      key={key}
      initial="hidden"
      animate="visible"
      className={`relative z-10 ${className}`}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full overflow-visible"
        style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,167,0.5))' }}
      >
        <defs>
          <linearGradient id="al-neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFA7" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
          <linearGradient id="al-neonBlue" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="al-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="al-glowStrong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer shield rings */}
        <motion.circle cx="250" cy="250" r="235" fill="none" stroke="#0f172a" strokeWidth="16" variants={pathVariants} custom={0} />
        <motion.circle cx="250" cy="250" r="235" fill="none" stroke="#1e40af" strokeWidth="16" strokeDasharray="339 30" strokeDashoffset="15" strokeLinecap="round" variants={pathVariants} custom={0.5} />
        <motion.circle cx="250" cy="250" r="225" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="339 30" strokeDashoffset="15" strokeLinecap="round" variants={pathVariants} custom={1} />
        <motion.circle cx="250" cy="250" r="200" fill="none" stroke="url(#al-neonBlue)" strokeWidth="6" filter="url(#al-glow)" variants={pathVariants} custom={1.5} />
        <motion.circle cx="250" cy="250" r="185" fill="none" stroke="#00FFA7" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" variants={pathVariants} custom={2} />
        <motion.circle cx="250" cy="250" r="175" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="40 60" strokeLinecap="round" variants={pathVariants} custom={2.2} />

        {/* Circuit traces */}
        <g stroke="#00C896" strokeWidth="1.5" fill="none" opacity="0.6">
          <motion.path d="M 220 70 L 220 90 L 240 110" variants={pathVariants} custom={2.5} />
          <motion.path d="M 280 70 L 280 90 L 260 110" variants={pathVariants} custom={2.5} />
          <motion.path d="M 220 430 L 220 410 L 240 390" variants={pathVariants} custom={2.5} />
          <motion.path d="M 280 430 L 280 410 L 260 390" variants={pathVariants} custom={2.5} />
          <motion.path d="M 70 220 L 90 220 L 110 240" variants={pathVariants} custom={2.5} />
          <motion.path d="M 430 220 L 410 220 L 390 240" variants={pathVariants} custom={2.5} />
          <motion.path d="M 70 280 L 90 280 L 110 260" variants={pathVariants} custom={2.5} />
          <motion.path d="M 430 280 L 410 280 L 390 260" variants={pathVariants} custom={2.5} />
          <motion.circle cx="250" cy="250" r="160" strokeDasharray="10 40" variants={pathVariants} custom={2.5} />
          <motion.circle cx="250" cy="250" r="130" strokeDasharray="5 50" variants={pathVariants} custom={2.5} />
        </g>

        {/* Circuit nodes */}
        <g fill="#00FFA7" filter="url(#al-glow)">
          {[[220,70],[280,70],[220,430],[280,430],[70,220],[430,220],[70,280],[430,280]].map(([cx,cy]) => (
            <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" variants={glowVariants} custom={2} />
          ))}
        </g>

        {/* A letterform */}
        <motion.path d="M 100 370 L 250 70 L 400 370" fill="none" stroke="#1d4ed8" strokeWidth="38" strokeLinejoin="miter" strokeMiterlimit="10" strokeLinecap="round" variants={pathVariants} custom={3} />
        <motion.path d="M 86 385 L 250 56 L 414 385" fill="none" stroke="#00FFA7" strokeWidth="4" strokeLinejoin="miter" strokeMiterlimit="5" strokeLinecap="round" filter="url(#al-glowStrong)" variants={pathVariants} custom={4} />
        <motion.path d="M 120 350 L 250 90 L 380 350" fill="none" stroke="url(#al-neonCyan)" strokeWidth="18" strokeLinejoin="miter" strokeMiterlimit="4" strokeLinecap="square" filter="url(#al-glow)" variants={pathVariants} custom={5} />
        <motion.path d="M 155 315 L 250 120 L 345 315" fill="none" stroke="#e0e7ff" strokeWidth="2" strokeLinejoin="miter" variants={pathVariants} custom={5.5} />

        {/* Star / astroid */}
        <motion.path d="M 250 200 Q 250 290 330 290 Q 250 290 250 380 Q 250 290 170 290 Q 250 290 250 200 Z" fill="none" stroke="#00FFA7" strokeWidth="5" strokeLinejoin="round" filter="url(#al-glowStrong)" variants={pathVariants} custom={6} />
        <motion.circle cx="250" cy="290" r="8" fill="#ffffff" filter="url(#al-glowStrong)" variants={glowVariants} custom={6} />
      </svg>
    </motion.div>
  );
}
