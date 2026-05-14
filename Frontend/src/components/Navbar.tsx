'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/agents', label: 'Agents', icon: '🤖' },
  { href: '/architecture', label: 'Pipeline', icon: '⚙️' },
  { href: '/badges', label: 'Badges', icon: '🏅' },
  { href: '/leaderboard', label: 'Rank', icon: '📊' },
  { href: '/developer', label: 'Dev', icon: '🚀' },
  { href: '/docs', label: 'Docs', icon: '📖' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Aegis
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
      <div className="flex justify-around items-center h-16">
        {navLinks.slice(0, 4).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-400 hover:text-white"
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}