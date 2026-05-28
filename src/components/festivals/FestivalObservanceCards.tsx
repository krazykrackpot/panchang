/**
 * Festival do's & don'ts cards (server-rendered — pure presentation).
 *
 * Two side-by-side cards: green ticks for ✓ Do, amber ✗ for Don't.
 * Each item shows a 1-line directive + an optional classical source
 * citation tooltip.
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4C
 */

import { Check, X } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import type { FestivalObservance } from '@/lib/festivals/types';

interface Props {
  observance: FestivalObservance;
  festivalNameEn: string;
  festivalNameHi: string;
  locale: Locale;
}

export default function FestivalObservanceCards({ observance, festivalNameEn, festivalNameHi, locale }: Props) {
  const sectionTitle = locale === 'hi'
    ? `${festivalNameHi} — क्या करें, क्या न करें`
    : `${festivalNameEn} — Do's & Don'ts`;

  const subtitle = locale === 'hi'
    ? 'धर्मसिन्धु, निर्णयसिन्धु, एवं समकालीन परम्परा से।'
    : 'Sourced from Dharmasindhu, Nirnayasindhu, and contemporary tradition.';

  return (
    <section className="mb-10" aria-labelledby="observance-heading">
      <div className="text-center mb-5">
        <h2
          id="observance-heading"
          className="text-xl sm:text-2xl font-bold text-gold-light mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {sectionTitle}
        </h2>
        <p className="text-text-secondary text-xs">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dos card */}
        <div className="bg-gradient-to-br from-emerald-900/15 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/25 rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-emerald-300 font-bold text-base mb-3">
            <Check className="w-4 h-4" />
            {locale === 'hi' ? 'करने योग्य' : 'Do'}
          </h3>
          <ul className="space-y-3">
            {observance.dos.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <span className="text-text-primary leading-relaxed">{tl(item.text, locale)}</span>
                  {item.source && (
                    <span className="ml-2 inline-block text-[10px] text-emerald-400/70 italic"
                      title={item.source}
                    >
                      ({item.source})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Donts card */}
        <div className="bg-gradient-to-br from-amber-900/15 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/25 rounded-xl p-5">
          <h3 className="flex items-center gap-2 text-amber-300 font-bold text-base mb-3">
            <X className="w-4 h-4" />
            {locale === 'hi' ? 'न करें' : 'Don\'t'}
          </h3>
          <ul className="space-y-3">
            {observance.donts.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <X className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <span className="text-text-primary leading-relaxed">{tl(item.text, locale)}</span>
                  {item.source && (
                    <span className="ml-2 inline-block text-[10px] text-amber-400/70 italic"
                      title={item.source}
                    >
                      ({item.source})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
