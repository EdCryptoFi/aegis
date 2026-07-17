'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Trophy,
  Award,
  Code2,
  BookOpen,
  Menu,
  X,
  Search,
  Globe,
} from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';

const navLinks = [
  { href: '/agents', label: 'Agents', icon: Users },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/badges', label: 'Badges', icon: Award },
  { href: '/for-protocols', label: 'For Protocols', icon: Globe },
  { href: '/developer', label: 'Developers', icon: Code2 },
  { href: '/docs', label: 'Docs', icon: BookOpen },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (q.startsWith('0x')) {
      router.push(`/agent/${q}`);
    } else {
      router.push(`/agents`);
    }
    setSearchQuery('');
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 20);
      setHidden(currentScroll > lastScroll && currentScroll > 100);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${
            scrolled
              ? 'bg-bg-base/80 backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] shadow-drop'
              : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Shield size={22} className="text-cyan-primary group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] transition-all" />
              <span className="text-lg font-display font-bold text-text-primary">
                Aegis
              </span>
              <span className="hidden sm:inline text-xs font-mono text-text-muted tracking-wider">
                Onchain
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href || router.pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative px-3.5 py-2 text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? 'text-cyan-primary border-b-2 border-cyan-primary pb-1'
                          : 'text-text-secondary hover:text-cyan-primary transition-colors'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-0 border border-[rgba(255,255,255,0.06)] w-56 focus-within:border-cyan-primary/30 transition-colors">
                <Search size={13} className="text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents 0x..."
                  className="bg-transparent outline-none font-mono text-[12px] tracking-wide text-text-primary placeholder-text-muted w-full"
                />
              </form>

              {/* Connect Wallet — styled as cyan pill */}
              <div className="hidden md:block connect-btn-wrapper">
                <ConnectButton />
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-[10px] text-text-secondary hover:text-text-primary hover:bg-surface-1 transition-colors"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-bg-base/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] overflow-hidden"
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = router.pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200
                          ${
                            isActive
                              ? 'bg-cyan-primary/10 text-cyan-primary'
                              : 'text-text-secondary hover:text-text-primary hover:bg-surface-1'
                          }
                        `}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
