'use client';
import React from 'react';

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface SmallScreenTabsProps {
  readonly activeTab: string;
  readonly setActiveTab: (value: string) => void;
  readonly tabs: ReadonlyArray<Tab>;
}

function SmallScreenTabs({
  activeTab,
  setActiveTab,
  tabs,
}: SmallScreenTabsProps) {
  return (
    <section className="md:hidden border border-gray-200 bg-gray-100 mt-10 mb-5 rounded-md">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center justify-center py-2 text-base font-medium ${
                activeTab === tab.id
                  ? 'bg-white rounded-md text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} <span className="text-sm ml-1"> ({tab.count})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SmallScreenTabs;
