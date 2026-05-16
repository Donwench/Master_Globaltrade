'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface TabsProps {
  tabs: Array<{ label: string; value: string; content: React.ReactNode }>;
  defaultValue?: string;
  className?: string;
}

export function Tabs({ tabs, defaultValue, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  return (
    <div className={className}>
      <div className="flex gap-4 border-b border-secondary-200 dark:border-secondary-700">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={clsx(
              'px-4 py-2 font-semibold transition-all duration-200 border-b-2 -mb-[2px]',
              activeTab === tab.value
                ? 'text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-secondary-600 border-transparent hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  );
}
