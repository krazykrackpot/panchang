/**
 * Canonical festival-category colour mapping (Audit P5h #26).
 *
 * Before this file:
 *   - `src/app/[locale]/calendar/Client.tsx:330` had a flat-string map
 *     using `/10` opacity (ekadashi=blue, purnima=amber, amavasya=
 *     purple, sankranti=red).
 *   - `src/components/dashboard/FestivalCountdown.tsx:114` had a
 *     function returning `{ bg, text, border }` with `/15` opacity
 *     (ekadashi=emerald, purnima=sky, amavasya=slate, sankranti=
 *     amber).
 *
 * 5 of 8 categories disagreed between the two surfaces — users saw
 * ekadashi as blue on the calendar but emerald on the dashboard, the
 * exact silent-drift pattern Lesson Z describes. This file is the
 * single source of truth for which colour family signals which
 * festival category.
 *
 * Choice of colours (thematic alignment over arbitrary picks):
 *   - festival: gold       — premium / celebration, the codebase's
 *                            "main accent" convention.
 *   - ekadashi: emerald    — Vishnu/devotion + fasting greens.
 *   - purnima:  sky        — full moon, silvery-blue light.
 *   - amavasya: slate      — new moon, low-light darkness.
 *   - chaturthi: orange    — Ganesha (saffron tradition).
 *   - pradosham: indigo    — Shiva (twilight blue tradition).
 *   - sankranti: amber     — solar transit warmth.
 *   - eclipse:  red        — danger / inauspicious.
 *   - jayanti:  violet     — Krishna janma + devotional purple.
 *   - vrat:     purple     — observance / discipline.
 *
 * Opacity normalised to `/15` (slightly more visible than calendar's
 * previous `/10`, matching the dashboard's existing convention).
 *
 * Consumers compose flat-string or object usage from this map; the
 * canonical shape exposes both `bg + text + border` (object) and a
 * derived `className` flat string for the common badge use-case.
 */

/**
 * Festival category union. Matches the inline literal-union used by
 * `FestivalDef.category` in `src/lib/calendar/festival-defs.ts:105`.
 * Defined here rather than re-exported because:
 *
 *   - festival-defs.ts inlines the union into FestivalDef without
 *     a separate named type alias.
 *   - This list is also the universe of categories we need to colour,
 *     so the `as const` derivation drives both the type and the
 *     Record-keys exhaustiveness check.
 */
export const FESTIVAL_CATEGORIES = [
  'festival',
  'ekadashi',
  'purnima',
  'amavasya',
  'chaturthi',
  'pradosham',
  'sankranti',
  'jayanti',
  'vrat',
] as const;

export type FestivalCategory = (typeof FESTIVAL_CATEGORIES)[number];

export interface FestivalCategoryColor {
  /** Tailwind background class (with `/15` opacity). */
  bg: string;
  /** Tailwind text class (light-mode safe, dark-mode native). */
  text: string;
  /** Tailwind border class (with `/25` opacity). */
  border: string;
  /** Pre-joined `bg + text + border` className for badge consumers. */
  className: string;
}

function build(bg: string, text: string, border: string): FestivalCategoryColor {
  return { bg, text, border, className: `${bg} ${text} ${border}` };
}

export const FESTIVAL_CATEGORY_COLORS: Record<FestivalCategory, FestivalCategoryColor> = {
  festival:  build('bg-gold-primary/15', 'text-gold-light',   'border-gold-primary/25'),
  ekadashi:  build('bg-emerald-500/15',  'text-emerald-300',  'border-emerald-500/25'),
  purnima:   build('bg-sky-500/15',      'text-sky-300',      'border-sky-500/25'),
  amavasya:  build('bg-slate-500/15',    'text-slate-300',    'border-slate-500/25'),
  chaturthi: build('bg-orange-500/15',   'text-orange-300',   'border-orange-500/25'),
  pradosham: build('bg-indigo-500/15',   'text-indigo-300',   'border-indigo-500/25'),
  sankranti: build('bg-amber-500/15',    'text-amber-300',    'border-amber-500/25'),
  jayanti:   build('bg-violet-500/15',   'text-violet-300',   'border-violet-500/25'),
  vrat:      build('bg-purple-500/15',   'text-purple-300',   'border-purple-500/25'),
};

/**
 * Fallback colour for unknown / extra categories (e.g., 'eclipse'
 * which isn't in the canonical FestivalCategory union but appears
 * in calendar entries from special-event sources).
 */
export const FESTIVAL_CATEGORY_FALLBACK: FestivalCategoryColor = build(
  'bg-red-500/15',
  'text-red-300',
  'border-red-500/25',
);

/**
 * Lookup helper. Returns the canonical colour for known categories,
 * or the red-themed fallback for anything else (e.g., 'eclipse').
 */
export function getFestivalCategoryColor(category: string): FestivalCategoryColor {
  // Type-guard via Object.hasOwn — the FestivalCategory union is
  // small and stable, and a runtime check protects against
  // future-added categories that haven't landed in this file yet.
  if (Object.prototype.hasOwnProperty.call(FESTIVAL_CATEGORY_COLORS, category)) {
    return FESTIVAL_CATEGORY_COLORS[category as FestivalCategory];
  }
  return FESTIVAL_CATEGORY_FALLBACK;
}
