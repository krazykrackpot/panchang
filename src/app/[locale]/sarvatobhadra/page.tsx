import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale, LocaleText } from '@/types/panchang';
import SarvatobhadraClient from './SarvatobhadraClient';

/**
 * Server-rendered Sarvatobhadra Chakra page.
 *
 * Bingbot flagged /sarvatobhadra for missing <h1> on 2026-05-29. The
 * original `'use client'` page used dynamic-only hooks (Zustand birth
 * store, useLocale), which deopted the whole route from SSR. Bingbot
 * saw navbar + starfield, no heading.
 *
 * Same shape as sankalpa (PR #282) / tropical-compare: the SEO header
 * (h1 + subtitle) is server-rendered here; the interactive grid and
 * nakshatra picker live in SarvatobhadraClient inside <Suspense> so
 * any client-rendering bailout is contained below the h1.
 */
const HEADER_LABELS: Record<'title' | 'subtitle', LocaleText> = {
  title: {
    en: 'Sarvatobhadra Chakra',
    hi: 'सर्वतोभद्र चक्र',
    sa: 'सर्वतोभद्रचक्रम्',
  },
  subtitle: {
    en: 'Vedic 9×9 Vedha Analysis Grid',
    hi: 'वैदिक 9×9 वेध विश्लेषण ग्रिड',
    sa: 'वैदिकं 9×9 वेधविश्लेषणजालम्',
  },
};

export default async function SarvatobhadraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headingFont = isDevanagariLocale(locale as Locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  return (
    <>
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center mb-12">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={headingFont}
        >
          <span className="text-gold-gradient">{tl(HEADER_LABELS.title, locale)}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {tl(HEADER_LABELS.subtitle, locale)}
        </p>
      </header>

      <Suspense fallback={<SarvatobhadraFallback />}>
        <SarvatobhadraClient />
      </Suspense>
    </>
  );
}

function SarvatobhadraFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" aria-label="Loading chakra">
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl h-[600px] animate-pulse" />
    </div>
  );
}
