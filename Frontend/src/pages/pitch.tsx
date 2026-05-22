'use client';

import { useEffect, useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import GlowOrbs from '@/components/GlowOrbs';
import AegisLogo from '@/components/AegisLogo';

const links = [
  { label: 'Demo', href: 'https://aegisonchain.xyz', emoji: '🔗' },
  { label: 'Docs', href: 'https://aegisonchain.xyz/docs', emoji: '📚' },
  { label: 'Code', href: 'https://github.com/EdCryptoFi/aegis', emoji: '💻' },
  { label: 'Updates', href: 'https://x.com/aegisonchain', emoji: '🐦' },
];

export default function PitchPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg-base overflow-hidden px-6">
      <ParticleBackground />
      <GlowOrbs />

      <div className="absolute inset-0 pointer-events-none ambient-breathe" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent z-10" />

      <div className={`relative z-20 flex flex-col items-center text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="w-24 h-24 mb-8 opacity-60" style={{ filter: 'grayscale(1) sepia(0.9) hue-rotate(135deg) saturate(2.8) brightness(0.82)' }}>
          <AegisLogo className="w-full h-full" />
        </div>

        <h1 className="font-display text-[42px] md:text-[64px] font-black text-text-primary leading-none mb-8 tracking-tight">
          LET&apos;S BUILD
          <br />
          <span className="gradient-text-cyan">TOGETHER</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-3 max-w-xl mb-12">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-[12px] border border-cyan-primary/20 bg-cyan-primary/[0.04] text-text-primary font-display font-semibold text-sm hover:bg-cyan-primary/[0.1] hover:border-cyan-primary/40 hover:shadow-glow-cyan hover:scale-[1.04] transition-all"
            >
              <span className="text-lg">{link.emoji}</span>
              <span>{link.label}</span>
              <span className="text-cyan-primary/40 group-hover:text-cyan-primary/70 transition-colors text-xs font-mono ml-1">
                {link.href.replace('https://', '')}
              </span>
            </a>
          ))}
        </div>

        <p className="font-display text-xl text-text-secondary">
          Feedback welcome! <span className="inline-block hover:scale-110 transition-transform">🙏</span>
        </p>
      </div>
    </main>
  );
}
