/**
 * Single source of truth for "is this festival a vrat day?" classification.
 *
 * Two surfaces previously inlined this rule with subtly different regexes —
 * grid used a slug-set + endsWith, list used a regex. They DRIFTED at PR time
 * (karwa-chauth showed the vrat bar on desktop but not mobile). This module
 * unifies the rule per CLAUDE.md Lesson ZA + the "NEVER Duplicate Logic"
 * hard rule.
 *
 * Canonical signal: `f.category === 'vrat' | 'ekadashi'` set by the festival
 * generator (src/lib/calendar/festival-defs.ts). The slug-pattern check below
 * is **defence-in-depth** for festivals where the API surface forgot to set
 * the category — in those cases we still want the left-edge bar.
 */

export interface VratLikeFestival {
  type?: string;
  slug?: string;
  category?: string;
}

/**
 * Test a single slug string against the vrat-name lexicon.
 * Exported so consumers that only have a slug (e.g. SEO routing) can reuse it.
 */
export function isVratSlug(slug: string | undefined | null): boolean {
  if (!slug) return false;
  // Anchor on '-ekadashi' suffix so unrelated words containing "ekadashi"
  // substring don't accidentally match.
  if (/-ekadashi$/.test(slug)) return true;
  // Known vrat-family names that appear as standalone slugs (no '-vrat' suffix).
  return /(?:^|-)(?:teej|chauth|savitri|vrat|vratam)(?:-|$)/.test(slug);
}

/**
 * Does ANY festival on this day flag it as a vrat day?
 * Used by TithiMonthGrid + TithiMonthList for the purple left-edge bar.
 */
export function isVratDay(festivals: ReadonlyArray<VratLikeFestival> | undefined): boolean {
  if (!festivals) return false;
  return festivals.some((f) => {
    if (f.category === 'vrat' || f.category === 'ekadashi') return true;
    return isVratSlug(f.slug);
  });
}
