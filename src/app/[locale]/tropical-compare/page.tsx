import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale, LocaleText } from '@/types/panchang';
import TropicalCompareClient from './TropicalCompareClient';

/**
 * Server-rendered Tropical-vs-Sidereal comparison page.
 *
 * Mirrors the sankalpa split (PR #282): the SEO-critical header (h1,
 * subtitle, description) is server-rendered here so Bingbot — flagged
 * this URL for missing <h1> on 2026-05-29 — sees the heading in the
 * initial HTML. The interactive form lives in TropicalCompareClient
 * because it depends on `useSearchParams`, framer-motion, and per-user
 * state. Without the Suspense wrapper the `useSearchParams` call inside
 * the client would bail the entire <main> subtree to a "Loading…"
 * spinner and crawlers would see nothing — even the h1.
 */
const HEADER_LABELS: Record<'pageTitle' | 'pageSubtitle' | 'pageDesc', LocaleText> = {
  pageTitle: { en: 'Sidereal vs Tropical', hi: 'सायन बनाम निरयन', sa: 'सायनं निरयनं च' },
  pageSubtitle: { en: 'Your Real Star Signs', hi: 'आपकी असली राशि', sa: 'वास्तविकराशिः' },
  pageDesc: {
    en: 'Enter your birth data to see how every planet shifts between the Western (Tropical) and Vedic (Sidereal) zodiac.',
    hi: 'अपना जन्म विवरण दर्ज करें और देखें कि प्रत्येक ग्रह पश्चिमी और वैदिक राशि चक्र में कैसे बदलता है।',
    sa: 'स्वजन्मविवरणं दत्त्वा सर्वेषां ग्रहाणां पाश्चात्यवैदिकराशिचक्रयोः भेदं पश्यतु।',
  },
};

export default async function TropicalComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isDevanagari = isDevanagariLocale(locale as Locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  return (
    <>
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3" style={headingFont}>
          <span className="text-gold-gradient">{tl(HEADER_LABELS.pageTitle, locale)}</span>
        </h1>
        <p className="text-xl sm:text-2xl text-text-primary mb-4" style={headingFont}>
          {tl(HEADER_LABELS.pageSubtitle, locale)}
        </p>
        <p className="text-text-secondary text-base max-w-2xl mx-auto" style={bodyFont}>
          {tl(HEADER_LABELS.pageDesc, locale)}
        </p>
      </header>

      <Suspense fallback={<TropicalCompareFallback />}>
        <TropicalCompareClient />
      </Suspense>
    </>
  );
}

/** Minimal skeleton shown while the client hydrates. Server-safe. */
function TropicalCompareFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" aria-label="Loading form">
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 sm:p-8 h-96 animate-pulse" />
    </div>
  );
}
