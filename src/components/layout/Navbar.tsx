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
import { Menu, X, ChevronDown, MapPin } from 'lucide-react';
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

  // Auto-detect location on mount — detect() handles both fresh detection
  // and re-resolving empty/missing names for already-confirmed locations
  useEffect(() => { locationStore.detect(); }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const ritualsLabel = msg('rituals', locale);

  // 7 items — Brihaspati is the AI-astrologer hero entry point and earns a
  // dedicated nav slot (Lesson D: every feature reachable from main nav).
  // Logo IS home, Rituals folded into Tools.
  const navItems: NavItem[] = [
    { href: '/panchang', label: t('panchang') },
    { href: '/brihaspati', label: msg('brihaspati', locale) },
    { href: '/horoscope', label: t('horoscope') },
    { href: '/charts', label: t('kundali') },
    { href: '/calendars', label: t('calendars') },
    { href: '/tools', label: t('tools') },
    { href: '/learn', label: t('learn') },
  ];

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-gold-primary/10">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center h-16">
          {/* Left  –  Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 32 32" className="w-10 h-10 group-hover:scale-105 transition-transform" aria-hidden="true">
                <rect width="32" height="32" rx="7" fill="#0a0e27" />
                <text x="16" y="23" textAnchor="middle" fontSize="24" fontWeight="900" fill="#e8c55a" fontFamily="serif">ॐ</text>
              </svg>
            </div>
            <span className="text-xl font-bold text-gold-gradient hidden sm:inline" style={{ fontFamily: 'var(--font-heading)' }}>
              Dekho Panchang
            </span>
          </Link>

          {/* Spacer  –  small gap between logo and nav */}
          <div className="min-w-6 lg:min-w-10" />

          {/* Center  –  Nav links */}
          <div className="hidden lg:flex items-center gap-4">
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
                      {...(!(hydrated && user) ? { 'aria-hidden': true, tabIndex: -1 } : {})}
                    >
                      {locale === 'sa' ? 'मम पटलम्' : msg('dashboard', locale)}
                    </Link>
                    <Link
                      href="/dashboard/family"
                      className={`text-gold-light/70 hover:text-gold-primary transition-all duration-200 text-sm whitespace-nowrap ${hydrated && user ? 'opacity-100' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}`}
                      {...(!(hydrated && user) ? { 'aria-hidden': true, tabIndex: -1 } : {})}
                    >
                      {tl({ en: 'Family', hi: 'परिवार', sa: 'कुटुम्बम्', ta: 'குடும்பம்', bn: 'পরিবার', te: 'కుటుంబం', gu: 'કુટુંબ', kn: 'ಕುಟುಂಬ', mr: 'कुटुंब', mai: 'परिवार' }, locale)}
                    </Link>
                  </span>
                );
              }
              return rendered;
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-4 lg:min-w-8" />

          {/* Right  –  Controls */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1.5 text-text-secondary text-xs transition-opacity duration-150 ${hydrated && locationStore.confirmed && locationStore.name ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <MapPin className="w-3.5 h-3.5 text-gold-primary" />
              <span className="max-w-[80px] truncate" suppressHydrationWarning>{hydrated ? (locationStore.name || '\u00A0') : '\u00A0'}</span>
            </div>
            {hydrated && user && <NotificationBell />}
            <SearchModal />
            <LocaleSwitcher />
            {hydrated && isTrialing && trialDaysLeft > 0 && (
              <span className="text-gold-dark text-xs whitespace-nowrap">
                {tl({ en: `Trial: ${trialDaysLeft}d`, hi: `परीक्षण: ${trialDaysLeft}दि`, sa: `परीक्षण: ${trialDaysLeft}दि` }, locale)}
              </span>
            )}
            <UserMenu />
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-text-primary p-3"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gold-primary/10 max-h-[80vh] overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-1">
              {hydrated && user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gold-light hover:text-gold-primary transition-colors px-3 py-3 text-sm font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    {locale === 'sa' ? 'मम पटलम्' : msg('myDashboard', locale)}
                  </Link>
                  <Link
                    href="/dashboard/family"
                    className="text-gold-light/70 hover:text-gold-primary transition-colors px-3 py-3 text-sm pl-6"
                    onClick={() => setIsOpen(false)}
                  >
                    {tl({ en: 'Family', hi: 'परिवार', sa: 'कुटुम्बम्', ta: 'குடும்பம்', bn: 'পরিবার', te: 'కుటుంబం', gu: 'કુટુંબ', kn: 'ಕುಟುಂಬ', mr: 'कुटुंब', mai: 'परिवार' }, locale)}
                  </Link>
                </>
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
                    className="text-text-secondary hover:text-gold-light transition-colors px-3 py-3 text-sm font-medium"
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
