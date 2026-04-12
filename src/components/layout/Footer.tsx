'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="relative z-10 mt-16 border-t border-gold-primary/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left — brand */}
          <div className="flex items-center gap-2">
            <span className="text-gold-primary/60 text-sm font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              Dekho Panchang
            </span>
            <span className="text-text-secondary/55 text-xs">&copy; 2026</span>
          </div>

          {/* Center — links */}
          <div className="flex items-center gap-4 text-xs text-text-secondary/70">
            <Link href="/panchang" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Panchang' : 'पंचांग'}
            </Link>
            <Link href="/kundali" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Kundali' : 'कुण्डली'}
            </Link>
            <Link href="/calendar" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Calendar' : 'पंचांग'}
            </Link>
            <Link href="/learn" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Learn' : 'सीखें'}
            </Link>
            <Link href="/about" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'About' : 'परिचय'}
            </Link>
            <Link href="/pricing" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Pricing' : 'मूल्य'}
            </Link>
            <Link href="/privacy" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Privacy' : 'गोपनीयता'}
            </Link>
            <Link href="/terms" className="hover:text-gold-light transition-colors">
              {!isDevanagariLocale(locale) ? 'Terms' : 'शर्तें'}
            </Link>
          </div>

          {/* Right — Sanskrit tagline */}
          <p className="text-gold-dark/40 text-xs" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            ॐ ज्योतिषां ज्योतिः
          </p>
        </div>
      </div>
    </footer>
  );
}
