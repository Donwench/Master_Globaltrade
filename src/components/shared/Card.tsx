'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', glass = false, hover = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl p-6 transition-all duration-300',
        glass ? 'glass-effect' : 'bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700',
        hover && 'hover:shadow-lg dark:hover:shadow-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
