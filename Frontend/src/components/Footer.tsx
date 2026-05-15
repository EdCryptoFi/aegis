'use client';

import Link from 'next/link';

const footerLinks = {
  Platform: [
    { label: 'Agents', href: '/agents' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Badges', href: '/badges' },
    { label: 'Architecture', href: '/architecture' },
  ],
  Developers: [
    { label: 'SDK Docs', href: '/developer' },
    { label: 'API Reference', href: '/docs' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/docs/terms' },
    { label: 'FAQ', href: '/docs/faq' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-bg-base">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-display font-bold gradient-text-cyan">
                Aegis
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-[240px]">
              On-chain reputation oracle for AI agents on Sui. Trust isn't asked for — it's proven.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-label-sm font-mono text-text-muted uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-cyan-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted font-mono">
            Built for Sui Overflow 2026
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://sui.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-cyan-primary transition-colors"
            >
              Powered by Sui
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
