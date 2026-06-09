#!/usr/bin/env npx tsx
/**
 * Extract per-yoga input records for the Gemini expansion generator.
 *
 * Writes `/tmp/yoga-expansions-jobs.json` keyed by slug, where each
 * value is a compact JSON record describing the yoga's existing
 * canonical fields. The generator uses this as input context.
 *
 * Compact = we only include fields Gemini needs for grounding:
 * name (en), category, isAuspicious, frequency, formationRule (en),
 * detailedDescription (en), effects (en), cancellations (en),
 * classicalReference if present. NOT chartPositions or relatedYogas
 * (irrelevant for narrative generation) and NOT existing remedies
 * (so generated practicalGuidance stays distinct).
 */
import { writeFileSync } from 'fs';
import { YOGA_DETAIL_DATA } from '../src/lib/constants/yoga-details';

const out: Record<string, unknown> = {};

for (const [slug, yoga] of Object.entries(YOGA_DETAIL_DATA)) {
  out[slug] = {
    name: yoga.name.en,
    category: yoga.category,
    isAuspicious: yoga.isAuspicious,
    frequency: yoga.frequency,
    formationRule: yoga.formationRule.en,
    detailedDescription: yoga.detailedDescription.en,
    effects: yoga.effects.map(e => ({ area: e.area.en, description: e.description.en })),
    ...(yoga.cancellations
      ? { cancellations: yoga.cancellations.map(c => c.en) }
      : {}),
    ...(yoga.classicalReference
      ? { classicalReference: yoga.classicalReference }
      : {}),
  };
}

const path = '/tmp/yoga-expansions-jobs.json';
writeFileSync(path, JSON.stringify(out, null, 2), 'utf-8');
console.log(`Wrote ${path} — ${Object.keys(out).length} slugs`);
