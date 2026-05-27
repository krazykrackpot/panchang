/**
 * Choghadiya (चौघड़िया) — single source of truth for type names, nature
 * classifications, and weekday rotation.
 *
 * Two consumers existed in parallel before this file (Lesson Z time bomb):
 *   - `src/lib/ephem/panchang-calc.ts`  (`computeChoghadiya`)
 *   - `src/lib/muhurta/engine/rules/kaala.ts` (`buildChoghadiyaWindows`)
 *
 * The two had IDENTICAL arrays today, but per CLAUDE.md Lesson Q/S/Z any
 * Jyotish constant defined in 2+ files WILL eventually drift. Promoted
 * here so future consumers import a single canonical definition.
 *
 * Sources: Muhurta Chintamani, Nirṇaya Sindhu (standard Choghadiya table).
 */
import type { LocaleText } from '@/types/panchang';

/**
 * The 7-period cycle in canonical order. Index N corresponds to the
 * starting offset used by DAY_CHOGHADIYA_START / NIGHT_CHOGHADIYA_START.
 */
export const CHOGHADIYA_TYPES = ['udveg', 'char', 'labh', 'amrit', 'kaal', 'shubh', 'rog'] as const;

export type ChoghadiyaType = typeof CHOGHADIYA_TYPES[number];

/** Trilingual display names (en / hi / sa). */
export const CHOGHADIYA_NAMES: Record<ChoghadiyaType, LocaleText> = {
  amrit:  { en: 'Amrit',  hi: 'अमृत',  sa: 'अमृतम्' },
  shubh:  { en: 'Shubh',  hi: 'शुभ',   sa: 'शुभम्' },
  labh:   { en: 'Labh',   hi: 'लाभ',   sa: 'लाभः' },
  char:   { en: 'Char',   hi: 'चल',    sa: 'चलम्' },
  rog:    { en: 'Rog',    hi: 'रोग',   sa: 'रोगः' },
  kaal:   { en: 'Kaal',   hi: 'काल',   sa: 'कालः' },
  udveg:  { en: 'Udveg',  hi: 'उद्वेग', sa: 'उद्वेगः' },
};

/** Three-tier nature classification used by verdict-engine + UI badges. */
export const CHOGHADIYA_NATURE: Record<ChoghadiyaType, 'auspicious' | 'inauspicious' | 'neutral'> = {
  amrit: 'auspicious', shubh: 'auspicious', labh: 'auspicious',
  char: 'neutral',
  rog: 'inauspicious', kaal: 'inauspicious', udveg: 'inauspicious',
};

/**
 * Day-choghadiya starting index per weekday (Sun=0 … Sat=6).
 * Classical: Sun=Udveg, Mon=Amrit, Tue=Rog, Wed=Labh, Thu=Shubh, Fri=Char, Sat=Kaal.
 * Each index points into CHOGHADIYA_TYPES.
 */
export const DAY_CHOGHADIYA_START = [0, 3, 6, 2, 5, 1, 4] as const;

/**
 * Night-choghadiya starting index per weekday (Sun=0 … Sat=6).
 * Classical: Sun=Shubh, Mon=Kaal, Tue=Udveg, Wed=Amrit, Thu=Rog, Fri=Labh, Sat=Char.
 */
export const NIGHT_CHOGHADIYA_START = [5, 4, 0, 3, 6, 2, 1] as const;
