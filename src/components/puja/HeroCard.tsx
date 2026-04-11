'use client';

import { motion } from 'framer-motion';
import type { PujaVidhi, MuhurtaWindowType } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';
import type { ComputedMuhurta } from '@/lib/puja/muhurta-compute';
import MuhurtaCountdown from '@/components/puja/MuhurtaCountdown';

/* ── Trilingual labels ─────────────────────────────────────── */

const CATEGORY_LABELS: Record<PujaVidhi['category'], Record<Locale, string>> = {
  festival:     { en: 'Festival',      hi: 'त्योहार',      sa: 'उत्सवः' },
  vrat:         { en: 'Vrat',          hi: 'व्रत',         sa: 'व्रतम्' },
  graha_shanti: { en: 'Graha Shanti',  hi: 'ग्रह शान्ति',  sa: 'ग्रहशान्तिः' },
};

const CATEGORY_COLORS: Record<PujaVidhi['category'], string> = {
  festival:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  vrat:         'bg-purple-500/15 text-purple-300 border-purple-500/30',
  graha_shanti: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const MUHURTA_WINDOW_LABELS: Record<MuhurtaWindowType, Record<Locale, string>> = {
  madhyahna:      { en: 'Madhyahna Kaal',  hi: 'मध्याह्न काल',    sa: 'मध्याह्नकालः' },
  aparahna:       { en: 'Aparahna Kaal',    hi: 'अपराह्न काल',     sa: 'अपराह्णकालः' },
  pradosh:        { en: 'Pradosh Kaal',     hi: 'प्रदोष काल',      sa: 'प्रदोषकालः' },
  nishita:        { en: 'Nishita Kaal',     hi: 'निशीथ काल',       sa: 'निशीथकालः' },
  brahma_muhurta: { en: 'Brahma Muhurta',   hi: 'ब्रह्म मुहूर्त',   sa: 'ब्रह्ममुहूर्तम्' },
  abhijit:        { en: 'Abhijit Muhurta',  hi: 'अभिजित् मुहूर्त',  sa: 'अभिजिन्मुहूर्तम्' },
};

/* ── Props ─────────────────────────────────────────────────── */

interface HeroCardProps {
  puja: PujaVidhi;
  locale: Locale;
  computedMuhurta?: ComputedMuhurta;
  festivalDate?: Date;
  locationName?: string;
  timezone?: string;
}

/* ── Date formatter ────────────────────────────────────────── */

function formatFestivalDate(date: Date, locale: Locale, timezone?: string): string {
  const localeTag = locale === 'sa' ? 'hi-IN' : locale === 'hi' ? 'hi-IN' : 'en-US';
  return date.toLocaleDateString(localeTag, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(timezone ? { timeZone: timezone } : {}),
  });
}

/* ── Component ─────────────────────────────────────────────── */

export default function HeroCard({
  puja,
  locale,
  computedMuhurta,
  festivalDate,
  locationName,
  timezone,
}: HeroCardProps) {
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
      className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 overflow-hidden"
    >
      {/* Gold gradient top band */}
      <div className="h-1.5 bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark" />

      <div className="p-6 sm:p-8 space-y-4">
        {/* Category badge + muhurta window label row */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide uppercase ${CATEGORY_COLORS[puja.category]}`}
          >
            {CATEGORY_LABELS[puja.category][locale]}
          </span>

          {puja.muhurtaWindow && (
            <span className="text-xs text-text-secondary/75 font-medium">
              {MUHURTA_WINDOW_LABELS[puja.muhurtaWindow.type][locale]}
            </span>
          )}
        </div>

        {/* Deity name — THE HERO TEXT */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: headingFont }}
        >
          {puja.deity[locale]}
        </h1>

        {/* Festival date */}
        {festivalDate && (
          <p className="text-lg text-text-secondary/80" style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-body)' : undefined }}>
            {formatFestivalDate(festivalDate, locale, timezone)}
          </p>
        )}

        {/* Muhurta description */}
        <p
          className="text-sm text-text-secondary/70"
          style={{ fontFamily: isDevanagari ? 'var(--font-devanagari-body)' : undefined }}
        >
          {puja.muhurtaDescription[locale]}
        </p>

        {/* Live countdown */}
        {computedMuhurta && locationName && (
          <div className="pt-2">
            <MuhurtaCountdown
              muhurta={computedMuhurta}
              locale={locale}
              locationName={locationName}
              timezone={timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
