'use client';

export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary-300 border-t-primary-500 dark:border-secondary-600 dark:border-t-primary-400"></div>
    </div>
  );
}
