import type { MatchedPattern, TippanniSection } from './types';

/**
 * Build section markers from matched patterns.
 * Maps each TippanniSection to the pattern IDs that reference it.
 */
export function buildSectionMarkers(
  patterns: MatchedPattern[]
): Partial<Record<TippanniSection, string[]>> {
  const markers: Partial<Record<TippanniSection, string[]>> = {};

  for (const p of patterns) {
    for (const section of p.relatedSections) {
      if (!markers[section]) markers[section] = [];
      if (!markers[section]!.includes(p.patternId)) {
        markers[section]!.push(p.patternId);
      }
    }
  }

  return markers;
}
