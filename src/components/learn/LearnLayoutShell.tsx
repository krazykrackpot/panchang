// src/components/learn/LearnLayoutShell.tsx
'use client';

import LearnSidebar from './LearnSidebar';
import LearnSidebarMobile from './LearnSidebarMobile';

export default function LearnLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex sticky top-20 h-[calc(100vh-80px)]">
        <LearnSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>

      {/* Mobile bottom sheet */}
      <LearnSidebarMobile />
    </div>
  );
}
