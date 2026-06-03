'use client';

import { getYogaFrequency, BAND_LABEL, type FrequencyBand } from '@/lib/kundali/yoga-frequency';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

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
  /** Compact mode hides the band label, showing only `~N%`. */
  compact?: boolean;
}

export default function RarityBadge({ yogaId, locale, compact = false }: Props) {
  const info = getYogaFrequency(yogaId);
  if (!info) return null;

  const isHi = isDevanagariLocale(locale);
  const label = isHi ? BAND_LABEL[info.band].hi : BAND_LABEL[info.band].en;
  const pctLabel = isHi
    ? `${info.pct}% कुंडलियों में`
    : `~${info.pct}% of charts`;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${BAND_CLASS[info.band]}`}
      title={isHi ? `${label} · ${pctLabel}` : `${pctLabel} • ${label}`}
    >
      <span>{pctLabel}</span>
      {!compact && (
        <>
          <span className="opacity-50">·</span>
          <span>{label}</span>
        </>
      )}
    </span>
  );
}
