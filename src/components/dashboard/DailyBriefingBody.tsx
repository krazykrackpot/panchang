'use client';

/**
 * Daily Cosmic Briefing body — renders the narrative + Do/Don't lists
 * with persona-mode awareness.
 *
 * Why a client component? The locale homepage `/[locale]/` is statically
 * pre-rendered for SEO + Maithili crawl priority (CLAUDE.md "Static Page
 * Budget" section). Reading the `dp-persona-mode` cookie server-side
 * would opt the entire localised route tree into dynamic rendering
 * (see PR-1 cycle-3 HIGH: persona-mode-setting-v1-design.md). So the
 * SSR HTML renders the default (Enthusiast) register, and this client
 * component swaps to the Acharya register on hydration if the user
 * is in Acharya mode.
 *
 * Trade-off: Acharya users (~2% of traffic per the personas doc rough
 * estimate) see a brief flash of the friendly briefing before it swaps.
 * Same shape of flicker users tolerate today on /kundali. The 9K static
 * pages stay static; the Maithili crawl priority is preserved.
 *
 * Spec: docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md
 */

import { CheckCircle, XCircle } from 'lucide-react';
import { useMemo, type CSSProperties } from 'react';
import { generateDailyNarrative } from '@/lib/panchang/daily-narrative';
import { usePersonaMode } from '@/lib/persona/context';
import type { PanchangData } from '@/types/panchang';

// Compact locale picker — we keep this co-located so the component is
// self-contained and the home page doesn't have to pass its `L`
// helper across the SSR/CSR boundary as a prop.
function pickLabel(
  texts: { en: string; hi: string; ta?: string; te?: string; bn?: string; kn?: string; mr?: string; gu?: string; mai?: string; sa?: string },
  locale: string,
): string {
  if (locale === 'mr' && texts.mr) return texts.mr;
  if (locale === 'gu' && texts.gu) return texts.gu;
  if (locale === 'mai' && texts.mai) return texts.mai;
  if (locale === 'ta' && texts.ta) return texts.ta;
  if (locale === 'te' && texts.te) return texts.te;
  if (locale === 'bn' && texts.bn) return texts.bn;
  if (locale === 'kn' && texts.kn) return texts.kn;
  if (locale === 'sa' && texts.sa) return texts.sa;
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return texts.hi;
  return texts.en;
}

export function DailyBriefingBody({
  panchang,
  locale,
  bodyFont,
}: {
  panchang: PanchangData;
  locale: string;
  bodyFont?: CSSProperties;
}) {
  const { mode, isHydrated } = usePersonaMode();

  // SSR renders with the default mode so the static HTML matches the
  // server-pre-rendered briefing. On hydration we read the cookie
  // and recompute if the user is in Acharya mode. Beginner +
  // Enthusiast share the same friendly register today (per the v1
  // truth table); only Acharya gets a distinct render.
  const effectiveMode = isHydrated && mode === 'acharya' ? 'acharya' : 'enthusiast';
  const briefing = useMemo(
    () => generateDailyNarrative(panchang, locale, effectiveMode),
    [panchang, locale, effectiveMode],
  );

  return (
    <div className="flex-1 min-w-0">
      <p
        className="text-text-primary text-sm sm:text-base leading-relaxed mb-5"
        style={bodyFont}
      >
        {briefing.narrative}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            {pickLabel(
              { en: 'Favourable', hi: 'अनुकूल', ta: 'சாதகமான', bn: 'অনুকূল' },
              locale,
            )}
          </h3>
          <ul className="space-y-1.5">
            {briefing.doList.map((item, i) => (
              <li
                key={i}
                className="text-text-primary text-xs sm:text-sm flex items-start gap-2"
                style={bodyFont}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            {pickLabel(
              { en: 'Avoid', hi: 'परहेज़', ta: 'தவிர்க்க', bn: 'এড়িয়ে চলুন' },
              locale,
            )}
          </h3>
          <ul className="space-y-1.5">
            {briefing.dontList.map((item, i) => (
              <li
                key={i}
                className="text-text-primary text-xs sm:text-sm flex items-start gap-2"
                style={bodyFont}
              >
                <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
