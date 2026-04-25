'use client';

/**
 * JournalFilters — compact horizontal filter bar.
 *
 * Controls: date range, dasha planet, nakshatra number, minimum mood.
 * Reset button clears all filters.
 *
 * All inputs styled for the dark theme.
 */

import type { JournalFilters } from '@/types/journal';
import { X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    from: 'From',
    to: 'To',
    dasha: 'Maha Dasha',
    nakshatra: 'Nakshatra',
    moodMin: 'Min Mood',
    reset: 'Reset',
    allNakshatras: 'All',
    allDashas: 'All',
  },
  hi: {
    from: 'से',
    to: 'तक',
    dasha: 'महादशा',
    nakshatra: 'नक्षत्र',
    moodMin: 'न्यूनतम मनोदशा',
    reset: 'रीसेट',
    allNakshatras: 'सभी',
    allDashas: 'सभी',
  },
  sa: {
    from: 'आरभ्य',
    to: 'यावत्',
    dasha: 'महादशा',
    nakshatra: 'नक्षत्रम्',
    moodMin: 'न्यूनमनोदशा',
    reset: 'पुनर्निर्धारयतु',
    allNakshatras: 'सर्वे',
    allDashas: 'सर्वे',
  },
  ta: {
    from: 'இருந்து',
    to: 'வரை',
    dasha: 'மஹா தசை',
    nakshatra: 'நட்சத்திரம்',
    moodMin: 'குறைந்தபட்ச மனநிலை',
    reset: 'மீட்டமை',
    allNakshatras: 'அனைத்தும்',
    allDashas: 'அனைத்தும்',
  },
  bn: {
    from: 'থেকে',
    to: 'পর্যন্ত',
    dasha: 'মহা দশা',
    nakshatra: 'নক্ষত্র',
    moodMin: 'সর্বনিম্ন মেজাজ',
    reset: 'রিসেট',
    allNakshatras: 'সব',
    allDashas: 'সব',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'] as const;

// 27 nakshatra names (1-indexed)
const NAKSHATRA_NAMES = [
  '', 'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
] as const;

// ---------------------------------------------------------------------------
// Shared input class
// ---------------------------------------------------------------------------
const INPUT_CLS =
  'bg-bg-secondary border border-gold-primary/20 text-text-primary text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold-primary/50 transition-colors placeholder-text-secondary/50';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  filters: JournalFilters;
  onChange: (filters: JournalFilters) => void;
  locale?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function JournalFiltersBar({ filters, onChange, locale = 'en' }: Props) {
  const L = getLabels(locale);

  const hasActiveFilters =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.mahaDasha ||
    filters.nakshatraNumber != null ||
    filters.moodMin != null;

  const update = (patch: Partial<JournalFilters>) =>
    onChange({ ...filters, ...patch, offset: 0 });

  const reset = () =>
    onChange({ limit: filters.limit ?? 30, offset: 0 });

  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-4">
      <div className="flex flex-wrap items-end gap-3">
        {/* Date from */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
            {L.from}
          </label>
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => update({ dateFrom: e.target.value || undefined })}
            className={INPUT_CLS}
          />
        </div>

        {/* Date to */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
            {L.to}
          </label>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => update({ dateTo: e.target.value || undefined })}
            className={INPUT_CLS}
          />
        </div>

        {/* Maha Dasha */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
            {L.dasha}
          </label>
          <select
            value={filters.mahaDasha ?? ''}
            onChange={(e) => update({ mahaDasha: e.target.value || undefined })}
            className={INPUT_CLS}
          >
            <option value="">{L.allDashas}</option>
            {PLANETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Nakshatra */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
            {L.nakshatra}
          </label>
          <select
            value={filters.nakshatraNumber ?? ''}
            onChange={(e) =>
              update({ nakshatraNumber: e.target.value ? parseInt(e.target.value, 10) : undefined })
            }
            className={INPUT_CLS}
          >
            <option value="">{L.allNakshatras}</option>
            {Array.from({ length: 27 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}. {NAKSHATRA_NAMES[n]}
              </option>
            ))}
          </select>
        </div>

        {/* Min mood */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">
            {L.moodMin}
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((m) => {
              const active = filters.moodMin === m;
              return (
                <button
                  key={m}
                  onClick={() => update({ moodMin: active ? undefined : m })}
                  aria-label={`Minimum mood ${m}`}
                  className={[
                    'w-7 h-7 rounded-lg text-xs font-bold border transition-all',
                    active
                      ? 'bg-gold-primary/20 border-gold-primary text-gold-light'
                      : 'bg-transparent border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary',
                  ].join(' ')}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-secondary border border-text-secondary/20 hover:text-gold-light hover:border-gold-primary/30 transition-colors self-end"
          >
            <X className="w-3 h-3" />
            {L.reset}
          </button>
        )}
      </div>
    </div>
  );
}
