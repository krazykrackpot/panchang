/* eslint-disable no-console */
/**
 * Extract translation jobs from NAKSHATRA_PADA_EXTRAS (108 padas, each
 * with spiritualPractice + decisions LocaleText fields) for 7 visible
 * regional locales.
 *
 * Keys: `"<nakshatraId>-<pada>.{spiritualPractice|decisions}"`,
 * e.g. `"1-1.spiritualPractice"`, `"27-4.decisions"`.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import data from '@/lib/constants/nakshatra-pada-extras.json';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
const FIELDS = ['spiritualPractice', 'decisions'] as const;

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `nakshatra-pada-extras-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-npe] malformed ${path} — treating as empty`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const [slug, entry] of Object.entries(data as Record<string, Record<string, Record<string, string>>>)) {
  for (const field of FIELDS) {
    const ft = entry[field];
    if (!ft) continue;
    const enSrc = ft.en;
    if (typeof enSrc !== 'string' || !enSrc.trim()) continue;
    for (const locale of LOCALES) {
      if (typeof ft[locale] === 'string' && ft[locale].trim()) continue;
      const key = `${slug}.${field}`;
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en: enSrc });
    }
  }
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
