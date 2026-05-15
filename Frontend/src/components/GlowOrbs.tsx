'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function GlowOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouse({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 255, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          left: `${30 + mouse.x * 10}%`,
          top: `${20 + mouse.y * 10}%`,
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Purple orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(112, 0, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          right: `${20 + (1 - mouse.x) * 8}%`,
          top: `${30 + mouse.y * 8}%`,
          transform: 'translate(50%, -50%)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mint orb (bottom) */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 167, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
          left: `${50 + mouse.x * 6}%`,
          bottom: `${10 + (1 - mouse.y) * 6}%`,
          transform: 'translate(-50%, 50%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
