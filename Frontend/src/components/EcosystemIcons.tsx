import React from 'react';
import { motion } from 'framer-motion';

const SvgContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="w-full h-full flex items-center justify-center pointer-events-none"
  >
    <svg
      viewBox="0 0 100 100"
      className="w-[60%] h-[60%] overflow-visible drop-shadow-[0_0_15px_rgba(64,196,255,0.4)]"
    >
      {children}
    </svg>
  </motion.div>
);

const GlowingNode = ({ cx, cy }: { cx: number | string; cy: number | string }) => (
  <motion.circle
    cx={cx}
    cy={cy}
    r="2"
    fill="#b3ebff"
    className="drop-shadow-[0_0_8px_#fff]"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 2.2, duration: 0.5, type: 'spring' }}
  />
);

const GlowingPath = ({ d, isFill = false, delay = 0, opacity = 0.15, strokeWidth = '1.5' }: {
  d: string; isFill?: boolean; delay?: number; opacity?: number; strokeWidth?: string;
}) => (
  <motion.path
    d={d}
    stroke="#40c4ff"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={isFill ? `rgba(64,196,255,${opacity})` : 'none'}
    initial={{ pathLength: 0, fillOpacity: 0 }}
    animate={{ pathLength: 1, fillOpacity: isFill ? opacity : 0 }}
    transition={{
      pathLength: { duration: 2, delay, ease: 'easeInOut' },
      fillOpacity: { duration: 1, delay: delay + 1.5 },
    }}
  />
);

const WireframeShape = ({ paths, nodes }: { paths: string[]; nodes: [number, number][] }) => {
  const dx = 12;
  const dy = -12;

  return (
    <g transform="translate(-6, 6)">
      {/* Back Layer */}
      <g transform={`translate(${dx}, ${dy})`} opacity="0.25">
        {paths.map((p, i) => (
          <GlowingPath key={`back-${i}`} d={p} strokeWidth="1" delay={0.5} />
        ))}
      </g>

      {/* Connecting Lines */}
      {nodes.map(([x, y], i) => (
        <motion.path
          key={`conn-${i}`}
          d={`M ${x} ${y} L ${x + dx} ${y + dy}`}
          stroke="#40c4ff"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        />
      ))}

      {/* Back Nodes */}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={`bnode-${i}`} cx={x + dx} cy={y + dy} r="1.5" fill="#40c4ff"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2, duration: 0.5 }}
        />
      ))}

      {/* Front Layer */}
      {paths.map((p, i) => (
        <GlowingPath key={`front-${i}`} d={p} isFill={i === 0 || i === 1} delay={0} opacity={0.1} />
      ))}

      {/* Front Nodes */}
      {nodes.map(([x, y], i) => (
        <GlowingNode key={`fnode-${i}`} cx={x} cy={y} />
      ))}
    </g>
  );
};

export const SuiIcon = () => (
  <SvgContainer>
    <WireframeShape
      paths={[
        'M 50 15 C 80 45 85 65 85 80 C 85 96 65 96 50 96 C 35 96 15 96 15 80 C 15 65 20 45 50 15 Z',
        'M 35 80 C 35 60 45 53 50 45 C 55 35 55 25 50 15',
      ]}
      nodes={[
        [50, 15], [85, 80], [50, 96], [15, 80], [50, 45], [35, 80],
      ]}
    />
  </SvgContainer>
);

export const WalrusIcon = () => (
  <SvgContainer>
    <WireframeShape
      paths={[
        'M 10 26 L 23 76 L 38 76 L 50 45 L 62 76 L 77 76 L 90 26 L 74 26 L 62 60 L 50 26 L 38 60 L 26 26 Z',
      ]}
      nodes={[
        [10, 26], [23, 76], [38, 76], [50, 45], [62, 76], [77, 76],
        [90, 26], [74, 26], [62, 60], [50, 26], [38, 60], [26, 26],
      ]}
    />
  </SvgContainer>
);

export const DeepBookIcon = () => (
  <SvgContainer>
    <WireframeShape
      paths={[
        'M 20 32 L 68 32 A 14 14 0 0 1 82 46 L 20 46 Z',
        'M 20 54 L 82 54 A 14 14 0 0 1 68 68 L 20 68 Z',
      ]}
      nodes={[
        [20, 32], [68, 32], [82, 46], [20, 46],
        [20, 54], [82, 54], [68, 68], [20, 68],
      ]}
    />
  </SvgContainer>
);

export const MemWalIcon = () => (
  <SvgContainer>
    <WireframeShape
      paths={[
        'M 15 30 L 85 30 A 5 5 0 0 1 90 35 L 90 65 A 5 5 0 0 1 85 70 L 15 70 A 5 5 0 0 1 10 65 L 10 35 A 5 5 0 0 1 15 30 Z',
        'M 20 42 L 35 42 L 35 58 L 20 58 Z',
        'M 70 30 L 70 70',
      ]}
      nodes={[
        [15, 30], [85, 30], [90, 35], [90, 65], [85, 70], [15, 70], [10, 65], [10, 35],
        [20, 42], [35, 42], [35, 58], [20, 58],
        [70, 30], [70, 70],
      ]}
    />
  </SvgContainer>
);
