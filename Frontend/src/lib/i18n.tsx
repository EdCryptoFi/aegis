'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'pt' | 'es';

interface Translations {
  [key: string]: {
    en: string;
    pt: string;
    es: string;
  };
}

const translations: Translations = {
  'nav.home': { en: 'Home', pt: 'Início', es: 'Inicio' },
  'nav.agents': { en: 'Agents', pt: 'Agentes', es: 'Agentes' },
  'nav.leaderboard': { en: 'Leaderboard', pt: 'Ranking', es: 'Ranking' },
  'nav.badges': { en: 'Badges', pt: 'Badges', es: 'Insignias' },
  'nav.developer': { en: 'Developer', pt: 'Desenvolvedor', es: 'Desarrollador' },
  'nav.docs': { en: 'Docs', pt: 'Docs', es: 'Docs' },
  'home.title': { en: 'Aegis', pt: 'Aegis', es: 'Aegis' },
  'home.subtitle': { en: 'Trust is not asked. It\'s proven. Onchain.', pt: 'Confiança não é pedida. É provada. Onchain.', es: 'La confianza no se pide. Se demuestra. Onchain.' },
  'home.useAgent': { en: 'Use an Agent', pt: 'Usar Agente', es: 'Usar Agente' },
  'home.getBadge': { en: 'Get Badge', pt: 'Adquirir Badge', es: 'Obtener Insignia' },
  'home.deploy': { en: 'Deploy Agent', pt: 'Deploy Agente', es: 'Desplegar Agente' },
  'home.topAgents': { en: 'Top Agents', pt: 'Top Agentes', es: 'Top Agentes' },
  'home.search': { en: 'Search agent by address', pt: 'Buscar agente por endereço', es: 'Buscar agente por dirección' },
  'status.flagged': { en: 'Flagged', pt: 'Sinalizado', es: 'Señalizado' },
  'status.high': { en: 'High', pt: 'Alto', es: 'Alto' },
  'status.medium': { en: 'Medium', pt: 'Médio', es: 'Medio' },
  'status.low': { en: 'Low', pt: 'Baixo', es: 'Bajo' },
  'badge.bronze': { en: 'Bronze', pt: 'Bronze', es: 'Bronce' },
  'badge.silver': { en: 'Silver', pt: 'Prata', es: 'Plata' },
  'badge.gold': { en: 'Gold', pt: 'Ouro', es: 'Oro' },
  'metrics.uptime': { en: 'Uptime', pt: 'Uptime', es: 'Uptime' },
  'metrics.volume': { en: 'Volume', pt: 'Volume', es: 'Volumen' },
  'metrics.executions': { en: 'Executions', pt: 'Execuções', es: 'Ejecuciones' },
  'metrics.success': { en: 'Success Rate', pt: 'Taxa de Sucesso', es: 'Tasa de Éxito' },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('aegis-locale') as Locale;
    if (stored && ['en', 'pt', 'es'].includes(stored)) {
      setLocale(stored);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'pt', 'es'].includes(browserLang)) {
        setLocale(browserLang as Locale);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('aegis-locale', locale);
    }
  }, [locale, mounted]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][locale] || translations[key].en;
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}