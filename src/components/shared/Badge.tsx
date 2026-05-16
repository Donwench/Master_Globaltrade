'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
  secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300',
  success: 'bg-success-100 text-success-700 dark:bg-green-900 dark:text-green-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'bg-error-100 text-error-700 dark:bg-red-900 dark:text-red-300',
};

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
