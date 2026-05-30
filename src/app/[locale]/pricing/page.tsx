import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale, LocaleText } from '@/types/panchang';
import PricingClient from './PricingClient';

/**
 * Server-rendered pricing page.
 *
 * Bingbot flagged /pricing for missing <h1> on 2026-05-29. The pre-split
 * page was 'use client' with useSearchParams() at module scope, opting
 * the whole route out of SSR. Crawlers saw navbar + starfield, no h1.
 *
 * Fix mirrors sankalpa (PR #282): the static hero (h1, subtitle) is
 * server-rendered here, the interactive billing/plan UI lives in
 * PricingClient inside a <Suspense> boundary that contains the
 * useSearchParams() bailout.
 */
const HEADER_LABELS: Record<'heading' | 'subtitle', LocaleText> = {
  heading: {
    en: 'Unlock the Full Power of Vedic Astrology',
    hi: 'वैदिक ज्योतिष की पूर्ण शक्ति अनलॉक करें',
    ta: 'வேத ஜோதிடத்தின் முழு சக்தியைத் திறக்கவும்',
    te: 'వేద జ్యోతిషం యొక్క పూర్తి శక్తిని అన్‌లాక్ చేయండి',
    bn: 'বৈদিক জ্যোতিষের পূর্ণ শক্তি আনলক করুন',
    kn: 'ವೈದಿಕ ಜ್ಯೋತಿಷದ ಪೂರ್ಣ ಶಕ್ತಿಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
    mr: 'वैदिक ज्योतिषाची पूर्ण शक्ती अनलॉक करा',
    gu: 'વૈદિક જ્યોતિષની સંપૂર્ણ શક્તિ અનલૉક કરો',
    mai: 'वैदिक ज्योतिषक पूर्ण शक्ति अनलॉक करू',
  },
  subtitle: {
    en: 'Choose the plan that fits your practice',
    hi: 'अपनी साधना के अनुरूप योजना चुनें',
    ta: 'உங்கள் பயிற்சிக்கு ஏற்ற திட்டத்தைத் தேர்ந்தெடுக்கவும்',
    te: 'మీ అభ్యాసానికి తగిన ప్లాన్ ఎంచుకోండి',
    bn: 'আপনার সাধনার উপযুক্ত পরিকল্পনা বেছে নিন',
    kn: 'ನಿಮ್ಮ ಅಭ್ಯಾಸಕ್ಕೆ ಹೊಂದುವ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    mr: 'आपल्या साधनेला अनुरूप योजना निवडा',
    gu: 'તમારી સાધના માટે યોગ્ય યોજના પસંદ કરો',
    mai: 'अपन साधनाक अनुरूप योजना चुनू',
  },
};

export default async function PricingPage({
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
      <section className="relative pt-24 pb-12 text-center px-4">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#f0d48a] via-[#d4a853] to-[#8a6d2b] bg-clip-text text-transparent"
          style={headingFont}
        >
          {tl(HEADER_LABELS.heading, locale)}
        </h1>
        <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto">
          {tl(HEADER_LABELS.subtitle, locale)}
        </p>
      </section>

      <Suspense fallback={<PricingFallback />}>
        <PricingClient />
      </Suspense>
    </>
  );
}

function PricingFallback() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" aria-label="Loading plans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl h-96 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
