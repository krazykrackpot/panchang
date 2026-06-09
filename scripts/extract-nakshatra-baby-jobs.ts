#!/usr/bin/env npx tsx
/**
 * Extract per-nakshatra input records for the Gemini enrichment
 * generator. Writes `/tmp/nakshatra-baby-jobs.json` keyed by the
 * page slug (e.g. "ashwini", "bharani", "purva-phalguni").
 *
 * Each value is a compact JSON record: name (en), deity (en),
 * ruler (en), symbol, nature (en), startDeg, endDeg, syllableCount.
 * NOT the locale fan-out (we only want EN here as grounding context
 * for Gemini; translations come in a separate pass).
 */
import { writeFileSync } from 'fs';
import { NAKSHATRAS } from '../src/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '../src/lib/constants/nakshatra-syllables';

// Slug → nakshatra ID mapping mirrors the page's SLUG_TO_ID.
const ID_TO_SLUG: Record<number, string> = {
  1: 'ashwini', 2: 'bharani', 3: 'krittika', 4: 'rohini', 5: 'mrigashira',
  6: 'ardra', 7: 'punarvasu', 8: 'pushya', 9: 'ashlesha', 10: 'magha',
  11: 'purva-phalguni', 12: 'uttara-phalguni', 13: 'hasta', 14: 'chitra',
  15: 'swati', 16: 'vishakha', 17: 'anuradha', 18: 'jyeshtha', 19: 'mula',
  20: 'purva-ashadha', 21: 'uttara-ashadha', 22: 'shravana', 23: 'dhanishta',
  24: 'shatabhisha', 25: 'purva-bhadrapada', 26: 'uttara-bhadrapada', 27: 'revati',
};

const out: Record<string, unknown> = {};

for (const nak of NAKSHATRAS) {
  const slug = ID_TO_SLUG[nak.id];
  if (!slug) continue;
  const syllables = NAKSHATRA_SYLLABLES[nak.id] ?? [];
  out[slug] = {
    name: nak.name.en,
    deity: nak.deity.en,
    ruler: nak.ruler,
    rulerName: nak.rulerName.en,
    symbol: nak.symbol,
    nature: nak.nature.en,
    startDeg: nak.startDeg,
    endDeg: nak.endDeg,
    syllables: syllables.map(s => s.en),
  };
}

const path = '/tmp/nakshatra-baby-jobs.json';
writeFileSync(path, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${path} — ${Object.keys(out).length} nakshatras`);
