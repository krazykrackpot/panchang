'use client';

/**
 * 12-rashi personalized-reading accordion for the festival year page.
 *
 * Each rashi card is collapsible. Inside: the festival-specific transit
 * summary + ritual recommendation derived from the user's Moon sign.
 *
 * All content is FREE — no paywall, no preview-then-expand tease. The
 * Brihaspati CTA below the accordion is the upgrade-to-a-conversation
 * offer, not a gate on the free text (spec §4A decision).
 *
 * Server side bakes all 12 reads into the rendered HTML via the
 * personalized-reading engine; this component only handles
 * accordion-expand state + the Brihaspati event dispatch.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4A
 */

import { useState } from 'react';
import { ChevronDown, Sparkles, Compass } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import { BRIHASPATI_OPEN_EVENT, type BrihaspatiOpenEventDetail } from '@/components/brihaspati/events';
import { Link } from '@/lib/i18n/navigation';
import type { LocaleText, Locale } from '@/types/panchang';
import type { PersonalizedFestivalReading } from '@/lib/festivals/types';
import { pickByScript } from "@/lib/utils/locale-fonts";

const RASHI_NAMES: Record<number, LocaleText> = {
  1:  { en: 'Aries',       hi: 'मेष'    },
  2:  { en: 'Taurus',      hi: 'वृषभ'   },
  3:  { en: 'Gemini',      hi: 'मिथुन'  },
  4:  { en: 'Cancer',      hi: 'कर्क'   },
  5:  { en: 'Leo',         hi: 'सिंह'   },
  6:  { en: 'Virgo',       hi: 'कन्या'  },
  7:  { en: 'Libra',       hi: 'तुला'   },
  8:  { en: 'Scorpio',     hi: 'वृश्चिक' },
  9:  { en: 'Sagittarius', hi: 'धनु'    },
  10: { en: 'Capricorn',   hi: 'मकर'    },
  11: { en: 'Aquarius',    hi: 'कुम्भ'  },
  12: { en: 'Pisces',      hi: 'मीन'    },
};

interface Props {
  /** All 12 readings, one per rashi 1-12. Server-pre-computed. */
  readings: PersonalizedFestivalReading[];
  /** Festival's English display name for the section header */
  festivalNameEn: string;
  /** Festival's Hindi display name for the section header */
  festivalNameHi: string;
  /** 2026 etc. */
  year: number;
  /** Festival slug, used for telemetry + Brihaspati pre-fill */
  festivalSlug: string;
  /** Current locale */
  locale: Locale;
}

export default function FestivalPersonalizedAccordion({
  readings,
  festivalNameEn,
  festivalNameHi,
  year,
  festivalSlug,
  locale,
}: Props) {
  const [openRashi, setOpenRashi] = useState<number | null>(null);

  const sectionTitle = pickByScript(`How will ${festivalNameEn} ${year} affect your sign?`, `${festivalNameHi} ${year} आपकी राशि के लिए क्या लाता है?`, locale);

  const subtitle = pickByScript(`Pick your Moon sign — slow-planet transits read the festival's pull on your chart.`, 'अपनी चन्द्र राशि चुनें — मन्दगति ग्रहों के गोचर के आधार पर पर्व का व्यक्तिगत संकेत', locale);

  const dontKnowSign = pickByScript('Don\'t know your sign? Open the Moon-sign calculator →', 'अपनी राशि नहीं जानते? चन्द्र राशि कैलकुलेटर खोलें →', locale);

  // Sort readings by rashi (defensive — server should already pass them
  // in order, but the accordion's stable order is part of the visual
  // contract).
  const sortedReadings = [...readings].sort((a, b) => a.rashi - b.rashi);

  const openBrihaspati = () => {
    const question = pickByScript(`What does ${festivalNameEn} ${year} mean for my chart? I'd like a personalised reading for the festival day.`, `${festivalNameHi} ${year} मेरी राशि के लिए क्या लेकर आ रहा है? पर्व के दिन की व्यक्तिगत भविष्यवाणी चाहिए।`, locale);
    const detail: BrihaspatiOpenEventDetail = {
      question,
      entry: 'festival-personalized-cta' as never, // PanelEntry is a string union; this entry is added in the analytics layer.
    };
    window.dispatchEvent(new CustomEvent(BRIHASPATI_OPEN_EVENT, { detail }));
  };

  return (
    <section className="mb-10" aria-labelledby="personalized-accordion-heading">
      {/* Header */}
      <div className="text-center mb-6">
        <h2
          id="personalized-accordion-heading"
          className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sectionTitle}
        </h2>
        <p className="text-text-secondary text-sm max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href="/sign-calculator"
          className="inline-flex items-center gap-1 text-xs text-gold-primary/70 hover:text-gold-light mt-2 transition-colors"
        >
          <Compass className="w-3 h-3" />
          {dontKnowSign}
        </Link>
      </div>

      {/* Accordion */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedReadings.map((r) => {
          const isOpen = openRashi === r.rashi;
          const rashiName = tl(RASHI_NAMES[r.rashi], locale);
          return (
            <div
              key={r.rashi}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenRashi(isOpen ? null : r.rashi)}
                aria-expanded={isOpen}
                aria-controls={`rashi-panel-${r.rashi}`}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="text-gold-light font-semibold">{rashiName}</span>
                  <span className="text-text-secondary/60 text-xs">({r.rashi})</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gold-primary/70 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div
                  id={`rashi-panel-${r.rashi}`}
                  className="px-4 py-3 border-t border-gold-primary/10 text-sm space-y-2"
                >
                  <p className="text-text-primary leading-relaxed">{tl(r.summary, locale)}</p>
                  <p className="text-gold-light/90 leading-relaxed text-xs italic">{tl(r.ritual, locale)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Brihaspati CTA — separate from the free content above */}
      <div className="mt-6 rounded-xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] p-5 text-center">
        <Sparkles className="w-6 h-6 text-gold-primary mx-auto mb-2" />
        <h3 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          {pickByScript(`Want a full personalised reading for ${festivalNameEn} ${year}?`, `${festivalNameHi} ${year} के लिए विस्तृत व्यक्तिगत पाठ चाहिए?`, locale)}
        </h3>
        <p className="text-text-secondary text-xs max-w-md mx-auto mb-3">
          {pickByScript('Brihaspati reads your full chart, transits, and current dasha to give a precise festival-day guidance.', 'बृहस्पति आपकी पूरी कुण्डली, गोचर एवं दशा का विश्लेषण करके पर्व-दिवस का सटीक मार्गदर्शन देंगे।', locale)}
        </p>
        <button
          type="button"
          onClick={openBrihaspati}
          data-festival-slug={festivalSlug}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-primary/20 hover:bg-gold-primary/30 border border-gold-primary/40 text-gold-light text-sm font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {pickByScript('Ask Brihaspati — INR 49 / USD 2', 'बृहस्पति से पूछें — ₹49 / $2', locale)}
        </button>
      </div>
    </section>
  );
}
