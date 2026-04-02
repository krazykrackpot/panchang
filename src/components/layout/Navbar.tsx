'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import UserMenu from '@/components/auth/UserMenu';
import { useAuthStore } from '@/stores/auth-store';
import { useSubscription } from '@/hooks/useSubscription';
import { useLocationStore } from '@/stores/location-store';
import { Menu, X, Sun, Moon, ChevronDown, MapPin } from 'lucide-react';

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
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 py-2 bg-bg-primary/95 backdrop-blur-xl border border-gold-primary/20 rounded-xl shadow-2xl shadow-black/40 z-50"
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

  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/panchang', label: t('panchang') },
    { href: '/kundali', label: t('kundali') },
    { href: '/matching', label: t('matching') },
    {
      label: t('calendars'),
      children: [
        { href: '/calendar', label: t('festivals') },
        { href: '/transits', label: t('transits') },
        { href: '/retrograde', label: t('retrograde') },
        { href: '/eclipses', label: t('eclipses') },
        { href: '/muhurat', label: t('muhuratCalendar') },
        { href: '/regional', label: t('regional') },
      ],
    },
    {
      label: t('tools'),
      children: [
        { href: '/sign-calculator', label: t('signCalculator') },
        { href: '/sade-sati', label: t('sadeSati') },
        { href: '/prashna', label: t('prashna') },
        { href: '/baby-names', label: t('babyNames') },
        { href: '/shraddha', label: t('shraddha') },
        { href: '/vedic-time', label: t('vedicTime') },
        { href: '/upagraha', label: t('upagraha') },
        { href: '/puja', label: locale === 'en' ? 'Puja Vidhi' : 'पूजा विधि' },
        { href: '/sankalpa', label: locale === 'en' ? 'Sankalpa' : 'सङ्कल्प' },
        { href: '/devotional', label: t('devotional') },
        { href: '/varshaphal', label: t('varshaphal') },
        { href: '/kp-system', label: t('kpSystem') },
        { href: '/prashna-ashtamangala', label: t('ashtamangala') },
        { href: '/muhurta-ai', label: t('muhurtaAi') },
        { href: '/kaal-nirnaya', label: t('kaalNirnaya') },
        { href: '/nivas-shool', label: t('nivasShool') },
        { href: '/horoscope', label: t('horoscope') },
      ],
    },
    {
      label: t('learn'),
      href: '/learn',
    },
  ];

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-gold-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 mr-8">
            <div className="relative">
              <Sun className="w-6 h-6 text-gold-primary group-hover:text-gold-light transition-colors" />
              <Moon className="w-3 h-3 text-gold-light absolute -top-1 -right-1" />
            </div>
            <span className="text-lg font-semibold text-gold-gradient" style={{ fontFamily: 'var(--font-heading)' }}>
              Dekho Panchang
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item, i) => {
              const rendered = item.children ? (
                <NavDropdown key={i} label={item.label} items={item.children} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="text-text-secondary hover:text-gold-light transition-colors duration-200 text-sm font-medium"
                >
                  {item.label}
                </Link>
              );
              // Insert Dashboard link after Home (index 0)
              if (i === 0 && hydrated && user) {
                return (
                  <span key="__home_dash" className="contents">
                    {rendered}
                    <Link
                      href="/dashboard"
                      className="text-gold-light hover:text-gold-primary transition-colors duration-200 text-sm font-semibold"
                    >
                      {locale === 'sa' ? 'मम पटलम्' : locale === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}
                    </Link>
                  </span>
                );
              }
              return rendered;
            })}
          </div>

          {/* Right-side controls — separate container, above dropdown z-index */}
          <div className="hidden lg:flex items-center gap-3 relative z-[60]">
            {hydrated && locationStore.confirmed && locationStore.name && (
              <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                <MapPin className="w-3.5 h-3.5 text-gold-primary" />
                <span className="max-w-[140px] truncate">{locationStore.name}</span>
              </div>
            )}
            <div className="w-px h-6 bg-gold-primary/20" />
            <button
              onClick={() => {
                const html = document.documentElement;
                html.classList.toggle('light');
                html.classList.toggle('dark');
                localStorage.setItem('theme', html.classList.contains('light') ? 'light' : 'dark');
              }}
              className="text-text-secondary hover:text-gold-light transition-colors p-1.5 rounded-lg hover:bg-gold-primary/10"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>
            <LocaleSwitcher />
            {hydrated && tier === 'free' && (
              <a href={`/${locale}/pricing`} className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border border-gold-primary/40 rounded-lg text-gold-light hover:bg-gold-primary/30 transition-all">
                {locale === 'en' ? 'Upgrade' : 'अपग्रेड'}
              </a>
            )}
            {hydrated && isTrialing && trialDaysLeft > 0 && (
              <span className="text-gold-dark text-[10px]">
                {locale === 'en' ? `Trial: ${trialDaysLeft}d` : `परीक्षण: ${trialDaysLeft}दि`}
              </span>
            )}
            <UserMenu />
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-text-primary p-2"
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
                  {locale === 'sa' ? 'मम पटलम्' : locale === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}
                </Link>
              )}
              {navItems.map((item, i) => {
                if (item.children) {
                  const isExpanded = mobileExpanded === item.label;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                        className="flex items-center justify-between w-full text-left text-text-secondary hover:text-gold-light transition-colors px-3 py-2 rounded-lg"
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
                              className="block text-sm text-text-secondary/80 hover:text-gold-light transition-colors px-2 py-1.5"
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
                {tier === 'free' && (
                  <a href={`/${locale}/pricing`} className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border border-gold-primary/40 rounded-lg text-gold-light hover:bg-gold-primary/30 transition-all">
                    {locale === 'en' ? 'Upgrade' : 'अपग्रेड'}
                  </a>
                )}
                {isTrialing && trialDaysLeft > 0 && (
                  <span className="text-gold-dark text-[10px]">
                    {locale === 'en' ? `Trial: ${trialDaysLeft}d` : `परीक्षण: ${trialDaysLeft}दि`}
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
