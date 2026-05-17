'use client';
import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

// path-draw: stagger per custom index
const pV: any = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.6, ease: 'easeOut', delay: i * 0.07 },
      opacity: { duration: 0.1, delay: i * 0.07 },
    },
  }),
};

// vertex dot pop
const dV: any = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, delay: 0.4 + i * 0.04, type: 'spring', stiffness: 300 },
  }),
};

type P = { className?: string };

function useAnim() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return { ref, a: inView ? 'visible' : ('hidden' as const) };
}

function Base({ children, a }: { children: ReactNode; a: string }) {
  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0 4px rgba(107,218,255,0.45))' }}
      initial="hidden"
      animate={a}
    >
      <g stroke="currentColor" strokeWidth={1.1} strokeLinecap="square" strokeLinejoin="miter">
        {children}
      </g>
    </motion.svg>
  );
}

// ─── §01 · A·01 · Agents Tracked ───────────────────────────────────────────
export function AgentsTrackedIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.line x1="32" y1="6" x2="32" y2="12" variants={pV} custom={0} />
        <motion.circle cx="32" cy="5" r="1.5" fill="currentColor" stroke="none" variants={dV} custom={0} />
        <motion.path d="M16 14 L40 14 L40 38 L16 38 Z" variants={pV} custom={1} />
        <motion.path d="M24 8 L48 8 L48 32" variants={pV} custom={2} />
        <motion.path d="M40 14 L48 8 M16 14 L24 8 M40 38 L48 32" variants={pV} custom={3} />
        <motion.line x1="48" y1="32" x2="40" y2="38" strokeDasharray="1.5 1.5" variants={pV} custom={4} />
        <motion.circle cx="23" cy="22" r="1.6" fill="currentColor" stroke="none" variants={dV} custom={1} />
        <motion.circle cx="33" cy="22" r="1.6" fill="currentColor" stroke="none" variants={dV} custom={2} />
        <motion.line x1="22" y1="30" x2="34" y2="30" variants={pV} custom={5} />
        <motion.path d="M10 56 L18 44 L38 44 L46 56" variants={pV} custom={6} />
        <motion.line x1="10" y1="56" x2="46" y2="56" variants={pV} custom={7} />
        <motion.line x1="18" y1="44" x2="14" y2="38" variants={pV} custom={8} />
        <motion.line x1="38" y1="44" x2="42" y2="38" variants={pV} custom={9} />
        {[[16,14],[40,14],[40,38],[16,38],[24,8],[48,8],[48,32],[10,56],[46,56],[18,44],[38,44]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i+3} />
        ))}
      </Base>
    </div>
  );
}

