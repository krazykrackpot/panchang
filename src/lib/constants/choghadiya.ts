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
  // Audit P5g.1 (Lesson S): hi was 'चल' (chala) — a single-file
  // outlier. The 10+ other files using "Movable / Char" across
  // birth-chart, advanced-houses, career-muhurta, tula, gauri-
  // panchang, and the choghadiya learn-page i18n JSON ALL use 'चर'
  // (chara). Aligning the canonical to the majority reading per
  // Lesson S ("the majority reading is almost always right; a
  // single outlier is the bug").
  char:   { en: 'Char',   hi: 'चर',    sa: 'चरम्' },
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

// ---------------------------------------------------------------------------
// Per-slot lookup helpers — single source of truth for the rotation pattern
// (Audit P5g #29). Both `computeChoghadiya` (panchang-calc.ts) and the
// muhurta verdict-engine rules in `kaala.ts` previously hand-rolled
// `CHOGHADIYA_TYPES[(START[weekday] + slotIdx) % 7]`. If the canonical
// rotation ever changes the audit ensures both stay aligned.
// ---------------------------------------------------------------------------

/**
 * Choghadiya type for day slot `slotIdx` (0-7, sunrise → sunset) on a
 * given weekday (0=Sun … 6=Sat).
 */
export function chogTypeAtDaySlot(weekday: number, slotIdx: number): ChoghadiyaType {
  return CHOGHADIYA_TYPES[(DAY_CHOGHADIYA_START[weekday] + slotIdx) % 7];
}

/**
 * Choghadiya type for night slot `slotIdx` (0-7, sunset → next sunrise)
 * on a given weekday (0=Sun … 6=Sat).
 */
export function chogTypeAtNightSlot(weekday: number, slotIdx: number): ChoghadiyaType {
  return CHOGHADIYA_TYPES[(NIGHT_CHOGHADIYA_START[weekday] + slotIdx) % 7];
}
