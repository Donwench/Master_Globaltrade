'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

const getInitialState = (direction: string) => {
  switch (direction) {
    case 'left':
      return { x: -50, opacity: 0 };
    case 'right':
      return { x: 50, opacity: 0 };
    case 'up':
      return { y: 50, opacity: 0 };
    case 'down':
      return { y: -50, opacity: 0 };
    default:
      return { y: 50, opacity: 0 };
  }
};

export function SlideIn({ children, direction = 'up', delay = 0, duration = 0.5, className = '' }: SlideInProps) {
  return (
    <motion.div
      initial={getInitialState(direction)}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