// ─── §01 · A·02 · Success Rate ─────────────────────────────────────────────
export function SuccessRateIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.line x1="8" y1="52" x2="56" y2="52" variants={pV} custom={0} />
        <motion.line x1="8" y1="52" x2="8" y2="12" variants={pV} custom={1} />
        <motion.path d="M14 46 L20 46 L20 52 L14 52 Z" variants={pV} custom={2} />
        <motion.path d="M16 44 L22 44 L22 50 L20 52 M22 50 L20 46" variants={pV} custom={3} />
        <motion.path d="M24 38 L30 38 L30 52 L24 52 Z" variants={pV} custom={4} />
        <motion.path d="M26 36 L32 36 L32 50 L30 52 M32 50 L30 38" variants={pV} custom={5} />
        <motion.path d="M34 28 L40 28 L40 52 L34 52 Z" variants={pV} custom={6} />
        <motion.path d="M36 26 L42 26 L42 50 L40 52 M42 50 L40 28" variants={pV} custom={7} />
        <motion.path d="M44 18 L50 18 L50 52 L44 52 Z" variants={pV} custom={8} />
        <motion.path d="M46 16 L52 16 L52 50 L50 52 M52 50 L50 18" variants={pV} custom={9} />
        <motion.path d="M14 42 L24 32 L34 22 L48 12" strokeDasharray="1.4 1.6" variants={pV} custom={10} />
        <motion.path d="M48 12 L42 12 M48 12 L48 18" variants={pV} custom={11} />
        {[[14,42],[24,32],[34,22],[14,46],[20,46],[24,38],[30,38],[34,28],[40,28],[44,18],[50,18],[8,52],[56,52]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={i===12?1.6:1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
        <motion.circle cx="48" cy="12" r="1.6" fill="currentColor" stroke="none" variants={dV} custom={13} />
      </Base>
    </div>
  );
}

// ─── §01 · A·03 · Volume Protected ────────────────────────────────────────
export function VolumeProtectedIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M32 6 L52 14 L52 32 C52 44 42 52 32 56 C22 52 12 44 12 32 L12 14 Z" variants={pV} custom={0} />
        <motion.path d="M32 4 L54 12 L54 30 C54 42 44 50 34 54" strokeDasharray="1.4 1.6" variants={pV} custom={1} />
        <motion.line x1="32" y1="6" x2="32" y2="4" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.line x1="52" y1="14" x2="54" y2="12" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.line x1="52" y1="32" x2="54" y2="30" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.ellipse cx="32" cy="30" rx="9" ry="3" variants={pV} custom={3} />
        <motion.path d="M23 30 L23 36 C23 37.6 27 39 32 39 C37 39 41 37.6 41 36 L41 30" variants={pV} custom={4} />
        <motion.path d="M23 36 L23 42 C23 43.6 27 45 32 45 C37 45 41 43.6 41 42 L41 36" variants={pV} custom={5} />
        {[[32,6],[52,14],[12,14],[32,56],[52,32],[12,32]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={cx===32&&cy===6?1.6:1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §02 · B·01 · Protocol (stacked layers) ───────────────────────────────
export function ProtocolIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        {/* top layer */}
        <motion.path d="M14 18 L32 10 L50 18 L32 26 Z" variants={pV} custom={0} />
        <motion.line x1="14" y1="18" x2="14" y2="22" variants={pV} custom={1} />
        <motion.line x1="50" y1="18" x2="50" y2="22" variants={pV} custom={1} />
        <motion.line x1="32" y1="26" x2="32" y2="30" variants={pV} custom={1} />
        <motion.path d="M14 22 L32 30 L50 22" variants={pV} custom={2} />
        {/* mid layer */}
        <motion.path d="M14 30 L32 22 L50 30 L32 38 Z" strokeDasharray="1.5 1.6" variants={pV} custom={3} />
        <motion.path d="M14 30 L14 34 M50 30 L50 34 M32 38 L32 42" variants={pV} custom={4} />
        <motion.path d="M14 34 L32 42 L50 34" variants={pV} custom={5} />
        {/* bottom layer */}
        <motion.path d="M14 42 L32 34 L50 42 L32 50 Z" strokeDasharray="1.5 1.6" variants={pV} custom={6} />
        <motion.path d="M14 42 L14 46 M50 42 L50 46 M32 50 L32 54" variants={pV} custom={7} />
        <motion.path d="M14 46 L32 54 L50 46" variants={pV} custom={8} />
        {[[14,18],[32,10],[50,18],[14,46],[50,46]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
        <motion.circle cx="32" cy="54" r="1.5" fill="currentColor" stroke="none" variants={dV} custom={5} />
      </Base>
    </div>
  );
}

// ─── §02 · B·02 · Zero Infrastructure ────────────────────────────────────
export function ZeroInfraIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M12 50 L32 58 L52 50 L32 42 Z" variants={pV} custom={0} />
        <motion.line x1="32" y1="42" x2="32" y2="38" variants={pV} custom={1} />
        <motion.ellipse cx="32" cy="26" rx="16" ry="14" variants={pV} custom={2} />
        <motion.ellipse cx="32" cy="26" rx="10" ry="8" strokeDasharray="1.5 1.6" variants={pV} custom={3} />
        <motion.line x1="20" y1="38" x2="44" y2="14" strokeWidth={1.4} variants={pV} custom={4} />
        {[[20,38],[44,14],[32,12],[32,40],[16,26],[48,26],[12,50],[52,50],[32,58],[32,42]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={i<2?1.5:1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §02 · B·03 · One Integration (two cubes + chain) ─────────────────────
export function OneIntegrationIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        {/* left cube */}
        <motion.path d="M6 26 L20 18 L20 38 L6 46 Z" variants={pV} custom={0} />
        <motion.path d="M6 26 L18 26 L18 46 M18 26 L20 18" variants={pV} custom={1} />
        <motion.path d="M6 46 L18 46" variants={pV} custom={2} />
        {/* right cube */}
        <motion.path d="M44 26 L58 18 L58 38 L44 46 Z" variants={pV} custom={3} />
        <motion.path d="M44 26 L56 26 L56 46 L44 46 M56 26 L58 18" variants={pV} custom={4} />
        {/* chain link */}
        <motion.line x1="20" y1="32" x2="28" y2="32" variants={pV} custom={5} />
        <motion.line x1="36" y1="32" x2="44" y2="32" variants={pV} custom={5} />
        <motion.rect x="26" y="28" width="12" height="8" rx="2" variants={pV} custom={6} />
        {[[6,26],[20,18],[20,38],[6,46],[44,26],[58,18],[58,38],[44,46]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §03 · C·01 · Wallets ─────────────────────────────────────────────────
export function WalletsIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M10 22 L46 22 L46 50 L10 50 Z" variants={pV} custom={0} />
        <motion.path d="M10 22 L18 14 L54 14 L46 22 M54 14 L54 42 L46 50 M54 42 L46 50" variants={pV} custom={1} />
        <motion.path d="M14 18 L40 18 L40 26 L14 26 Z" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.circle cx="40" cy="36" r="3" variants={pV} custom={3} />
        <motion.circle cx="40" cy="36" r="1" fill="currentColor" stroke="none" variants={dV} custom={0} />
        {[[10,22],[46,22],[46,50],[10,50],[18,14],[54,14],[54,42]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i+1} />
        ))}
      </Base>
    </div>
  );
}

// ─── §03 · C·02 · DeFi (3D coin) ──────────────────────────────────────────
export function DeFiIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.ellipse cx="32" cy="22" rx="20" ry="8" variants={pV} custom={0} />
        <motion.path d="M12 22 L12 32 C12 36.4 21 40 32 40 C43 40 52 36.4 52 32 L52 22" variants={pV} custom={1} />
        <motion.ellipse cx="32" cy="22" rx="12" ry="4.8" variants={pV} custom={2} />
        <motion.path d="M20 32 L20 38 L26 38" strokeDasharray="1.4 1.6" variants={pV} custom={3} />
        <motion.path d="M44 32 L44 38 L38 38" strokeDasharray="1.4 1.6" variants={pV} custom={3} />
        <motion.circle cx="32" cy="48" r="5" variants={pV} custom={4} />
        <motion.line x1="32" y1="40" x2="32" y2="43" variants={pV} custom={5} />
        <motion.line x1="26" y1="38" x2="29" y2="46" variants={pV} custom={5} />
        <motion.line x1="38" y1="38" x2="35" y2="46" variants={pV} custom={5} />
        {[[12,22],[52,22],[32,14],[20,38],[44,38],[32,48]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
        <motion.circle cx="32" cy="30" r="1.1" fill="currentColor" stroke="none" variants={dV} custom={6} />
      </Base>
    </div>
  );
}

// ─── §03 · C·03 · AI Marketplaces ─────────────────────────────────────────
export function MarketplacesIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M8 22 L56 22 L52 12 L12 12 Z" variants={pV} custom={0} />
        <motion.line x1="20" y1="12" x2="16" y2="22" variants={pV} custom={1} />
        <motion.line x1="32" y1="12" x2="32" y2="22" variants={pV} custom={1} />
        <motion.line x1="44" y1="12" x2="48" y2="22" variants={pV} custom={1} />
        <motion.path d="M12 22 L12 54 L52 54 L52 22" variants={pV} custom={2} />
        <motion.path d="M26 54 L26 36 L38 36 L38 54" variants={pV} custom={3} />
        <motion.circle cx="35" cy="46" r="0.9" fill="currentColor" stroke="none" variants={dV} custom={0} />
        <motion.rect x="16" y="28" width="6" height="4" variants={pV} custom={4} />
        <motion.rect x="42" y="28" width="6" height="4" variants={pV} custom={4} />
        {[[8,22],[56,22],[12,12],[52,12],[12,54],[52,54],[26,36],[38,36]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i+1} />
        ))}
      </Base>
    </div>
  );
}

// ─── §03 · C·05 · Portfolios ──────────────────────────────────────────────
export function PortfoliosIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M6 54 L46 54 L54 46 L14 46 Z" variants={pV} custom={0} />
        {/* bar 1 */}
        <motion.path d="M12 46 L20 46 L20 38 L12 38 Z" variants={pV} custom={1} />
        <motion.path d="M20 38 L24 34 L24 42 L20 46" variants={pV} custom={2} />
        <motion.path d="M12 38 L16 34 L24 34" variants={pV} custom={2} />
        {/* bar 2 */}
        <motion.path d="M24 46 L32 46 L32 28 L24 28 Z" variants={pV} custom={3} />
        <motion.path d="M32 28 L36 24 L36 42 L32 46" variants={pV} custom={4} />
        <motion.path d="M24 28 L28 24 L36 24" variants={pV} custom={4} />
        {/* bar 3 */}
        <motion.path d="M36 46 L44 46 L44 18 L36 18 Z" variants={pV} custom={5} />
        <motion.path d="M44 18 L48 14 L48 42 L44 46" variants={pV} custom={6} />
        <motion.path d="M36 18 L40 14 L48 14" variants={pV} custom={6} />
        {[[6,54],[46,54],[54,46],[16,34],[28,24],[40,14]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={i===5?1.5:1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
        <motion.circle cx="48" cy="14" r="1.5" fill="currentColor" stroke="none" variants={dV} custom={6} />
      </Base>
    </div>
  );
}

// ─── §04 · D·01 · Register Agent ─────────────────────────────────────────
export function RegisterIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.line x1="32" y1="6" x2="32" y2="28" variants={pV} custom={0} />
        <motion.path d="M24 14 L32 6 L40 14" variants={pV} custom={1} />
        <motion.path d="M12 32 L32 26 L52 32 L32 38 Z" variants={pV} custom={2} />
        <motion.path d="M12 32 L12 50 L32 56 L52 50 L52 32" variants={pV} custom={3} />
        <motion.line x1="32" y1="38" x2="32" y2="56" variants={pV} custom={4} />
        <motion.line x1="22" y1="34" x2="22" y2="53" strokeDasharray="1.4 1.6" variants={pV} custom={5} />
        <motion.line x1="42" y1="34" x2="42" y2="53" strokeDasharray="1.4 1.6" variants={pV} custom={5} />
        {[[32,6],[12,32],[52,32],[32,38],[12,50],[52,50],[32,56]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={cx===32&&cy===6?1.5:1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §04 · D·02 · Record Actions ─────────────────────────────────────────
export function RecordIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M10 12 L46 12 L54 20 L54 56 L18 56 L10 48 Z" variants={pV} custom={0} />
        <motion.path d="M46 12 L46 20 L54 20" variants={pV} custom={1} />
        <motion.path d="M10 48 L18 48 L18 56" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.line x1="16" y1="28" x2="48" y2="28" variants={pV} custom={3} />
        <motion.line x1="20" y1="26" x2="20" y2="30" variants={pV} custom={4} />
        <motion.line x1="28" y1="26" x2="28" y2="30" variants={pV} custom={4} />
        <motion.line x1="36" y1="26" x2="36" y2="30" variants={pV} custom={4} />
        <motion.line x1="44" y1="26" x2="44" y2="30" variants={pV} custom={4} />
        <motion.path d="M16 42 L22 42 L25 36 L29 48 L33 38 L37 44 L48 44" variants={pV} custom={5} />
        {[[10,12],[46,12],[54,20],[54,56],[18,56],[10,48],[20,28],[44,28],[25,36],[33,38]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.1+0.2*(i<6?1:0)} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §04 · D·03 · Earn Badge ─────────────────────────────────────────────
export function EarnBadgeIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M18 30 L14 56 L24 50 L28 40" variants={pV} custom={0} />
        <motion.path d="M46 30 L50 56 L40 50 L36 40" variants={pV} custom={0} />
        <motion.circle cx="32" cy="28" r="16" variants={pV} custom={1} />
        <motion.circle cx="32" cy="28" r="10" strokeDasharray="1.4 1.6" variants={pV} custom={2} />
        <motion.path d="M32 20 L34 26 L40 26 L35 30 L37 36 L32 32 L27 36 L29 30 L24 26 L30 26 Z" variants={pV} custom={3} />
        {[[32,12],[48,28],[16,28],[32,44],[14,56],[50,56]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §07 · G·01 · Success ────────────────────────────────────────────────
export function SuccessIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.circle cx="32" cy="32" r="22" variants={pV} custom={0} />
        <motion.circle cx="32" cy="32" r="15" strokeDasharray="1.4 1.6" variants={pV} custom={1} />
        <motion.path d="M22 32 L29 39 L44 24" strokeWidth={1.6} variants={pV} custom={2} />
        {[[32,10],[54,32],[32,54],[10,32]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
        <motion.circle cx="29" cy="39" r="1.4" fill="currentColor" stroke="none" variants={dV} custom={4} />
        <motion.circle cx="44" cy="24" r="1.4" fill="currentColor" stroke="none" variants={dV} custom={5} />
      </Base>
    </div>
  );
}

// ─── §07 · G·02 · Flagged ────────────────────────────────────────────────
export function FlaggedIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.line x1="16" y1="8" x2="16" y2="58" variants={pV} custom={0} />
        <motion.path d="M16 12 L48 14 L42 24 L48 34 L16 34 Z" variants={pV} custom={1} />
        <motion.line x1="10" y1="58" x2="22" y2="58" variants={pV} custom={2} />
        {[[16,8],[48,14],[48,34],[16,34],[16,58],[10,58],[22,58]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §07 · G·03 · Uptime (monitor + pulse) ───────────────────────────────
export function UptimeIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M6 10 L58 10 L58 44 L6 44 Z" variants={pV} custom={0} />
        <motion.path d="M20 44 L16 54 M44 44 L48 54 M16 54 L48 54" variants={pV} custom={1} />
        <motion.path d="M10 30 L18 30 L22 20 L27 40 L32 24 L37 34 L54 34" strokeWidth={1.4} variants={pV} custom={2} />
        {[[6,10],[58,10],[58,44],[6,44],[16,54],[48,54]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §07 · G·06 · Alert ──────────────────────────────────────────────────
export function AlertIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M32 8 L56 52 L8 52 Z" variants={pV} custom={0} />
        <motion.line x1="32" y1="24" x2="32" y2="38" strokeWidth={1.4} variants={pV} custom={1} />
        <motion.circle cx="32" cy="44" r="1.5" fill="currentColor" stroke="none" variants={dV} custom={0} />
        {[[32,8],[56,52],[8,52]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i+1} />
        ))}
      </Base>
    </div>
  );
}

// ─── §08 · E·01 · Banner Register (shield + person + plus) ───────────────
export function BannerRegisterIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M32 6 L50 14 L50 32 C50 44 42 52 32 56 C22 52 14 44 14 32 L14 14 Z" variants={pV} custom={0} />
        <motion.circle cx="27" cy="24" r="5" variants={pV} custom={1} />
        <motion.path d="M18 40 C18 34 22 30 27 30 C29 30 31 30.6 33 31.5" variants={pV} custom={2} />
        <motion.line x1="43" y1="20" x2="43" y2="32" strokeWidth={1.4} variants={pV} custom={3} />
        <motion.line x1="37" y1="26" x2="49" y2="26" strokeWidth={1.4} variants={pV} custom={4} />
        <motion.circle cx="43" cy="26" r="7" strokeDasharray="1 1.4" variants={pV} custom={5} />
        {[[32,6],[50,14],[50,32],[14,14],[14,32]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §08 · E·02 · Banner Record (iso panel + pulse) ──────────────────────
export function BannerRecordIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M6 14 L52 14 L52 50 L6 50 Z" variants={pV} custom={0} />
        <motion.path d="M52 14 L58 8 L58 44 L52 50" variants={pV} custom={1} />
        <motion.path d="M6 14 L12 8 L58 8" variants={pV} custom={2} />
        <motion.line x1="6" y1="23" x2="52" y2="23" strokeDasharray="1.4 1.6" variants={pV} custom={3} />
        <motion.line x1="6" y1="32" x2="52" y2="32" strokeDasharray="1.4 1.6" variants={pV} custom={3} />
        <motion.line x1="20" y1="14" x2="20" y2="50" strokeDasharray="1.4 1.6" variants={pV} custom={4} />
        <motion.line x1="36" y1="14" x2="36" y2="50" strokeDasharray="1.4 1.6" variants={pV} custom={4} />
        <motion.path d="M9 42 L16 42 L20 32 L26 50 L31 34 L36 42 L50 42" strokeWidth={1.5} variants={pV} custom={5} />
        {[[6,14],[52,14],[52,50],[6,50],[58,8],[58,44]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}

// ─── §08 · E·03 · Banner Reward (medal + ribbons + star) ─────────────────
export function BannerRewardIcon({ className }: P) {
  const { ref, a } = useAnim();
  return (
    <div ref={ref} className={className}>
      <Base a={a}>
        <motion.path d="M16 6 L22 28 L28 24 L32 34 L36 24 L42 28 L48 6" variants={pV} custom={0} />
        <motion.circle cx="32" cy="44" r="14" variants={pV} custom={1} />
        <motion.circle cx="32" cy="44" r="9" strokeDasharray="1 1.4" variants={pV} custom={2} />
        <motion.path d="M32 37 L33.8 42 L39 42 L35 45 L36.6 50 L32 47 L27.4 50 L29 45 L25 42 L30.2 42 Z" variants={pV} custom={3} />
        {[[16,6],[48,6],[32,58],[18,44],[46,44]].map(([cx,cy],i) => (
          <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.3} fill="currentColor" stroke="none" variants={dV} custom={i} />
        ))}
      </Base>
    </div>
  );
}
