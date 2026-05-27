/**
 * Gauri Panchang (Gowri Panchangam / Gowri Nalla Neram)
 *
 * South-Indian counterpart to Choghadiya, used heavily in Tamil Nadu,
 * Karnataka, Telugu states and Kerala. Same time-division shape as
 * Choghadiya (8 equal segments from sunrise→sunset, 8 from sunset→next
 * sunrise) but with eight distinct period names and a different
 * weekday-to-starting-period rotation.
 *
 * The eight period names (in cycle order):
 *   Amritha — nectar (most auspicious)
 *   Siddha  — accomplishment (auspicious)
 *   Marana  — death (inauspicious)
 *   Rogam   — disease (inauspicious)
 *   Laabha  — gain (auspicious)
 *   Dhanam  — wealth (auspicious)
 *   Sugam   — comfort / ease (auspicious)
 *   Sokam   — sorrow (inauspicious)
 *
 * Weekday rotation: the period at sunrise rotates with the weekday lord;
 * each subsequent slot advances by one position in the cycle. After 8
 * slots the cycle has run a full revolution. Night follows the same
 * cycle starting 4 positions later (the classical "opposite of day"
 * convention used in published Tamil panchangs).
 *
 * Sources: Sri Vakratunda Panchangam (Tamil); standard Gowri Panchangam
 * tables used by Tamil Nadu published almanacs. Rotation cross-checked
 * against three sample dates in the regression test
 * (`src/lib/__tests__/gauri-panchang-rotation.test.ts`).
 */
import type { LocaleText } from '@/types/panchang';

export type GauriType =
  | 'amritha'
  | 'siddha'
  | 'marana'
  | 'rogam'
  | 'laabha'
  | 'dhanam'
  | 'sugam'
  | 'sokam';

/**
 * The eight Gauri periods in their canonical cycle order. Each weekday
 * starts at a different index in this cycle (see GAURI_DAY_START_BY_WEEKDAY).
 */
export const GAURI_TYPES = [
  'amritha',
  'siddha',
  'marana',
  'rogam',
  'laabha',
  'dhanam',
  'sugam',
  'sokam',
] as const satisfies readonly GauriType[];

/**
 * Trilingual + South-Indian-script names for each Gauri period.
 *
 * Tamil + Telugu + Kannada + Malayalam transliterations are included
 * because this feature is primarily for South-Indian audiences. The
 * Devanagari (Hindi/Sanskrit) renderings come from classical Vedic
 * usage; the Tamil/Telugu/Kannada renderings match published Tamil
 * panchangs.
 */
export const GAURI_NAMES: Record<GauriType, LocaleText & {
  ta?: string; te?: string; kn?: string; ml?: string;
}> = {
  amritha: {
    en: 'Amritha',
    hi: 'अमृत',
    sa: 'अमृतम्',
    ta: 'அமிர்தம்',
    te: 'అమృత',
    kn: 'ಅಮೃತ',
    ml: 'അമൃതം',
  },
  siddha: {
    en: 'Siddha',
    hi: 'सिद्ध',
    sa: 'सिद्धम्',
    ta: 'சித்தம்',
    te: 'సిద్ధ',
    kn: 'ಸಿದ್ಧ',
    ml: 'സിദ്ധം',
  },
  marana: {
    en: 'Marana',
    hi: 'मरण',
    sa: 'मरणम्',
    ta: 'மரணம்',
    te: 'మరణ',
    kn: 'ಮರಣ',
    ml: 'മരണം',
  },
  rogam: {
    en: 'Rogam',
    hi: 'रोग',
    sa: 'रोगः',
    ta: 'ரோகம்',
    te: 'రోగ',
    kn: 'ರೋಗ',
    ml: 'രോഗം',
  },
  laabha: {
    en: 'Laabha',
    hi: 'लाभ',
    sa: 'लाभः',
    ta: 'லாபம்',
    te: 'లాభ',
    kn: 'ಲಾಭ',
    ml: 'ലാഭം',
  },
  dhanam: {
    en: 'Dhanam',
    hi: 'धन',
    sa: 'धनम्',
    ta: 'தனம்',
    te: 'ధన',
    kn: 'ಧನ',
    ml: 'ധനം',
  },
  sugam: {
    en: 'Sugam',
    hi: 'सुगम',
    sa: 'सुगमम्',
    ta: 'சுகம்',
    te: 'సుగమ',
    kn: 'ಸುಗಮ',
    ml: 'സുഗമം',
  },
  sokam: {
    en: 'Sokam',
    hi: 'शोक',
    sa: 'शोकः',
    ta: 'சோகம்',
    te: 'శోక',
    kn: 'ಶೋಕ',
    ml: 'ശോകം',
  },
};

/**
 * Auspicious / inauspicious classification per published Tamil
 * Gowri Panchangam usage. Five auspicious, three inauspicious — there
 * is no "neutral" tier in Gauri (unlike Choghadiya's Char/Chal which is
 * neutral).
 */
export const GAURI_NATURE: Record<GauriType, 'auspicious' | 'inauspicious'> = {
  amritha: 'auspicious',
  siddha:  'auspicious',
  laabha:  'auspicious',
  dhanam:  'auspicious',
  sugam:   'auspicious',
  marana:  'inauspicious',
  rogam:   'inauspicious',
  sokam:   'inauspicious',
};

/**
 * Cycle index at which each weekday's DAY Gauri begins (at sunrise).
 *
 * Index into GAURI_TYPES: 0=Amritha, 1=Siddha, 2=Marana, 3=Rogam,
 * 4=Laabha, 5=Dhanam, 6=Sugam, 7=Sokam.
 *
 *   weekday 0 = Sunday    → starts at Sokam   (index 7) — sorrow
 *   weekday 1 = Monday    → starts at Amritha (index 0) — nectar (Soma=Moon=Amrit)
 *   weekday 2 = Tuesday   → starts at Marana  (index 2)
 *   weekday 3 = Wednesday → starts at Laabha  (index 4)
 *   weekday 4 = Thursday  → starts at Sugam   (index 6)
 *   weekday 5 = Friday    → starts at Siddha  (index 1)
 *   weekday 6 = Saturday  → starts at Rogam   (index 3)
 *
 * (0=Sunday convention matches Date.getUTCDay() and the JD weekday
 * formula `Math.floor(jd + 1.5) % 7`. See CLAUDE.md Lesson O.)
 */
export const GAURI_DAY_START_BY_WEEKDAY = [7, 0, 2, 4, 6, 1, 3] as const;

/**
 * Cycle index at which each weekday's NIGHT Gauri begins (at sunset).
 *
 * Convention used in published Tamil panchangs: night offset = (day
 * offset + 4) mod 8 — the cycle midpoint, classically described as the
 * "opposite face" of the day cycle.
 */
export const GAURI_NIGHT_START_BY_WEEKDAY = [3, 4, 6, 0, 2, 5, 7] as const;
