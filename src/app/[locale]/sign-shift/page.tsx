import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale, LocaleText } from '@/types/panchang';
import SignShiftClient from './SignShiftClient';

/**
 * Server-rendered sign-shift page.
 *
 * Bingbot flagged /sign-shift for missing <h1> on 2026-05-29. The
 * pre-split page DID have a `motion.h1` inside SignShiftPageInner, but
 * that inner was wrapped in a Suspense fallback that rendered only a
 * spinner. Because the inner uses `useSearchParams()`, the entire
 * subtree (including the h1) was deopted to client-side rendering;
 * Bingbot's initial HTML contained the spinner fallback, not the h1.
 *
 * Same shape as sankalpa (PR #282) / tropical-compare / pricing /
 * sarvatobhadra: the SEO header (h1 + subtitle) is server-rendered
 * here so it lands in the SSR HTML regardless of what hooks the
 * client uses. SignShiftClient holds the interactive form + chart
 * comparison inside <Suspense>; framer-motion only handles
 * one-shot mount animation which we drop on the server header.
 */
const HEADER_LABELS: Record<'heroTitle' | 'heroSubtitle', LocaleText> = {
  heroTitle: {
    en: 'Why Your Western Horoscope Might Be Wrong',
    hi: 'आपकी पश्चिमी राशि गलत क्यों हो सकती है',
    ta: 'உங்கள் மேற்கத்திய ஜாதகம் ஏன் தவறாக இருக்கலாம்',
    bn: 'আপনার পশ্চিমা রাশিফল কেন ভুল হতে পারে',
  },
  heroSubtitle: {
    en: 'See how the 24° shift between tropical and sidereal zodiacs changes your entire chart',
    hi: 'देखें कि सायन और निरयन राशिचक्र के बीच 24° का अंतर आपकी पूरी कुण्डली कैसे बदलता है',
    ta: 'சாயன மற்றும் நிரயன ராசி மண்டலங்களுக்கு இடையே 24° மாற்றம் உங்கள் முழு ஜாதகத்தையும் எவ்வாறு மாற்றுகிறது',
    bn: 'সায়ন ও নিরয়ন রাশিচক্রের মধ্যে 24° পার্থক্য আপনার পুরো কুণ্ডলী কীভাবে বদলায়',
  },
};

export default async function SignShiftPage({
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
      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,168,83,0.06)_0%,transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,168,83,0.04)_0%,transparent_50%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <h1
            className="text-3xl font-bold text-gold-light sm:text-4xl lg:text-5xl"
            style={headingFont}
          >
            {tl(HEADER_LABELS.heroTitle, locale)}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            {tl(HEADER_LABELS.heroSubtitle, locale)}
          </p>
        </div>
      </section>

      <Suspense fallback={<SignShiftFallback />}>
        <SignShiftClient />
      </Suspense>
    </>
  );
}

function SignShiftFallback() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6 lg:px-8" aria-label="Loading form">
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl h-96 animate-pulse" />
    </div>
  );
}
