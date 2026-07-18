'use client';

import { motion } from 'framer-motion';

/* ─── Sponsor Icons ─── */
const SuiBallIcon = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="w-full h-full flex items-center justify-center pointer-events-none"
  >
    <svg viewBox="0 0 100 100" className="w-[62%] h-[62%] overflow-visible drop-shadow-[0_0_14px_rgba(0,212,184,0.35)]">
      <motion.circle cx="50" cy="54" r="38"
        fill="none" stroke="#00D4B8" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ pathLength: { duration: 2, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
      />
      <motion.circle cx="50" cy="38" r="27"
        fill="none" stroke="#00EED4" strokeWidth="1.5" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ pathLength: { duration: 2, delay: 0.5, ease: 'easeInOut' }, opacity: { duration: 0.4, delay: 0.5 } }}
      />
      {[[50, 16], [88, 54], [50, 92], [12, 54]].map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="1.8" fill="#b3ebff"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 + i * 0.1, duration: 0.3, type: 'spring' }}
        />
      ))}
    </svg>
  </motion.div>
);

const InflectivAIIcon = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="w-full h-full flex items-center justify-center pointer-events-none"
  >
    <svg viewBox="0 0 100 100" className="w-[62%] h-[62%] overflow-visible drop-shadow-[0_0_14px_rgba(0,212,184,0.35)]">
      <motion.circle cx="50" cy="50" r="38"
        fill="none" stroke="#00D4B8" strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ pathLength: { duration: 2, ease: 'easeInOut' }, opacity: { duration: 0.5 } }}
      />
      {[
        { cx: 38, cy: 38, delay: 0.3, color: '#00D4B8' },
        { cx: 62, cy: 38, delay: 0.55, color: '#00EED4' },
        { cx: 50, cy: 62, delay: 0.8, color: '#00D4B8' },
      ].map(({ cx, cy, delay, color }, i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="22"
          fill="none" stroke={color} strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.55 }}
          viewport={{ once: true }}
          transition={{ pathLength: { duration: 1.6, delay, ease: 'easeInOut' }, opacity: { duration: 0.4, delay } }}
        />
      ))}
      <motion.circle cx="50" cy="50" r="2.5" fill="#b3ebff"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2.2, duration: 0.4, type: 'spring' }}
      />
      {[[50, 12], [84, 31], [84, 69], [50, 88], [16, 69], [16, 31]].map(([ncx, ncy], i) => (
        <motion.circle key={`n${i}`} cx={ncx} cy={ncy} r="1.5" fill="#00D4B8"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.7, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 + i * 0.08, duration: 0.3, type: 'spring' }}
        />
      ))}
    </svg>
  </motion.div>
);

const NaviIcon = () => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="w-full h-full flex items-center justify-center pointer-events-none"
  >
    <svg viewBox="0 0 100 100" className="w-[62%] h-[62%] overflow-visible drop-shadow-[0_0_14px_rgba(0,212,184,0.35)]">
      {/* N shape: left vertical ↓, diagonal top-left → bottom-right, right vertical ↓ */}
      <motion.polyline
        points="20,72 20,28 80,72 80,28"
        fill="none" stroke="#00D4B8" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ pathLength: { duration: 1.6, ease: 'easeInOut' }, opacity: { duration: 0.4 } }}
      />
      {[{ cx: 20, cy: 28 }, { cx: 80, cy: 28 }, { cx: 20, cy: 72 }, { cx: 80, cy: 72 }].map(({ cx, cy }, i) => (
        <motion.circle key={i} cx={cx} cy={cy} r="2.5" fill="#b3ebff"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6 + i * 0.1, duration: 0.3, type: 'spring' }}
        />
      ))}
    </svg>
  </motion.div>
);

const SUPPORTERS = [
  { name: 'SuiBall', href: 'https://order.suiball.com', Icon: SuiBallIcon },
  { name: 'Inflectiv AI', href: 'https://app.inflectiv.ai/?ref=REF-F90CE246', Icon: InflectivAIIcon },
  { name: 'NAVI', href: 'https://app.naviprotocol.io', Icon: NaviIcon },
];

/** Shared "Supported by" strip — used on the home page and the /demo Close slide. */
export default function SupportedBy({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col items-center gap-6 ${className}`}
    >
      <p className="text-text-muted text-xs font-mono uppercase tracking-widest">Supported by</p>
      <div className="w-full flex flex-wrap items-center justify-center gap-10 px-8 py-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-surface-0/40 backdrop-blur-sm">
        {SUPPORTERS.map(({ name, href, Icon }, i) => (
          <div key={name} className="flex items-center gap-10">
            {i > 0 && <span className="w-px h-8 bg-[rgba(255,255,255,0.08)]" />}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-[72px] h-[72px] flex-shrink-0">
                <Icon />
              </div>
              <span className="font-display font-bold text-text-secondary text-lg tracking-wide group-hover:text-text-primary transition-colors">
                {name}
              </span>
            </a>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
