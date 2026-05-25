#!/usr/bin/env tsx
/**
 * Seed Maithili (mai) message bundles for the `brihaspati` and
 * `sadhakaPath` namespaces from Hindi (hi). Both locales share Devanagari
 * + the Sanskrit-derived Vedic-astrology vocabulary that dominates these
 * namespaces, so a Hindi seed renders correctly for Maithili readers and
 * is far better than the English fallback they currently see.
 *
 * Only replaces strings where `mai[key] === en[key]` (i.e., currently
 * falling back to English). Already-localised mai strings are preserved.
 *
 * Audit 2026-05-25 §B3 (brihaspati) + §B4 (sadhakaPath). Maithili is
 * the #1 traffic driver per project memory.
 *
 * Usage:
 *   npx tsx scripts/seed-mai-from-hi.ts            # dry-run
 *   npx tsx scripts/seed-mai-from-hi.ts --apply
 */
import { readFileSync, writeFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const NAMESPACES = ['brihaspati', 'sadhakaPath'] as const;

const en = JSON.parse(readFileSync('src/messages/en.json', 'utf8'));
const hi = JSON.parse(readFileSync('src/messages/hi.json', 'utf8'));
const mai = JSON.parse(readFileSync('src/messages/mai.json', 'utf8'));

let seeded = 0;
let skipped = 0;

/**
 * Recursive seed walker.
 *
 * Gemini #179 MED — now also handles the "key missing from mai" case:
 * if the key isn't in maiNode at all, create it (string or nested object)
 * from the hi tree. This enables true locale parity for the targeted
 * namespaces — previously the script only replaced mai==en collisions.
 */
function recurse(enNode: unknown, hiNode: unknown, maiNode: unknown, path: string[]): void {
  if (!enNode || typeof enNode !== 'object') return;
  if (!hiNode || typeof hiNode !== 'object') return;
  if (!maiNode || typeof maiNode !== 'object') return;
  const enObj = enNode as Record<string, unknown>;
  const hiObj = hiNode as Record<string, unknown>;
  const maiObj = maiNode as Record<string, unknown>;

  for (const [k, enV] of Object.entries(enObj)) {
    const hiV = hiObj[k];
    const maiV = maiObj[k];
    const nextPath = [...path, k];
    if (typeof enV === 'string') {
      const hasMai = k in maiObj;
      const maiIsString = typeof maiV === 'string';
      const hiIsString = typeof hiV === 'string';
      // Seed when:
      //   (a) key missing from mai entirely, OR
      //   (b) key present but mai value == en value (= silent EN fallback).
      // Source: hi when hi is a non-empty non-en string; otherwise fall through
      // to en (effectively keeping the EN fallback if hi is also fallback).
      const shouldSeed = !hasMai || (maiIsString && maiV === enV);
      const hiSeedOk = hiIsString && hiV !== enV && hiV !== '';
      if (shouldSeed) {
        if (APPLY) maiObj[k] = hiSeedOk ? hiV : enV;
        seeded++;
      } else {
        skipped++;
      }
    } else if (enV && typeof enV === 'object') {
      // Create the nested mai container if it doesn't exist yet so the
      // recursion can descend and seed leaves.
      if (!(k in maiObj) || typeof maiObj[k] !== 'object' || maiObj[k] === null) {
        if (APPLY) maiObj[k] = {};
      }
      recurse(enV, hiV, (APPLY ? maiObj[k] : maiObj[k] ?? {}), nextPath);
    }
  }
}

for (const ns of NAMESPACES) {
  if (!(ns in en) || !(ns in hi) || !(ns in mai)) continue;
  recurse(en[ns], hi[ns], mai[ns], [ns]);
}

if (APPLY) {
  writeFileSync('src/messages/mai.json', JSON.stringify(mai, null, 2) + '\n', 'utf8');
  console.log(`Applied: seeded ${seeded} mai keys from hi (skipped ${skipped} already-localised or missing).`);
} else {
  console.log(`Dry-run: would seed ${seeded} mai keys, skip ${skipped}.`);
}
