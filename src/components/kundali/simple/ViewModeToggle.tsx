'use client';

import { Sparkles, ScrollText, Layers } from 'lucide-react';

export type KundaliViewMode = 'simple' | 'detailed' | 'expert';

interface Props {
  mode: KundaliViewMode;
  locale?: string;
  onToggle: (mode: KundaliViewMode) => void;
}

/**
 * Three-mode kundali navigation:
 *
 *   simple   — KundaliSimple (cosmic identity + 4 domains + life summary).
 *              Best for first-time users.
 *   detailed — Personalised Life Summary + Domain deep-dives. The reading
 *              the synthesiser produces, with no technical jargon.
 *   expert   — Technical analysis tabs (chart, planets, dasha, vargas,
 *              ashtakavarga, jaimini, KP, etc.). For practitioners.
 *
 * The single canonical surface for switching between them. The Personalised
 * Reading's "Technical Analysis" CTA and the "Back to Life Summary" link
 * inside the technical view both delegate to this toggle so users always
 * have one mental model for mode.
 */
export default function ViewModeToggle({ mode, locale, onToggle }: Props) {
  // STRICT check — must be 'hi' or 'sa' specifically. Using
  // `isDevanagariLocale` here would collapse Marathi (`mr`) and
  // Maithili (`mai`) into the Hindi branch and serve them
  // सरल / विस्तृत / विशेषज्ञ, which is exactly the duplicate-content
  // pattern Lesson J + the 2026-05-31 Marathi de-rank incident
  // banned. Other locales fall through to English. Gemini PR #382
  // round-2 HIGH.
  const isHiOrSa = locale === 'hi' || locale === 'sa';

  const labels = {
    simple: isHiOrSa ? 'सरल' : 'Simple',
    detailed: isHiOrSa ? 'विस्तृत' : 'Detailed',
    expert: isHiOrSa ? 'विशेषज्ञ' : 'Expert',
  };

  const tabClass = (active: boolean, position: 'left' | 'middle' | 'right') => {
    const base = 'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200';
    const border =
      position === 'left' ? 'border-r border-gold-primary/30'
      : position === 'middle' ? 'border-r border-gold-primary/30'
      : '';
    const state = active
      ? 'bg-gold-primary/20 text-gold-light shadow-inner shadow-gold-primary/10'
      : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5';
    return `${base} ${border} ${state}`;
  };

  return (
    <div
      role="tablist"
      aria-label={isHiOrSa ? 'दृश्य मोड' : 'View mode'}
      className="inline-flex rounded-xl border border-gold-primary/40 overflow-hidden bg-bg-secondary/40 backdrop-blur-sm"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'simple'}
        onClick={() => onToggle('simple')}
        className={tabClass(mode === 'simple', 'left')}
      >
        <Sparkles className="w-4 h-4" />
        {labels.simple}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'detailed'}
        onClick={() => onToggle('detailed')}
        className={tabClass(mode === 'detailed', 'middle')}
      >
        <Layers className="w-4 h-4" />
        {labels.detailed}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'expert'}
        onClick={() => onToggle('expert')}
        className={tabClass(mode === 'expert', 'right')}
      >
        <ScrollText className="w-4 h-4" />
        {labels.expert}
      </button>
    </div>
  );
}
