// src/components/learn/LearnLayoutShell.tsx
'use client';

import LearnSidebar from './LearnSidebar';
import LearnSidebarMobile from './LearnSidebarMobile';
import LearnToolLinks from './LearnToolLinks';
import LearnPageNav from './LearnPageNav';

export default function LearnLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Desktop sidebar  –  hidden on mobile */}
      <div className="hidden lg:flex sticky top-20 h-[calc(100vh-80px)]">
        <LearnSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
        {children}
        {/* Curriculum next/prev — auto-detects current page from URL */}
        <LearnPageNav />
        {/* Cross-link: learn → tool. Reverse of tool → learn on tool pages. */}
        <LearnToolLinks />
      </div>

      {/* Mobile bottom sheet */}
      <LearnSidebarMobile />
    </div>
  );
}
