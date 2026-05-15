'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'aegis-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4"
        >
          <div className="max-w-5xl mx-auto rounded-2xl glass-card-heavy border border-[rgba(255,255,255,0.1)] px-5 py-4 flex flex-wrap items-center gap-4">

            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-primary/10 border border-cyan-primary/20 flex items-center justify-center">
              <Cookie size={15} className="text-cyan-primary" />
            </div>

            {/* Text */}
            <p className="flex-1 text-text-secondary text-xs leading-relaxed min-w-[200px]">
              We use cookies to optimize your browsing experience for the purpose of personalizing and measuring the effectiveness of ads. By clicking "Allow All", you consent to our use of cookies.{' '}
              <a href="/docs/terms" className="text-cyan-primary hover:text-mint-secondary underline transition-colors">Privacy Policy</a>
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <a href="/docs/terms" className="text-text-muted text-xs hover:text-text-secondary transition-colors hidden sm:block">
                Manage Cookies
              </a>
              <button
                onClick={decline}
                className="px-4 py-2 rounded-full text-sm font-medium border border-[rgba(255,255,255,0.15)] text-text-secondary hover:text-text-primary hover:border-[rgba(255,255,255,0.25)] transition-all"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 rounded-full text-sm font-bold bg-cyan-primary text-bg-base hover:shadow-glow-cyan hover:scale-[1.03] transition-all"
              >
                Allow All
              </button>
              <button
                onClick={decline}
                className="text-text-muted hover:text-text-secondary transition-colors p-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
