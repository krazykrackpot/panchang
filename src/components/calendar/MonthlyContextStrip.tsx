'use client';

import { tl } from '@/lib/utils/trilingual';
import type { LocaleText } from '@/types/panchang';
import MSG from '@/messages/pages/tithi.json';

/**
 * Monthly context strip — Samvatsara · Masa · Ritu · Ayana · Ayanamsha
 *
 * Compact horizontal strip below the month navigation. Sits between the
 * "Go to Today" button and the grid itself.
 *
 * Drik-style: dense but clean. We use 5 pill-shaped chips with a small
 * decorative gradient and an Om/lotus iconography hint at the front.
 */

export interface MonthlyContext {
  samvatsara: LocaleText;
  masa: LocaleText;
  ritu: LocaleText;
  ayana: LocaleText;
  /** Decimal degrees. Rounded to 4 dp. */
  ayanamshaDeg: number;
}

interface Props {
  meta: MonthlyContext;
  locale: string;
}

const chipBase =
  'flex items-baseline gap-1.5 px-2.5 py-1.5 rounded-lg ' +
  'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] ' +
  'border border-gold-primary/20';

export default function MonthlyContextStrip({ meta, locale }: Props) {
  return (
    <div
      role="region"
      aria-label="Monthly Vedic context"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5 px-2"
    >
      <ContextChip label={tl(MSG.ctxSamvatsara, locale)} value={tl(meta.samvatsara, locale)} accent="gold" />
      <ContextChip label={tl(MSG.ctxMasa, locale)} value={tl(meta.masa, locale)} accent="amber" />
      <ContextChip label={tl(MSG.ctxRitu, locale)} value={tl(meta.ritu, locale)} accent="emerald" />
      <ContextChip label={tl(MSG.ctxAyana, locale)} value={tl(meta.ayana, locale)} accent="cyan" />
      <ContextChip
        label={tl(MSG.ctxAyanamsha, locale)}
        value={`${meta.ayanamshaDeg.toFixed(4)}°`}
        accent="violet"
        mono
      />
    </div>
  );
}

const ACCENTS: Record<string, string> = {
  gold:    'text-gold-light',
  amber:   'text-amber-200',
  emerald: 'text-emerald-200',
  cyan:    'text-cyan-200',
  violet:  'text-violet-200',
};

function ContextChip({
  label,
  value,
  accent,
  mono = false,
}: {
  label: string;
  value: string;
  accent: keyof typeof ACCENTS | string;
  mono?: boolean;
}) {
  const valueColor = ACCENTS[accent] ?? ACCENTS.gold;
  return (
    <div className={chipBase}>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-text-secondary/70 font-semibold">
        {label}
      </span>
      <span className={`text-[11px] sm:text-xs font-bold ${valueColor} ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
