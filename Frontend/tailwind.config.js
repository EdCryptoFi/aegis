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
        // Premium Fintech Palette
        'bg-base': '#111416',
        'surface-1': '#161B1E',
        'surface-2': '#1C2327',
        'text-primary': '#e1e2e5',
        'text-secondary': '#a8aab2',

        // Accent Colors
        'cyan-primary': '#00F5FF',
        'mint-secondary': '#00FFA7',
        'purple-tertiary': '#7000FF',
        'error': '#ffb4ab',

        // Legacy colors (for backwards compatibility)
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        dark: '#0f0f23',
        darker: '#0a0a15',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        // Existing animations
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',

        // New premium animations
        'fade-up': 'fadeUp 0.4s ease-out',
        'fade-up-delay': 'fadeUp 0.4s ease-out 0.1s both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'icon-bounce': 'iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
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
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        iconBounce: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        // Neumorphic shadows
        'neu-outset': '6px 6px 12px rgba(0, 0, 0, 0.4)',
        'neu-inset': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5)',
        'drop': '0 8px 16px rgba(0, 0, 0, 0.3)',

        // Glow shadows
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.2)',
        'glow-cyan-intense': '0 0 20px rgba(0, 245, 255, 0.25)',
        'glow-inner-cyan': 'inset 0 0 10px rgba(0, 245, 255, 0.1)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyan-mint': 'linear-gradient(90deg, #00F5FF, #00FFA7)',
      },
      transitionDuration: {
        350: '350ms',
      },
    },
  },
  plugins: [],
}