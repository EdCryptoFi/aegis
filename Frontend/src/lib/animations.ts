// Reusable Framer Motion animation variants for premium design system

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

export const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const cardItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4 },
  },
  hover: {
    y: -4,
    boxShadow: '0 0 20px rgba(0, 245, 255, 0.25)',
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
};

export const buttonHoverVariants = {
  hover: {
    scale: 1.02,
    boxShadow: '0 0 12px rgba(0, 245, 255, 0.3)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const iconBounceVariants = {
  hover: {
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10,
    },
  },
};

export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const slideInRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

export const floatingVariants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const glowPulseVariants = {
  animate: {
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const shimmerVariants = {
  animate: {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const rotateVariants = {
  initial: { rotate: 0 },
  animate: { rotate: 180, transition: { duration: 0.3 } },
};

export const pageTransitionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Staggered grid animation
export const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// Popover/modal animation
export const popoverVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

// Underline reveal animation
export const underlineVariants = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: { duration: 0.4 },
  },
};

// Counter animation for stats
export const countUpVariants = {
  visible: {
    transition: {
      delay: 0.2,
      duration: 1.5,
    },
  },
};
