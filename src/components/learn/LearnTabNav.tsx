'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { BookOpen, Sun, Star, Moon, Timer, Orbit, Slice, Clock, FileSpreadsheet, LayoutGrid, CalendarClock, ArrowRightLeft, Heart, Calculator, Sparkles } from 'lucide-react';

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

  return (
    <nav className="overflow-x-auto scrollbar-hide border-b border-gold-primary/10 mb-8">
      <div className="flex gap-1 min-w-max px-1 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/learn' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-gold-primary/15 text-gold-light border border-gold-primary/30'
                  : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(tab.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
