/* eslint-disable no-console */
/**
 * Extract translation jobs from ASHRAMS — 4 ashrams × 1 description
 * (plain string en+hi) + 4 ashrams × ~4 focusAreas LocaleText.
 *
 * Keys:
 *   `<id>.description`
 *   `<id>.focusAreas[N]`
 *
 * Ashram name fields (nameEn / nameHi / nameSa) are short proper nouns —
 * the wrap layer inlines transliterations for the 7 regional locales
 * directly (not in this overlay corpus).
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ASHRAMS } from '@/lib/constants/ashram-data';

const LOCALES = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];

interface Job {
  key: string;
  en: string;
}

const OVERLAY_DIR = join(__dirname, '..', 'src', 'lib', 'constants');
const overlays: Record<string, Set<string>> = Object.fromEntries(
  LOCALES.map((l) => [l, new Set<string>()]),
);
for (const locale of LOCALES) {
  const path = join(OVERLAY_DIR, `ashram-data-${locale}-overlay.json`);
  if (!existsSync(path)) continue;
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (typeof v === 'string' && v.trim()) overlays[locale].add(k);
      }
    }
  } catch {
    console.error(`[extract-ashram] malformed ${path}`);
  }
}

const jobs: Record<string, Job[]> = Object.fromEntries(LOCALES.map((l) => [l, []]));

for (const ashram of ASHRAMS) {
  // description
  {
    const key = `${ashram.id}.description`;
    const en = ashram.descriptionEn;
    if (en && en.trim()) {
      for (const locale of LOCALES) {
        if (overlays[locale].has(key)) continue;
        jobs[locale].push({ key, en });
      }
    }
  }
  // focusAreas labels
  ashram.focusAreas.forEach((fa, i) => {
    const key = `${ashram.id}.focusAreas[${i}]`;
    const en = fa.en;
    if (!en || !en.trim()) return;
    for (const locale of LOCALES) {
      if (typeof (fa as Record<string, string>)[locale] === 'string' && (fa as Record<string, string>)[locale].trim()) continue;
      if (overlays[locale].has(key)) continue;
      jobs[locale].push({ key, en });
    }
  });
}

const total = Object.values(jobs).reduce((acc, arr) => acc + arr.length, 0);
const by_locale = Object.fromEntries(Object.entries(jobs).map(([l, arr]) => [l, arr.length]));
console.log(JSON.stringify({ total, by_locale, jobs }, null, 2));
