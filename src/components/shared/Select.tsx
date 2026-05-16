'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">{label}</label>}
      <select
        className={clsx(
          'w-full px-4 py-2 rounded-lg border border-secondary-200 bg-white text-secondary-900 transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:bg-secondary-800 dark:text-white dark:border-secondary-700',
          error && 'border-error-500 focus:border-error-500',
          className,
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
    </div>
  );
}
