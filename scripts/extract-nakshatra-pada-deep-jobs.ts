#!/usr/bin/env npx tsx
/**
 * Extract per-pada Gemini-grounding records for all 108 nakshatra-padas.
 * Writes `/tmp/nakshatra-pada-deep-jobs.json` keyed by `<nakshatraId>-<pada>`.
 *
 * Each value carries the canonical data Gemini needs for grounding:
 *   - nakshatraName, nakshatraId, pada
 *   - deity, ruler, syllable, element, navamshaRashi
 *   - personality (EN summary) — from NAKSHATRA_PADA_PROFILES
 * so the generated 4 new fields stay grounded in known facts.
 */
import { writeFileSync } from 'fs';
import { NAKSHATRA_PADA_PROFILES } from '../src/lib/constants/nakshatra-pada-profiles-with-overlay';
import { NAKSHATRAS } from '../src/lib/constants/nakshatras';
import { RASHIS } from '../src/lib/constants/rashis';

const out: Record<string, unknown> = {};

for (const profile of NAKSHATRA_PADA_PROFILES) {
  const nakData = NAKSHATRAS[profile.nakshatraId - 1];
  const navamshaRashi = RASHIS[profile.navamshaSign - 1];
  const slug = `${profile.nakshatraId}-${profile.pada}`;
  out[slug] = {
    nakshatraId: profile.nakshatraId,
    pada: profile.pada,
    nakshatraName: nakData?.name?.en ?? `Nakshatra ${profile.nakshatraId}`,
    deity: profile.deity,
    ruler: profile.ruler,
    syllable: profile.syllable,
    element: profile.element,
    navamshaSign: profile.navamshaSign,
    navamshaName: navamshaRashi?.name?.en ?? `Sign ${profile.navamshaSign}`,
    personality: profile.personality?.en ?? '',
    career: profile.career?.en ?? '',
    relationships: profile.relationships?.en ?? '',
    health: profile.health?.en ?? '',
    keywords: profile.keywords ?? [],
  };
}

const path = '/tmp/nakshatra-pada-deep-jobs.json';
writeFileSync(path, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${path} — ${Object.keys(out).length} padas`);
