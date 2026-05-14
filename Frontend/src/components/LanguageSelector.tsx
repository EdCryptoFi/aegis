'use client';

import { useI18n } from '../lib/i18n';

const LOCALES = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
] as const;

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang-selector">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          className={locale === l.code ? 'active' : ''}
          onClick={() => setLocale(l.code as any)}
          title={l.label}
        >
          {l.flag} {l.label}
        </button>
      ))}
      <style jsx>{`
        .lang-selector {
          position: fixed;
          top: 20px;
          right: 140px;
          display: flex;
          gap: 4px;
          z-index: 999;
        }
        .lang-selector button {
          padding: 8px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .lang-selector button:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }
        .lang-selector button.active {
          background: var(--accent-primary);
          border-color: transparent;
          color: white;
        }
      `}</style>
    </div>
  );
}