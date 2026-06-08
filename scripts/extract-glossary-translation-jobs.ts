/* eslint-disable no-console */
/**
 * Extract translation jobs from GLOSSARY (45 entries × shortDef +
 * fullDef + optional westernEquivalent plain strings) for 7 visible
 * regional locales.
 *
 * Keys: `"<id>.{shortDef|fullDef|westernEquivalent}"`.
 *
 * `term` is already LocaleText (en+hi+sa) — handled separately by a
 * future PR if regional locales need it (currently the term itself
 * is a proper noun, transliteration only).
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { GLOSSARY } from '@/lib/constants/glossary';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const FIELDS = ['shortDef', 'fullDef', 'westernEquivalent'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `glossary-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-glossary] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const entry of GLOSSARY) {
  for (const field of FIELDS) {
    const en = entry[field];
    if (typeof en !== 'string' || !en.trim()) continue;
    const key = `${entry.id}.${field}`;
    for (const locale of LOCALES) {
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
