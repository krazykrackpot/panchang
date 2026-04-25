'use client';

import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import MSG from '@/messages/components/navbar.json';
const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);
import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import UserMenu from '@/components/auth/UserMenu';
import { useAuthStore } from '@/stores/auth-store';
import { useSubscription } from '@/hooks/useSubscription';
import { useLocationStore } from '@/stores/location-store';
import dynamic from 'next/dynamic';
import { Menu, X, Sun, Moon, ChevronDown, MapPin } from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const NotificationBell = dynamic(() => import('@/components/notifications/NotificationBell'), { ssr: false });
const SearchModal = dynamic(() => import('@/components/search/SearchModal'), { ssr: false });

interface DropdownItem {
  href: string;
  label: string;
}

interface NavItem {
  href?: string;
  label: string;
  children?: DropdownItem[];
}

function NavDropdown({ label, items, onNavigate }: { label: string; items: DropdownItem[]; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 max-w-[calc(100vw-2rem)] py-2 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => { setOpen(false); onNavigate?.(); }}
              className="block px-4 py-2 text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { user } = useAuthStore();
  const { tier, isTrialing, trialDaysLeft } = useSubscription();
  const locationStore = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Mark as hydrated after mount to avoid SSR/client mismatch
  useEffect(() => { setHydrated(true); }, []);

  // Auto-detect location on mount
  useEffect(() => { locationStore.detect(); }, []);

  const ritualsLabel = msg('rituals', locale);

  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/panchang', label: t('panchang') },
    {
      label: t('kundali'),
      children: [
        { href: '/kundali', label: t('kundali') },
        { href: '/matching', label: t('matching') },
        { href: '/kundali/compare', label: msg('chartComparison', locale) },
        { href: '/annual-forecast', label: msg('annualForecast', locale) },
        { href: '/varshaphal', label: t('varshaphal') },
        { href: '/tithi-pravesha', label: msg('tithiPravesha', locale) },
        { href: '/kp-system', label: t('kpSystem') },
        { href: '/sade-sati', label: t('sadeSati') },
      ],
    },
    {
      label: ritualsLabel,
      children: [
        { href: '/puja', label: msg('pujaVidhi', locale) },
        { href: '/sankalpa', label: msg('sankalpa', locale) },
        { href: '/devotional', label: t('devotional') },
        { href: '/shraddha', label: t('shraddha') },
        { href: '/muhurta-ai', label: t('muhurtaAi') },
      ],
    },
    {
      label: t('calendars'),
      children: [
        { href: '/calendar', label: t('festivals') },
        { href: '/horoscope', label: msg('horoscope', locale) },
        { href: '/transits', label: t('transits') },
        { href: '/retrograde', label: t('retrograde') },
        { href: '/eclipses', label: t('eclipses') },
        { href: '/muhurat', label: t('muhuratCalendar') },
        { href: '/regional', label: t('regional') },
        { href: '/dates/ekadashi', label: locale === 'sa' ? 'एकादशीतिथयः' : msg('ekadashiDates', locale) },
        { href: '/dates/purnima', label: locale === 'sa' ? 'पूर्णिमातिथयः' : msg('purnimasDates', locale) },
        { href: '/dates/amavasya', label: msg('amavasyaDates', locale) },
        { href: '/dates/pradosham', label: msg('pradoshamDates', locale) },
        { href: '/dates/chaturthi', label: msg('chaturthiDates', locale) },
      ],
    },
    {
      label: t('tools'),
      children: [
        { href: '/sign-calculator', label: t('signCalculator') },
        { href: '/medical-astrology', label: t('medicalAstrology') },
        { href: '/baby-names', label: t('babyNames') },
        { href: '/vedic-time', label: t('vedicTime') },
        { href: '/prashna', label: t('prashna') },
        { href: '/prashna-ashtamangala', label: t('ashtamangala') },
        { href: '/upagraha', label: t('upagraha') },
        { href: '/kaal-nirnaya', label: t('kaalNirnaya') },
        { href: '/nivas-shool', label: t('nivasShool') },
        { href: '/rahu-kaal', label: locale === 'sa' ? 'राहुकालः' : msg('rahuKaal', locale) },
        { href: '/choghadiya', label: msg('choghadiya', locale) },
        { href: '/hora', label: locale === 'sa' ? 'होराः' : locale === 'hi' ? 'होरा' : 'Hora' },
        { href: '/sarvatobhadra', label: locale === 'sa' ? 'सर्वतोभद्रचक्रम्' : locale === 'hi' ? 'सर्वतोभद्र चक्र' : 'Sarvatobhadra' },
      ],
    },
    {
      label: t('learn'),
      href: '/learn',
    },
  ];

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-gold-primary/10">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center h-16">
          {/* Left — Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative">
              <Sun className="w-7 h-7 text-gold-primary group-hover:text-gold-light transition-colors" />
              <Moon className="w-3.5 h-3.5 text-gold-light absolute -top-1 -right-1" />
            </div>
            <span className="text-xl font-bold text-gold-gradient hidden sm:inline" style={{ fontFamily: 'var(--font-heading)' }}>
              Dekho Panchang
            </span>
          </Link>

          {/* Spacer — small gap between logo and nav */}
          <div className="min-w-6 lg:min-w-10" />

          {/* Center — Nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item, i) => {
              const rendered = item.children ? (
                <NavDropdown key={i} label={item.label} items={item.children} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </Link>
              );
              // Insert Dashboard link after Home (index 0)
              if (i === 0) {
                return (
                  <span key="__home_dash" className="contents">
                    {rendered}
                    <Link
                      href="/dashboard"
                      className={`text-gold-light hover:text-gold-primary transition-all duration-200 text-sm font-semibold whitespace-nowrap ${hydrated && user ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}
                    >
                      {locale === 'sa' ? 'मम पटलम्' : msg('dashboard', locale)}
                    </Link>
                  </span>
                );
              }
              return rendered;
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-4 lg:min-w-8" />

          {/* Right — Controls */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-1.5 text-text-secondary text-xs transition-opacity duration-150 ${hydrated && locationStore.confirmed && locationStore.name ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <MapPin className="w-3.5 h-3.5 text-gold-primary" />
              <span className="max-w-[150px] truncate" suppressHydrationWarning>{hydrated ? (locationStore.name || '\u00A0') : '\u00A0'}</span>
            </div>
            <div className={`transition-opacity duration-150 ${hydrated && user ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <NotificationBell />
            </div>
            <SearchModal />
            <div className="w-px h-5 bg-gold-primary/15" />
            <LocaleSwitcher />
            <div className={`transition-opacity duration-150 ${hydrated && isTrialing && trialDaysLeft > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <span className="text-gold-dark text-xs whitespace-nowrap">
                {tl({ en: `Trial: ${trialDaysLeft}d`, hi: `परीक्षण: ${trialDaysLeft}दि`, sa: `परीक्षण: ${trialDaysLeft}दि` }, locale)}
              </span>
            </div>
            <UserMenu />
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-text-primary p-2.5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gold-primary/10 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {hydrated && user && (
                <Link
                  href="/dashboard"
                  className="text-gold-light hover:text-gold-primary transition-colors px-3 py-2 text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  {locale === 'sa' ? 'मम पटलम्' : msg('myDashboard', locale)}
                </Link>
              )}
              {navItems.map((item, i) => {
                if (item.children) {
                  const isExpanded = mobileExpanded === item.label;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                        className="flex items-center justify-between w-full text-left text-text-secondary hover:text-gold-light transition-colors px-3 py-2.5 rounded-lg"
                      >
                        <span className="text-sm font-medium">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="ml-4 border-l border-gold-primary/15 pl-3 mb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block text-sm text-text-secondary/80 hover:text-gold-light transition-colors px-2 py-2.5"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className="text-text-secondary hover:text-gold-light transition-colors px-3 py-2 text-sm font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-gold-primary/10 flex items-center gap-3">
                <LocaleSwitcher />
                {isTrialing && trialDaysLeft > 0 && (
                  <span className="text-gold-dark text-xs">
                    {tl({ en: `Trial: ${trialDaysLeft}d`, hi: `परीक्षण: ${trialDaysLeft}दि`, sa: `परीक्षण: ${trialDaysLeft}दि` }, locale)}
                  </span>
                )}
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
