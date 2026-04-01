'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { useEffect } from 'react';
import { BookOpen, Sun, Star, Moon, Timer, Orbit, Slice, Clock, FileSpreadsheet, LayoutGrid, Grid3X3, CalendarClock, ArrowRightLeft, Heart, Calculator, Sparkles, Shield, RotateCcw, CheckCircle, Menu, X } from 'lucide-react';
import { useLearnProgressStore } from '@/stores/learn-progress-store';

function useLearnProgressStoreHook() {
  const store = useLearnProgressStore();
  useEffect(() => { store.loadFromStorage(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return store;
}
import type { LucideIcon } from 'lucide-react';

interface TabDef {
  href: string;
  key: string;
  icon: LucideIcon;
}

interface PhaseGroup {
  phase: string;
  label: { en: string; hi: string };
  tabs: TabDef[];
}

const phases: PhaseGroup[] = [
  {
    phase: '1',
    label: { en: 'The Sky', hi: 'आकाश' },
    tabs: [
      { href: '/learn', key: 'foundations', icon: BookOpen },
      { href: '/learn/grahas', key: 'grahas', icon: Sun },
      { href: '/learn/rashis', key: 'rashis', icon: Orbit },
      { href: '/learn/ayanamsha', key: 'ayanamsha', icon: RotateCcw },
    ],
  },
  {
    phase: '2',
    label: { en: 'Pancha Anga (5 Limbs)', hi: 'पञ्च अङ्ग' },
    tabs: [
      { href: '/learn/tithis', key: 'tithis', icon: Moon },
      { href: '/learn/nakshatras', key: 'nakshatras', icon: Star },
      { href: '/learn/yogas', key: 'yogas', icon: Timer },
      { href: '/learn/karanas', key: 'karanas', icon: Slice },
      { href: '/learn/vara', key: 'vara', icon: Sun },
    ],
  },
  {
    phase: '',
    label: { en: 'Time Divisions', hi: 'काल विभाग' },
    tabs: [
      { href: '/learn/muhurtas', key: 'muhurtas', icon: Clock },
    ],
  },
  {
    phase: '3',
    label: { en: 'The Chart', hi: 'कुण्डली' },
    tabs: [
      { href: '/learn/kundali', key: 'kundali', icon: FileSpreadsheet },
      { href: '/learn/bhavas', key: 'bhavas', icon: LayoutGrid },
      { href: '/learn/vargas', key: 'vargas', icon: Grid3X3 },
      { href: '/learn/dashas', key: 'dashas', icon: CalendarClock },
      { href: '/learn/gochar', key: 'gochar', icon: ArrowRightLeft },
    ],
  },
  {
    phase: '4',
    label: { en: 'Applied Jyotish', hi: 'प्रयुक्त ज्योतिष' },
    tabs: [
      { href: '/learn/matching', key: 'matching', icon: Heart },
      { href: '/learn/doshas', key: 'doshas', icon: Shield },
      { href: '/learn/calculations', key: 'calculations', icon: Calculator },
      { href: '/learn/advanced', key: 'advanced', icon: Sparkles },
    ],
  },
  {
    phase: '5',
    label: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान' },
    tabs: [
      { href: '/learn/classical-texts', key: 'classicalTexts', icon: BookOpen },
    ],
  },
];

const allTabs = phases.flatMap(p => p.tabs);

export default function LearnTabNav() {
  const t = useTranslations('learn');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isCompleted, loaded, loadFromStorage } = useLearnProgressStoreHook();

  const isActive = (href: string) =>
    pathname === href || (href !== '/learn' && pathname.startsWith(href));

  const activeTab = allTabs.find(tab => isActive(tab.href));

  return (
    <>
      {/* ── Mobile: collapsible dropdown ── */}
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
          <div className="mt-2 glass-card rounded-xl border border-gold-primary/10 p-3 space-y-3">
            {phases.map((phase) => (
              <div key={phase.phase}>
                <div className="text-gold-dark text-[9px] uppercase tracking-[0.15em] font-bold mb-1.5 px-1">
                  {phase.label.en}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {phase.tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = isActive(tab.href);
                    return (
                      <Link key={tab.key} href={tab.href} onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                            : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                        }`}>
                        <Icon className="w-3.5 h-3.5" />
                        {t(tab.key)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop: sidebar with phase headers ── */}
      <nav className="hidden lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1" id="learn-sidebar-nav">
        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase.phase}>
              <div className="text-gold-dark text-[9px] uppercase tracking-[0.2em] font-bold mb-1.5 px-4 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-[8px] text-gold-primary font-bold">
                  {phase.phase}
                </span>
                {phase.label.en}
              </div>
              <div className="flex flex-col gap-0.5">
                {phase.tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = isActive(tab.href);
                  return (
                    <Link key={tab.key} href={tab.href}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                          : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
                      }`}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{t(tab.key)}</span>
                      {loaded && isCompleted(tab.href) && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
