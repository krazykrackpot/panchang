'use client';

import { Link } from '@/lib/i18n/navigation';
import { useLocale } from 'next-intl';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BYLINE: Record<string, { contentBy: string; tagline: string }> = {
  en: { contentBy: 'Content by', tagline: 'Maithil Brahmin, Seeker of Vedic Wisdom' },
  hi: { contentBy: 'लेखक:', tagline: 'मैथिल ब्राह्मण, वैदिक ज्ञान के अन्वेषक' },
  sa: { contentBy: 'लेखकः:', tagline: 'मैथिलब्राह्मणः, वैदिकज्ञानान्वेषकः' },
  ta: { contentBy: 'Content by', tagline: 'Maithil Brahmin, Seeker of Vedic Wisdom' },
  bn: { contentBy: 'Content by', tagline: 'Maithil Brahmin, Seeker of Vedic Wisdom' },
};

/**
 * E-E-A-T author attribution byline — small, unobtrusive footer element
 * linking to the About page with author credentials.
 */
export default function AuthorByline({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const b = BYLINE[locale] || BYLINE.en;
  const isDevanagari = isDevanagariLocale(locale);

  return (
    <div
      className={`mt-8 pt-4 border-t border-gold-primary/10 text-text-secondary text-xs ${className}`}
      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
    >
      <span>{b.contentBy} </span>
      <Link href="/about" className="text-gold-primary hover:text-gold-light transition-colors">
        Aditya Kumar
      </Link>
      <span> — {b.tagline}</span>
    </div>
  );
}
