#!/usr/bin/env tsx
/**
 * Round 2 of the learn h2→h1 sweep — targets the 19 pages that the
 * round-1 codemod skipped because they use a different className pattern:
 *
 *   <h2 className="text-3xl font-bold text-gold-gradient mb-3" ...>
 *
 * Audit 2026-05-25 §A7.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const APPLY = process.argv.includes('--apply');
const LEARN_ROOT = 'src/app/[locale]/learn';

const PATTERNS = [
  '<h2 className="text-3xl font-bold text-gold-gradient mb-3"',
  '<h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-3"',
  '<h2 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3"',
];

function walkPageFiles(dir: string): string[] {
  const out: string[] = [];
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, dirent.name);
    if (dirent.isDirectory()) out.push(...walkPageFiles(p));
    else if (dirent.name === 'page.tsx') out.push(p);
  }
  return out;
}

let migrated = 0;
for (const file of walkPageFiles(LEARN_ROOT)) {
  const src = readFileSync(file, 'utf8');
  // Skip files that already have an h1
  if (/<h1[\s>]/.test(src)) continue;

  let openTag: string | undefined;
  let idx = -1;
  for (const pat of PATTERNS) {
    const i = src.indexOf(pat);
    if (i !== -1 && (idx === -1 || i < idx)) {
      idx = i;
      openTag = pat;
    }
  }
  if (idx === -1 || !openTag) continue;

  const beforeOpen = src.slice(0, idx);
  const fromOpen = src.slice(idx);
  const closeIdx = fromOpen.indexOf('</h2>');
  if (closeIdx === -1) continue;

  const newOpenTag = openTag.replace('<h2 ', '<h1 ');
  const next =
    beforeOpen +
    newOpenTag +
    fromOpen.slice(openTag.length, closeIdx) +
    '</h1>' +
    fromOpen.slice(closeIdx + '</h2>'.length);

  if (APPLY) {
    writeFileSync(file, next, 'utf8');
    console.log(`[apply] ${file}`);
  } else {
    console.log(`[dry-run] would migrate ${file}`);
  }
  migrated++;
}

console.log(`\n${APPLY ? 'Applied' : 'Dry-run'}: ${migrated} migrated.`);
