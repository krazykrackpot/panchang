#!/usr/bin/env tsx
/**
 * Promote the page title from `<h2>` to `<h1>` in `/learn/<topic>/page.tsx`
 * files that follow the LessonSection convention. Targets ONLY the first
 * occurrence per file of the exact title-row pattern so we don't accidentally
 * change h2 section headers further down the page.
 *
 * Audit 2026-05-24 §4.1 — 49 learn sub-pages had no h1.
 *
 * Pattern (shared across 30 learn pages):
 *   &lt;h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" ...&gt;
 *
 * Idempotent.
 *
 * Usage:
 *   npx tsx scripts/learn-h2-to-h1.ts             # dry-run
 *   npx tsx scripts/learn-h2-to-h1.ts --apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const LEARN_ROOT = 'src/app/[locale]/learn';

// First occurrence of this exact opening tag — the page-title <h2>.
const OPEN_TAG = '<h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2"';
const NEW_OPEN_TAG = '<h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2"';

function walkPageFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkPageFiles(p));
    else if (name === 'page.tsx') out.push(p);
  }
  return out;
}

let migrated = 0;
let skipped = 0;
for (const file of walkPageFiles(LEARN_ROOT)) {
  const src = readFileSync(file, 'utf8');
  const idx = src.indexOf(OPEN_TAG);
  if (idx === -1) { skipped++; continue; }

  // Replace only the first occurrence + its matching closing tag.
  // We rely on the page convention that the title-row h2 is followed by
  // a `</h2>` before any other h2 — true for every page that uses this
  // exact open tag (verified across 30 files).
  const beforeOpen = src.slice(0, idx);
  const fromOpen = src.slice(idx);
  const closeIdx = fromOpen.indexOf('</h2>');
  if (closeIdx === -1) {
    console.error(`[skip] ${file} — no matching </h2> after opening h2`);
    skipped++;
    continue;
  }
  const newFromOpen = NEW_OPEN_TAG + fromOpen.slice(OPEN_TAG.length, closeIdx) + '</h1>' + fromOpen.slice(closeIdx + '</h2>'.length);
  const next = beforeOpen + newFromOpen;

  if (next === src) { skipped++; continue; }
  if (APPLY) {
    writeFileSync(file, next, 'utf8');
    console.log(`[apply] ${file}`);
  } else {
    console.log(`[dry-run] would migrate ${file}`);
  }
  migrated++;
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: ${migrated} migrated, ${skipped} skipped.`);
