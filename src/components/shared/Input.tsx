'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: ReactNode;
}

export function Input({ label, error, helpText, icon, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-secondary-500">{icon}</div>}
        <input
          className={clsx(
            'w-full px-4 py-2 rounded-lg border border-secondary-200 bg-white text-secondary-900 transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800 dark:text-white dark:border-secondary-700 dark:focus:border-primary-400',
            icon && 'pl-10',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
      {helpText && <p className="text-xs text-secondary-500 mt-1">{helpText}</p>}
    </div>
  );
}
