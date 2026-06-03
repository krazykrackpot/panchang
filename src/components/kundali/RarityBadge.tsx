'use client';

import { getYogaFrequency, BAND_LABEL, CHARTS_SUFFIX, type FrequencyBand } from '@/lib/kundali/yoga-frequency';
import { pickByLocale, isDevanagariLocale } from '@/lib/utils/locale-fonts';

const BAND_CLASS: Record<FrequencyBand, string> = {
  'very-common': 'bg-white/5 text-text-secondary/70 border-white/10',
  'common':      'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'uncommon':    'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'rare':        'bg-amber-500/15 text-amber-300 border-amber-500/25',
  'very-rare':   'bg-gold-primary/15 text-gold-light border-gold-primary/30',
};

interface Props {
  yogaId: string;
  locale: string;
  /** Compact mode hides the band label AND the "of charts" suffix — shows only `~N%`. */
  compact?: boolean;
}

export default function RarityBadge({ yogaId, locale, compact = false }: Props) {
  const info = getYogaFrequency(yogaId);
  if (!info) return null;

  const isDevanagari = isDevanagariLocale(locale);
  const label = pickByLocale(BAND_LABEL[info.band], locale);
  const suffix = pickByLocale(CHARTS_SUFFIX, locale);

  // Compact: just the percentage. Full: percentage + "of charts" + band label.
  const pctOnly = isDevanagari ? `${info.pct}%` : `~${info.pct}%`;
  const pctWithSuffix = `${pctOnly} ${suffix}`;
  const visiblePct = compact ? pctOnly : pctWithSuffix;

  return (
    <span
      className={`inline-flex flex-shrink-0 items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${BAND_CLASS[info.band]}`}
      title={isDevanagari ? `${label} · ${pctWithSuffix}` : `${pctWithSuffix} • ${label}`}
    >
      <span>{visiblePct}</span>
      {!compact && (
        <>
          <span className="opacity-50">·</span>
          <span>{label}</span>
        </>
      )}
    </span>
  );
}
