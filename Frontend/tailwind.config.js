/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Luminous Fintech Design System
        'bg-base': '#0c0f11',
        'surface-0': '#111416',
        'surface-1': '#161B1E',
        'surface-2': '#1C2327',
        'surface-3': '#272a2c',
        'surface-bright': '#37393c',

        'text-primary': '#e1e2e5',
        'text-secondary': '#b9caca',
        'text-muted': '#849495',

        'cyan-primary': '#00D4B8',
        'cyan-dim': '#00b89f',
        'mint-secondary': '#00EED4',
        'mint-dim': '#00ccb8',
        'purple-tertiary': '#7000FF',
        'purple-dim': '#d1bcff',

        'border-glass': 'rgba(255, 255, 255, 0.08)',

        'glow-cyan': 'rgba(0, 212, 184, 0.15)',
        'glow-mint': 'rgba(0, 255, 167, 0.15)',
        'glow-purple': 'rgba(112, 0, 255, 0.15)',

        // Semantic
        success: '#00EED4',
        warning: '#f59e0b',
        error: '#ef4444',
        danger: '#ef4444',

        // Legacy compat
        primary: '#00D4B8',
        secondary: '#00EED4',
        dark: '#0c0f11',
        darker: '#080a0c',
      },
      fontFamily: {
        display: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-xs': ['10px', { lineHeight: '14px', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '24px',
        'btn': '16px',
        'pill': '9999px',
        'input': '12px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 184, 0.15)',
        'glow-cyan-intense': '0 0 30px rgba(0, 212, 184, 0.25)',
        'glow-mint': '0 0 20px rgba(0, 255, 167, 0.15)',
        'glow-purple': '0 0 20px rgba(112, 0, 255, 0.15)',
        'neu-outset': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'neu-inset': 'inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.03)',
        'drop': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 32px rgba(0, 212, 184, 0.12), 0 0 1px rgba(0, 212, 184, 0.3)',
        'glow-inner-cyan': 'inset 0 0 10px rgba(0, 212, 184, 0.1)',
      },
      backgroundImage: {
        'gradient-cyan-mint': 'linear-gradient(135deg, #00D4B8, #00EED4)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #00D4B8, #7000FF)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #0c0f11 0%, #111416 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-up-delay': 'fadeUp 0.4s ease-out 0.1s both',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'icon-bounce': 'iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        iconBounce: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      transitionDuration: {
        350: '350ms',
      },
    },
  },
  plugins: [],
};
