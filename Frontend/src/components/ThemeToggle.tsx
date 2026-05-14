'use client';

import { useTheme } from '../lib/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}