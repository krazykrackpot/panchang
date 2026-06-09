#!/usr/bin/env npx tsx
/**
 * Extract per-pair Gemini-grounding records for all 78 unique
 * unordered rashi pairs. Writes `/tmp/rashi-pair-deep-jobs.json`
 * keyed by `<lowerRashiId>-<higherRashiId>`.
 *
 * Each value carries the canonical data Gemini needs for grounding:
 *   - r1Id, r2Id, r1Name (en), r2Name (en)
 *   - r1Element, r2Element, r1Lord, r2Lord
 *   - existingTemplates: a short summary of what the templated
 *     compatibility content already says (so the new fields can
 *     deepen rather than duplicate it).
 */
import { writeFileSync } from 'fs';
import { RASHIS } from '../src/lib/constants/rashis';
import { getPairContent } from '../src/lib/constants/rashi-compatibility';

const out: Record<string, unknown> = {};

for (let r1 = 1; r1 <= 12; r1++) {
  for (let r2 = r1; r2 <= 12; r2++) {
    const pair = getPairContent(r1, r2);
    if (!pair) continue;
    const r1Data = RASHIS[r1 - 1];
    const r2Data = RASHIS[r2 - 1];
    const slug = `${r1}-${r2}`;
    out[slug] = {
      r1Id: r1,
      r2Id: r2,
      r1Name: r1Data?.name?.en ?? `Rashi ${r1}`,
      r2Name: r2Data?.name?.en ?? `Rashi ${r2}`,
      r1Element: typeof r1Data?.element === 'string' ? r1Data.element : (r1Data?.element as Record<string, string> | undefined)?.en ?? '',
      r2Element: typeof r2Data?.element === 'string' ? r2Data.element : (r2Data?.element as Record<string, string> | undefined)?.en ?? '',
      r1Lord: typeof r1Data?.lord === 'string' ? r1Data.lord : (r1Data?.lord as Record<string, string> | undefined)?.en ?? '',
      r2Lord: typeof r2Data?.lord === 'string' ? r2Data.lord : (r2Data?.lord as Record<string, string> | undefined)?.en ?? '',
      score: pair.score,
      // Carry the templated summary so the prompt knows what NOT to
      // duplicate. Stays as the EN string only — the prompt is EN.
      existingSummary: (pair.summary as Record<string, string>).en ?? '',
      existingTemperament: (pair.temperament as Record<string, string>).en ?? '',
      existingRomance: (pair.romance as Record<string, string>).en ?? '',
    };
  }
}

const path = '/tmp/rashi-pair-deep-jobs.json';
writeFileSync(path, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${path} — ${Object.keys(out).length} pairs`);
