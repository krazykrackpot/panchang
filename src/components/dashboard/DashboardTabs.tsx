'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabDef {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabDef[];
  defaultTab?: string;
}

export default function DashboardTabs({ tabs, defaultTab }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div>
      {/* Tab bar — sticky below navbar */}
      <div className="sticky top-[72px] z-30 bg-[#0a0e27]/95 backdrop-blur-sm py-3 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#d4a853]/20 text-[#f0d48a] border border-[#d4a853]/40 font-semibold'
                  : 'text-[#8a8478] border border-white/[0.06] hover:border-[#d4a853]/20 hover:text-[#e6e2d8]'
              }`}
            >
              {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {currentTab && (
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pt-4"
          >
            {currentTab.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
