'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { BookOpen, Sun, Star, Moon, Timer, Orbit, Slice, Clock, FileSpreadsheet, LayoutGrid, CalendarClock, ArrowRightLeft, Heart, Calculator, Sparkles, Menu, X } from 'lucide-react';

const tabs = [
  { href: '/learn', key: 'foundations', icon: BookOpen },
  { href: '/learn/grahas', key: 'grahas', icon: Sun },
  { href: '/learn/rashis', key: 'rashis', icon: Orbit },
  { href: '/learn/nakshatras', key: 'nakshatras', icon: Star },
  { href: '/learn/tithis', key: 'tithis', icon: Moon },
  { href: '/learn/yogas', key: 'yogas', icon: Timer },
  { href: '/learn/karanas', key: 'karanas', icon: Slice },
  { href: '/learn/muhurtas', key: 'muhurtas', icon: Clock },
  { href: '/learn/kundali', key: 'kundali', icon: FileSpreadsheet },
  { href: '/learn/bhavas', key: 'bhavas', icon: LayoutGrid },
  { href: '/learn/dashas', key: 'dashas', icon: CalendarClock },
  { href: '/learn/gochar', key: 'gochar', icon: ArrowRightLeft },
  { href: '/learn/matching', key: 'matching', icon: Heart },
  { href: '/learn/calculations', key: 'calculations', icon: Calculator },
  { href: '/learn/advanced', key: 'advanced', icon: Sparkles },
];

export default function LearnTabNav() {
  const t = useTranslations('learn');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeTab = tabs.find(tab =>
    tab.href === pathname || (tab.href !== '/learn' && pathname.startsWith(tab.href))
  );

  return (
    <>
      {/* Mobile: collapsible toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-card border border-gold-primary/15"
        >
          <div className="flex items-center gap-2 text-gold-light text-sm font-medium">
            {activeTab && (() => { const Icon = activeTab.icon; return <Icon className="w-4 h-4" />; })()}
            {activeTab ? t(activeTab.key) : t('foundations')}
          </div>
          {mobileOpen ? <X className="w-4 h-4 text-text-secondary" /> : <Menu className="w-4 h-4 text-text-secondary" />}
        </button>
        {mobileOpen && (
          <div className="mt-2 glass-card rounded-xl border border-gold-primary/10 p-2 grid grid-cols-2 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href || (tab.href !== '/learn' && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                      : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(tab.key)}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: hidden here — rendered in layout as sidebar */}
      <nav className="hidden lg:block" id="learn-sidebar-nav">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href !== '/learn' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                    : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t(tab.key)}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
